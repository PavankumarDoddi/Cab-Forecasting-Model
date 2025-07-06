# allocation.py
import json, random
import numpy as np
from sklearn.cluster import KMeans
from ortools.constraint_solver import pywrapcp, routing_enums_pb2
from datetime import datetime, timedelta
from itertools import groupby

# 1. Helpers to load or generate JSON
def load_or_generate(path, generator_fn):
    try:
        with open(path) as f: return json.load(f)
    except FileNotFoundError:
        data = generator_fn()
        with open(path, "w") as f: json.dump(data, f, indent=2)
        return data

# 2. Random nodal point generator (within Chennai bbox, avoiding sea)
def gen_nodal_points():
    # … your logic to sample 20 lat/lngs on land …
    return [{"id": i+1, "name": f"Nodal {i+1}", "coords": coords} for i, coords in enumerate(samples)]

# 3. Random employee locations near nodal points
def gen_employees(nodal_points):
    emps = []
    for i in range(50):
        nodal = random.choice(nodal_points)
        # jitter <1 km in lat/lon
        lat, lng = nodal["coords"]
        dlat = (random.random() - 0.5) * 0.018   # ~2 km latitude span
        dlng = (random.random() - 0.5) * 0.02    # ~2 km longitude span
        emps.append({
          "employee_id": f"E{100+i}",
          "house_location": {
              "latitude": lat + dlat,
              "longitude": lng + dlng
          },
          "nodal_point_id": nodal["id"]
        })
    return emps

# 4. Assign shifts at random
SHIFTS = {
  "Morning": 6*60,
  "General": 9*60,
  "Mid Day": 11*60,
  "Afternoon": 14*60,
  "Night": 22*60
}
def assign_shifts(employees):
    for e in employees:
        e["shift"] = random.choice(list(SHIFTS.keys()))
    return employees

# 5. Fleet sizing per shift
def fleet_for(n):
    """
    Given n employees, return a list of cab capacities
    e.g. [8,8,5,3] that cover n >= sum(capacities)
    """
    caps = []
    rem = n
    for cap in (8,5,3):
        while rem > 0 and rem >= cap:
            caps.append(cap)
            rem -= cap
    if rem > 0: caps.append( rem<=3 and 3 or 5 )
    return caps

# 6. Cluster employees spatially into k clusters
def cluster_employees(coords, k):
    model = KMeans(n_clusters=k, random_state=0).fit(np.array(coords))
    clusters = {i: [] for i in range(k)}
    for idx, label in enumerate(model.labels_):
        clusters[label].append(idx)
    return list(clusters.values())

# 7. Solve a simple nearest-neighbor route + compute ETAs
def compute_route_and_times(points, office_point, shift_minute):
    """
    points: list of [lat,lng] pickups
    office_point: [lat,lng]
    shift_minute: shift start in minutes from midnight
    Returns ordered route + ETAs
    """
    # greedy nearest-neighbor
    route = []
    visited = set()
    cur = points[0]
    visited.add(0)
    order = [0]
    while len(visited) < len(points):
        dists = [np.linalg.norm(np.array(cur)-np.array(pt)) if i not in visited else np.inf
                 for i,pt in enumerate(points)]
        nxt = int(np.argmin(dists))
        order.append(nxt); visited.add(nxt)
        cur = points[nxt]
    # then go to office
    order.append("office")
    # assume avg speed 40 km/h → 0.667 km/min; distance unit ~deg (~111 km)
    def travel_time(a,b):
        km = np.linalg.norm(np.array(a)-np.array(b))*111
        return km/0.667
    # compute total travel time
    total = 0
    times = []
    for i in range(len(order)-1):
        a = points[order[i]] if order[i]!="office" else office_point
        b = office_point if order[i+1]=="office" else points[order[i+1]]
        dt = travel_time(a,b)
        total += dt
        times.append(total)
    # departure = shift_time - total - 15
    depart = shift_minute - total - 15
    # convert to HH:MM
    etas = []
    for t in times:
        m = depart + t
        hh = int(m//60)%24; mm = int(m%60)
        etas.append(f"{hh:02d}:{mm:02d}")
    return order, etas

# 8. Master allocation function
def allocate_cabs():
    print("Allocating cabs to employees...")
    office = load_or_generate("data/office_location.json", lambda: {})
    nodals = load_or_generate("data/nodal_points.json", gen_nodal_points)
    employees = load_or_generate("data/employee_details.json", lambda: gen_employees(nodals))
    employees = assign_shifts(employees)

    allocations = []
    # group by shift
    for shift, group in groupby(employees, key=lambda e: e["shift"]):
        group = list(group)  # Convert group to a list
        coords = []
        for e in group:
            if shift=="Morning" or shift=="Night":
                 # Convert dict to [lat, lng] list
                coords.append([
                    e["house_location"]["latitude"],
                    e["house_location"]["longitude"]
                ])
            else:
                np_coords = next([
                    n["coordinates"]["latitude"],
                    n["coordinates"]["longitude"]
                ] for n in nodals if n["id"]==e["nodal_point_id"])
                coords.append(np_coords)
        fleet = fleet_for(len(group))
        clusters = cluster_employees(coords, len(fleet))
        for cab_idx, cluster in enumerate(clusters):
            cab_id = f"CAB-{shift[:2]}-{cab_idx+1}"
            pts = [coords[i] for i in cluster]
            order, etas = compute_route_and_times(pts, office["coordinates"], SHIFTS[shift])
            # record per‐employee
            for idx, stop_idx in enumerate(order[:-1]):
                emp = group[cluster[stop_idx]]
                allocations.append({
                  "employee_id": emp["employee_id"],
                  "shift": shift,
                  "pickup": {
                    "type": "doorstep" if shift in ("Morning","Night") else "nodal",
                    "coords": pts[stop_idx]
                  },
                  "cab_id": cab_id,
                  "eta": etas[idx], 
                  "departure": f"{SHIFTS[shift]//60:02d}:{SHIFTS[shift]%60:02d}",
                })
    # persist
    with open("data/employee_cab_allocation.json", "w") as f:
        json.dump(allocations, f, indent=2)
    return allocations
