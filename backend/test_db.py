import sys
from sqlalchemy import create_engine, text

try:
    engine = create_engine('postgresql://postgres:rayen123@localhost:5432/postgres', isolation_level='AUTOCOMMIT')
    with engine.connect() as conn:
        conn.execute(text("CREATE DATABASE it_equipment;"))
    print('SUCCESS')
except Exception as e:
    print(repr(e))
