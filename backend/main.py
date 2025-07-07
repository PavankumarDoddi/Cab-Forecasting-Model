# backend/main.py
from fastapi import FastAPI, HTTPException
import traceback

# <-- Import your function here
from api.allocation import allocate_cabs

app = FastAPI()

@app.post("/allocate_cabs")
async def allocate():
    try:
        result = allocate_cabs()
        return {"allocations": result}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
