
from fastapi import APIRouter
from database import APPROVED_EMPLOYEES, CABS_ALLOCATED
from utils.cab_utils import assign_random_shifts, allocate_cabs

router = APIRouter()

@router.post("/forecast")
def forecast_cabs():
    assign_random_shifts(APPROVED_EMPLOYEES)
    cab_list = allocate_cabs(APPROVED_EMPLOYEES)
    CABS_ALLOCATED.clear()
    for cab in cab_list:
        key = f"{cab.shift}:{cab.cab_id}"
        CABS_ALLOCATED[key] = cab
    return {"message": "Cab forecast completed", "total_cabs": len(cab_list)}

@router.get("/list")
def list_all_cabs():
    return list(CABS_ALLOCATED.values())

@router.get("/by_shift/{shift}")
def cabs_by_shift(shift: str):
    return [v for k, v in CABS_ALLOCATED.items() if k.startswith(shift)]

@router.get("/by_cab/{shift}/{cab_id}")
def cab_details(shift: str, cab_id: str):
    return CABS_ALLOCATED.get(f"{shift}:{cab_id}", {})
