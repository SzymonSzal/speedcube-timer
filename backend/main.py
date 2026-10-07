from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
    time: int
    # Kiedy będziesz gotowy, po prostu dopiszesz tu 'scramble: str' i 'penalty: str'

@app.post("/api/solves")
def receive_solve(data: SolveData):
    # Drukowanie w konsoli serwera
    print(f"🎉 Otrzymano nowy czas z Reacta: {data.time} ms!")
    
    # Zwracamy odpowiedź do Reacta, żeby wiedział, że się udało
    return {"status": "success", "saved_time": data.time}