from datetime import datetime, timedelta
import mysql.connector
import random
import subprocess

def do_query(c, q, n=''):
    c.execute(q, n)

conn = mysql.connector.connect(
    host="ubiwan.epsevg.upc.edu",
    port='3306',
    user="amep10", 
    password="iKae6iePa7aiH6",
    database="amep10")

c = conn.cursor()

tables = ["entrenament", "sessio", "esportista", "entrenador", "disciplina"]
for table in tables:
    try:
        q = f"DROP TABLE IF EXISTS {table};"
        do_query(c, q)
        print(f"Taula eliminada: {table}")
    except mysql.connector.Error as err:
        print(f"No s'ha pogut eliminar la taula {table}: {err}")

conn.commit()

try:
    subprocess.run(["python3", "test_disciplines_crud_bd.py", "-i"], check=True)
    subprocess.run(["python3", "test_entrenadors_crud_bd.py", "-i"], check=True)
    subprocess.run(["python3", "test_esportistes_crud_bd.py", "-i"], check=True)
    subprocess.run(["python3", "test_sessions_crud_bd.py", "-i"], check=True)
    subprocess.run(["python3", "test_entrenaments_crud_bd.py", "-i"], check=True)
except subprocess.CalledProcessError as e:
    print(f"Error: {e}")

tabname = "disciplina";

# Inserció automàtica de disciplines de prova
disciplines = [
    ("Futbol sala", "Pista poliesportiva 1"),
    ("Bàsquet", "Pavelló 2"),
    ("Rugby", "Camp exterior 1"),
    ("Atletisme", "Pista d'atletisme"),
    ("Handbol", "Pavelló 1"),
    ("Natació", "Piscina olímpica"),
    ("Escalada", "Rocòdrom"),
    ("Ioga", "Sala de fitness 3"),
    ("Ciclisme indoor", "Sala de spinning"),
    ("Zumba", "Sala de ball")
]

for disciplina in disciplines:
    try:
        q = f"INSERT INTO `{tabname}` (nom, espai) VALUES (%s, %s);"
        do_query(c, q, disciplina)
    except mysql.connector.Error as err:
        print(f"No s'ha pogut inserir {disciplina[0]}: {err}")

conn.commit()
print("S'han afegit les disciplines.")


tabname = "entrenador";

# Inserció automàtica de 5 entrenadors
entrenadors = [
    ("12345678A", "Laura", "Gómez Riera", "laura.gomez@example.com", "rugby", 5),
    ("23456789B", "Marc", "Solé Vidal", "marc.sole@example.com", "bàsquet", 8),
    ("34567890C", "Anna", "Costa Puig", "anna.costa@example.com", "atletisme", 6),
    ("45678901D", "Pere", "Martínez Serra", "pere.martinez@example.com", "futbol sala", 10),
    ("56789012E", "Clara", "Fernández Pons", "clara.fernandez@example.com", "handbol", 7)
]

for entrenador in entrenadors:
    try:
        q = f"""
            INSERT INTO `{tabname}` 
            (dni, nom, cognoms, email, especialitat, experiencia) 
            VALUES (%s, %s, %s, %s, %s, %s);
"""
        do_query(c, q, entrenador)
    except mysql.connector.Error as err:
        print(f"No s'ha pogut inserir {entrenador[0]}: {err}")

conn.commit()
print("S'han afegit els entrenadors.")


tabname = "esportista";

esportistes = [
        ("12345678A", "Marc", "Garcia", "612345678", "marc.garcia@email.com"),
        ("23456789B", "Laura", "Fernandez", "622345678", "laura.fernandez@email.com"),
        ("34567890C", "Joan", "Martínez", "632345678", "joan.martinez@email.com"),
        ("45678901D", "Anna", "Sánchez", "642345678", "anna.sanchez@email.com"),
        ("56789012E", "David", "Lopez", "652345678", "david.lopez@email.com"),
    ]
for e in esportistes:
    try:
        q = f"INSERT INTO `{tabname}` VALUES (%s, %s, %s, %s, %s);"
        do_query(c, q, e)
    except mysql.connector.Error as err:
        print(f"Error amb {e[0]}: {err}")
conn.commit()
print("S'han afegits els esportistes.")

# Llista d'exemples de disciplines i entrenadors (DNI's existents)
disciplines = [
        'Rugby', 
        'Bàsquet', 
        'Atletisme', 
        'Futbol sala', 
        'Handbol'
    ]
entrenadors = [
        '12345678A', 
        '23456789B', 
        '34567890C', 
        '45678901D', '56789012E'
    ]


tabname = "sessio";

# Generar entre sessions
for i in range(10):
    date = datetime.now() + timedelta(days=random.randint(-60, 7), hours=random.randint(8, 18))
    limit = random.choice([10, 12, 15, 20, 26, 28, 30, 32, 35, 40])
    disciplina = random.choice(disciplines)
    entrenador = random.choice(entrenadors)

    q = f"INSERT INTO `{tabname}` (date, limit_persones, disciplina, entrenador) VALUES (%s, %s, %s, %s);"
    do_query(c, q, (date.strftime('%Y-%m-%d %H:%M:%S'), limit, disciplina, entrenador))

conn.commit()
print("S'han afegit les sessions fictícies.")

tabname = "entrenament"  # Nombre de la tabla para los entrenamientos

# Obtener IDs de sesiones y DNI de deportistas existentes
q_sessio = "SELECT id, date FROM sessio;"
do_query(c, q_sessio)
sessions = [(row[0], row[1]) for row in c.fetchall()]
q_sessio = "SELECT date FROM sessio;"
do_query(c, q_sessio)
sessions_date = [row[0] for row in c.fetchall()]

q_esportista = "SELECT dni FROM esportista;"
do_query(c, q_esportista)
athletes = [row[0] for row in c.fetchall()]

# Generar entrenaments
for i in range(40):
    session = random.choice(sessions)
    sessio_id = session[0]
    sessio_date = session[1]
    esportista_dni = random.choice(athletes)

    now = datetime.now()

    if sessio_date > now:
        valoracio = None
    else:
        valoracio = round(random.uniform(1, 10), 1)

    q = f"""
        INSERT INTO `{tabname}` 
        (valoracio, sessio_id, esportista_dni) 
        VALUES (%s, %s, %s);
    """
    do_query(c, q, (valoracio, sessio_id, esportista_dni))

conn.commit()
print("S'han afegit els entrenaments.")

c.close()