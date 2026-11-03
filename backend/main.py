from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL)
    return conn
try:
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT version();")
    db_version = cursor.fetchone()

    print(f"Successfully connected to Neon DB. Version: {db_version[0]}")

    cursor.close()
    conn.close()
except Exception as e:
    print(f"Database connection error: {e}")


app = FastAPI()

@app.get("/api/health")
def health():
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://speedcube-timer-delta.vercel.app",
        "http://localhost:5173"
        ],
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
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        insert_query = "INSERT INTO solves VALUES(%s, %s, %s, %s)"
        cursor.execute(insert_query, (new_solve.id, new_solve.time, new_solve.scramble, new_solve.penalty))
        
        conn.commit()
        cursor.close()
        conn.close()
        return {"status": "success", "saved_id": new_solve.id}

    except Exception as e:
        print(f"Database save error: {e}")
        return{"status": "error", "message": "Database failure"}

@app.get("/api/solves")
def get_all_solves():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id, time, scramble, penalty FROM solves")

        rows = cursor.fetchall()

        cursor.close()
        conn.close()

        formatted_solves = []
        for row in rows:
            formatted_solves.append({
                "id": row[0],
                "time": row[1],
                "scramble": row[2],
                "penalty": row[3],
            })
        return formatted_solves

    except Exception as e:
        print(f"Database read error: {e}")
        return{"status": "error", "message": "Database failure"}

@app.put("/api/solves/{solve_id}")
def update_penalty(solve_id: int, update_data: PenaltyUpdate):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("UPDATE solves SET penalty = %s WHERE id = %s", (update_data.penalty, solve_id))

        conn.commit()

        cursor.close()
        conn.close()

        return {"status": "success", "saved_id": solve_id}

    except Exception as e:
        print(f"Database update error: {e}")
        return{"status": "error", "message": "Database failure"}

@app.delete("/api/solves/{solve_id}")
def delete_solve(solve_id: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM solves WHERE id = %s", (solve_id,))

        conn.commit()

        cursor.close()
        conn.close()

        return {"status": "success", "deleted_id": solve_id}

    except Exception as e:
        print(f"Database delete error: {e}")
        return{"status": "error", "message": "Database failure"}







