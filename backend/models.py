
from pydantic import BaseModel
from typing import Optional, List

class Location(BaseModel):
    lat: float
    lon: float
    address: Optional[str] = None

class EmployeeRegister(BaseModel):
    name: str
    location: Location

class Employee(BaseModel):
    id: int
    name: str
    location: Location
    nodal_point: Optional[str] = None
    shift: Optional[str] = None
    approved: bool = False

class Cab(BaseModel):
    cab_id: str
    cab_type: str
    shift: str
    employees: List[Employee]
    route: List[Location]
    pickup_type: str
    estimated_arrival_times: List[str]
