# backend/app/api/employees.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import json, os, threading, math

router = APIRouter(prefix="/employees")

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
LOCK = threading.Lock()

class Location(BaseModel):
    lat: float
    lng: float
    address: Optional[str]

class RegisterRequest(BaseModel):
    employee_id: str
    location: Location

def haversine(lat1, lon1, lat2, lon2):
    # returns distance in kilometers
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return 2 * R * math.asin(math.sqrt(a))

@router.post("/register")
def register_employee(body: RegisterRequest):
    nodal_path = os.path.join(DATA_DIR, "nodal_points.json")
    emp_path   = os.path.join(DATA_DIR, "employee_details.json")

    with LOCK:
        nodals = json.load(open(nodal_path, "r+"))
        # find nearest within 1 km
        nearest = None
        best_d = float("inf")
        for node in nodals:
            d = haversine(body.location.lat, body.location.lng,
                          node["lat"], node["lng"])
            if d < best_d:
                best_d, nearest = d, node
        if best_d > 1.0:
            # create new nodal
            new_node = {
                "id": f"nodal_{len(nodals)+1}",
                "lat": body.location.lat,
                "lng": body.location.lng,
                "address": body.location.address or ""
            }
            nodals.append(new_node)
            nearest = new_node
            # overwrite file
            open(nodal_path, "w").write(json.dumps(nodals, indent=2))

        # now append employee
        emps = json.load(open(emp_path, "r+"))
        emps.append({
            "id": body.employee_id,
            "home": {
                "lat": body.location.lat,
                "lng": body.location.lng,
                "address": body.location.address or ""
            },
            "nodal_point_id": nearest["id"]
        })
        open(emp_path, "w").write(json.dumps(emps, indent=2))

    return {"status": "ok", "assigned_nodal": nearest}
