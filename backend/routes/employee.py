
from fastapi import APIRouter
from models import EmployeeRegister, Employee
from database import EMPLOYEES
from utils.location_utils import assign_nearest_nodal_point

router = APIRouter()

@router.post("/register")
def register_employee(emp: EmployeeRegister):
    emp_id = len(EMPLOYEES) + 1
    nodal_point = assign_nearest_nodal_point(emp.location.lat, emp.location.lon)
    employee = Employee(id=emp_id, name=emp.name, location=emp.location, nodal_point=nodal_point)
    EMPLOYEES.append(employee)
    return {"message": "Registration submitted", "emp_id": emp_id, "nodal_point": nodal_point}

@router.get("/list")
def list_pending():
    return [e for e in EMPLOYEES if not e.approved]
