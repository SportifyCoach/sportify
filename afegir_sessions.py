#!/usr/bin/env python3
import sys
import random
from faker import Faker
import mysql.connector
from mysql.connector import Error

# Paràmetres de connexió
DB_CONFIG = {
    'host':     'ubiwan.epsevg.upc.edu',
    'port':     3306,
    'user':     'amep10',
    'password': 'iKae6iePa7aiH6',
    'database': 'amep10',
    'autocommit': False
}

DISCIPLINES = [ 'bàsquet', 'futbol', 'rugbi', 'atletisme', 'natació', 'handbol' ]

def seed_sessions(count=50):
    fake = Faker('es_ES')
    conn = None
    cursor = None

    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        # 1) Obtenir llistes vàlides de la BBDD
        cursor.execute("SELECT dni FROM entrenador")
        entrenadors = [row[0] for row in cursor.fetchall()]
        if not entrenadors:
            print("❌ No hi ha entrenadors a la BBDD. Aborta.")
            return

        cursor.execute("SELECT nom FROM disciplina")
        disciplines = [row[0] for row in cursor.fetchall()]
        if not disciplines:
            print("❌ No hi ha disciplines a la BBDD. Aborta.")
            return

        cursor.execute("SELECT dni FROM esportista")
        esportistes = [row[0] for row in cursor.fetchall()]
        if not esportistes:
            print("❌ No hi ha esportistes a la BBDD. Aborta.")
            return

        insert_sql = """
            INSERT INTO sessio
              (date, limit_persones, disciplina, entrenador)
            VALUES (%s, %s, %s, %s)
        """

        insert_participant_sql = """
            INSERT INTO entrenament (sessio_id, esportista_dni, valoracio)
            VALUES (%s, %s, %s)
        """

        # 2) Loop d’insercions
        for i in range(count):
            # Data en el futur
            dt = fake.date_time_between(start_date="now", end_date="+30d")
            date_str = dt.strftime('%Y-%m-%d %H:%M:%S')

            # Tria un entrenador i una disciplina reals
            entrenador = random.choice(entrenadors)
            disciplina = random.choice(disciplines)

            # Límit de participants
            limit_persones = fake.random_int(min=5, max=30)

            # Inserció
            cursor.execute(insert_sql, (
                date_str,
                limit_persones,
                disciplina,
                entrenador
            ))
            sessio_id = cursor.lastrowid
            print(f"✔ Sessió {i+1}/{count} inserida (ID prov. {sessio_id})")

            # 3) Inserir alguns participants (entre 1 i min(5, limit_persones))
            num_part = random.randint(1, limit_persones)
            # Tria sense repetició
            participants = random.sample(esportistes, k=num_part)
            for dni in participants:
                valoracio = fake.random_int(min=1, max=5)
                cursor.execute(insert_participant_sql, (
                    sessio_id,
                    dni,
                    valoracio
                ))
            print(f"   ↳ Afegits {num_part} participants.")

        # 4) Commit
        conn.commit()
        print(f"\n✅ S'han creat {count} sessions correctament.")

    except Error as e:
        print("❌ Error durant el seeding:", e)
        if conn:
            conn.rollback()

    finally:
        if cursor: cursor.close()
        if conn:    conn.close()

if __name__ == '__main__':
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 50
    seed_sessions(n)