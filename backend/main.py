from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

solves = []

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class SolveData(BaseModel):
    id: int
    time: int
    scramble: str
    penalty: str

class PenaltyUpdate(BaseModel):
    penalty: str

@app.post("/api/solves")
def receive_solve(new_solve: SolveData):
    solves.append(new_solve)
    return {"status": "success", "saved_time": new_solve.time}

@app.get("/api/solves")
def get_all_solves():
    return solves

@app.put("/api/solves/{solve_id}")
def update_penalty(solve_id: int, update_data: PenaltyUpdate):
    for solve in solves:
        if solve.id == solve_id:
            solve.penalty = update_data.penalty
            break
    return {"message": "modified penalty"}

@app.delete("/api/solves/{solve_id}")
def delete_solve(solve_id: int):
    for solve in solves:
        if solve.id == solve_id:
            solves.remove(solve)
            break
    return {"message": "deleted solve"}







