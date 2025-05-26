#!/usr/bin/env python3
import sys
import random
from faker import Faker
import mysql.connector
from mysql.connector import Error

# cd /Users/pau/Desktop/GitHub/sportify  # entra a la teva carpeta on està l'arxiu
# python3 -m venv venv
# source venv/bin/activate
# pip install Faker mysql-connector-python
# python afegir_esportistes.py
# deactivate


# Parámetros de conexión
DB_CONFIG = {
    'host':     'ubiwan.epsevg.upc.edu',
    'port':     3306,
    'user':     'amep10',
    'password': 'iKae6iePa7aiH6',
    'database': 'amep10',
    'autocommit': False
}

# Mapa de letras de DNI según algoritmo español
DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE"

def genera_dni(unicos):
    """Genera un DNI español (8 dígitos + letra), único respecto al set 'unicos'."""
    while True:
        num = f"{random.randint(0, 99_999_999):08d}"
        letra = DNI_LETTERS[int(num) % 23]
        dni = num + letra
        if dni not in unicos:
            unicos.add(dni)
            return dni

def genera_tlf():
    """Genera un teléfono móvil español de 9 dígitos que empiece por 6."""
    return '6' + ''.join(random.choices('0123456789', k=8))

def seed_esportistes(count, assign_to_sessions):
    fake = Faker('es_ES')
    conn = None
    cursor = None

    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        # 1) DNIs ya existentes -> para evitar duplicados
        cursor.execute("SELECT dni FROM esportista")
        existentes = {row[0] for row in cursor.fetchall()}

        # 2) Si vamos a asignar a sesiones, obtenemos IDs de sesiones
        sessions = []
        if assign_to_sessions:
            cursor.execute("SELECT id FROM sessio")
            sessions = [row[0] for row in cursor.fetchall()]
            if not sessions:
                print("❌ No hay sesiones en la base de datos. No se pueden asignar.")
                assign_to_sessions = False

        # Sentencias SQL
        insert_esportista_sql = """
            INSERT INTO esportista (dni, nom, cognom, tlf, email)
            VALUES (%s, %s, %s, %s, %s)
        """
        insert_part_sql = """
            INSERT INTO entrenament (sessio_id, esportista_dni, valoracio)
            VALUES (%s, %s, %s)
        """

        # 3) Loop de creación
        for i in range(1, count + 1):
            dni = genera_dni(existentes)
            nom = fake.first_name()
            cognom = fake.last_name()
            tlf = genera_tlf()
            email = fake.email()

            cursor.execute(insert_esportista_sql, (dni, nom, cognom, tlf, email))
            print(f"✔ Esportista {i}/{count} creado: {dni} – {nom} {cognom} (tlf: {tlf})")

            # 4) Asignación aleatoria a sesiones
            if assign_to_sessions:
                k = random.randint(1, min(5, len(sessions)))
                elegidas = random.sample(sessions, k=k)
                for sess_id in elegidas:
                    valor = random.randint(1, 10)
                    cursor.execute(insert_part_sql, (sess_id, dni, valor))
                print(f"   ↳ Asignado a {k} sesiones")

        # 5) Commit final
        conn.commit()
        print(f"\n✅ Se han creado {count} esportistes correctamente.")
        if assign_to_sessions:
            print("   y se han asignado sus participaciones aleatorias.")

    except Error as e:
        print("❌ Error durante el seeding:", e)
        if conn:
            conn.rollback()

    finally:
        if cursor: cursor.close()
        if conn:    conn.close()

if __name__ == '__main__':
    # 0) Preguntas iniciales
    try:
        n = int(input("¿Cuántos esportistes quieres crear? "))
    except ValueError:
        print("Número no válido, usando 10 por defecto.")
        n = 10

    rsp = input("¿Asignarlos después a sesiones aleatorias? (s/N): ").strip().lower()
    assign = rsp.startswith('s')

    seed_esportistes(n, assign)
