import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

def setup_database():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()

        create_table_query = """
        CREATE TABLE IF NOT EXISTS solves (
        id BIGINT PRIMARY KEY,
        time INTEGER NOT NULL,
        scramble TEXT NOT NULL,
        penalty VARCHAR(10) NOT NULL
        );
        """

        cursor.execute(create_table_query)

        conn.commit()

        print("Tabela 'solves' została utworzona(lub juz istniała).")

        cursor.close()
        conn.close()
    except Exception as e:
        print("Błąd podczas tworzenia tabeli: ", e)

if __name__ == "__main__":
    setup_database()