import sqlite3
import os

DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(DB_DIR, "ai_doc_assistant.db")
SCHEMA_FILE = os.path.join(DB_DIR, "schema.sql")

def get_db_connection():
    """Returns a SQLite connection with row factory enabled and foreign keys active."""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    """Initializes the database using the schema.sql script."""
    os.makedirs(DB_DIR, exist_ok=True)
    conn = get_db_connection()
    with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
        schema_sql = f.read()
    conn.executescript(schema_sql)
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at:", DB_FILE)

