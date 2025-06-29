from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from geopy.distance import geodesic
import random
import uvicorn

app = FastAPI()

employees = []
approved_employees = []

nodal_points = [
    {"name": "Guindy Metro", "lat": 13.0060, "lon": 80.2206},
    {"name": "Taramani MRTS", "lat": 12.9858, "lon": 80.2465},
    {"name": "Anna Nagar Tower", "lat": 13.0862, "lon": 80.2209},
    {"name": "Vadapalani Temple", "lat": 13.0474, "lon": 80.2123},
    {"name": "Chennai Central", "lat": 13.0827, "lon": 80.2707},
    {"name": "CMBT", "lat": 13.0686, "lon": 80.2175},
    {"name": "Adyar Depot", "lat": 13.0067, "lon": 80.2556},
    {"name": "Saidapet Court", "lat": 13.0261, "lon": 80.2296},
    {"name": "Ashok Pillar", "lat": 13.0409, "lon": 80.2120},
    {"name": "Thoraipakkam", "lat": 12.9488, "lon": 80.2360},
    {"name": "Sholinganallur", "lat": 12.8996, "lon": 80.2270},
    {"name": "Pallavaram", "lat": 12.9675, "lon": 80.1491},
    {"name": "Medavakkam", "lat": 12.9229, "lon": 80.1833},
    {"name": "Mylapore Tank", "lat": 13.0333, "lon": 80.2667},
    {"name": "Perungudi Signal", "lat": 12.9611, "lon": 80.2396},
    {"name": "Besant Nagar Bus Stop", "lat": 12.9982, "lon": 80.2635}
]

shift_timings = {
    "Morning": {"time": "06:00", "pickup_type": "doorstep"},
    "General": {"time": "09:00", "pickup_type": "nodal"},
    "Mid Day": {"time": "11:00", "pickup_type": "nodal"},
    "Afternoon": {"time": "14:00", "pickup_type": "nodal"},
    "Night": {"time": "22:00", "pickup_type": "doorstep"},
}

cabs = ["3-seater", "5-seater", "8-seater"]

class RegisterRequest(BaseModel):
    name: str
    address: str
    lat: float
    lon: float

class ApproveRequest(BaseModel):
    id: int

@app.post("/register")
def register_user(req: RegisterRequest):
    nearest = min(nodal_points, key=lambda n: geodesic((req.lat, req.lon), (n["lat"], n["lon"])))
    shift = random.choice(list(shift_timings.keys()))
    emp = req.dict()
    emp.update({"id": len(employees), "nodal": nearest["name"], "shift": shift, "approved": False})
    employees.append(emp)
    return emp

@app.get("/pending")
def list_pending():
    return [e for e in employees if not e["approved"]]

@app.post("/approve")
def approve_user(req: ApproveRequest):
    for e in employees:
        if e["id"] == req.id:
            e["approved"] = True
            approved_employees.append(e)
            return {"message": "Approved"}
    raise HTTPException(404, "Employee not found")

@app.get("/approved")
def list_approved():
    return approved_employees

@app.get("/cab_forecast")
def forecast():
    shift_groups = {s: [] for s in shift_timings}
    for e in approved_employees:
        shift_groups[e["shift"]].append(e)

    shift_cabs = {}
    for shift, group in shift_groups.items():
        random.shuffle(group)
        cab_list = [group[i:i+3] for i in range(0, len(group), 3)]
        shift_cabs[shift] = [{"cab_id": f"CAB_{i}", "employees": c, "cab_type": random.choice(cabs)} for i, c in enumerate(cab_list)]

    return shift_cabs
