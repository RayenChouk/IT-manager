import sys
from sqlalchemy import create_engine, text

def run():
    engine = create_engine('postgresql://postgres:rayen123@localhost:5432/it_equipment')
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE equipment ADD COLUMN warranty_end_date DATE;"))
            conn.commit()
            print("SUCCESS")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == '__main__':
    run()
