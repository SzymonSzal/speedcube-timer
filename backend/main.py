from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

solves = []

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # W produkcji zamienisz to na swój adres z Vercela
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic to taki odpowiednik Twojego "type Solve = {}" z TypeScriptu
class SolveData(BaseModel):
    id: int
    time: int
    scramble: str
    penalty: str
    # Kiedy będziesz gotowy, po prostu dopiszesz tu 'scramble: str' i 'penalty: str'

class PenaltyUpdate(BaseModel):
    penalty: str

@app.put("/api/solves/{solve_id}")
def update_penalty(solve_id: int, update_data: PenaltyUpdate):
    for solve in solves:
        if solve.id == solve_id:
            solve.penalty = update_data.penalty
            break
    return {"message": "modified penalty"}


@app.get("/api/solves")
def get_all_solves():
    return solves

@app.post("/api/solves")
def receive_solve(new_solve: SolveData):
    solves.append(new_solve)

    # Drukowanie w konsoli serwera
    print(f"🎉 Otrzymano nowy czas z Reacta: {new_solve.time} ms!")
    print(new_solve.id, new_solve.scramble, new_solve.penalty)

    
    # Zwracamy odpowiedź do Reacta, żeby wiedział, że się udało
    return {"status": "success", "saved_time": new_solve.time}

