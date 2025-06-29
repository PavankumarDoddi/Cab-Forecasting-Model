
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import employee, admin, cab_allocation

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employee.router, prefix="/employee", tags=["Employee"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(cab_allocation.router, prefix="/cab", tags=["Cab Allocation"])

@app.get("/")
def root():
    return {"message": "Cab Forecasting API is running"}
