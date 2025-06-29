
from fastapi import APIRouter
from database import EMPLOYEES, APPROVED_EMPLOYEES

router = APIRouter()

@router.post("/approve/{emp_id}")
def approve_employee(emp_id: int):
    for e in EMPLOYEES:
        if e.id == emp_id:
            e.approved = True
            APPROVED_EMPLOYEES.append(e)
            return {"message": f"Employee {emp_id} approved"}
    return {"error": "Employee not found"}

@router.get("/approved")
def get_approved():
    return APPROVED_EMPLOYEES
