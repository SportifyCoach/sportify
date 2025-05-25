#! /usr/bin/python3

from optparse import OptionParser
import mysql.connector

def do_query(c, q, n=''):
    if opt.show:
        print("Query is: " + q + " with values " + str(n))
    c.execute(q, n)

optp = OptionParser()
optp.add_option("-i", "--init", dest="init", action="store_true", default=False,
                help="crea taula sessions")
optp.add_option("-a", "--add", dest="add", action="store_true", default=False,
                help = "afegir sessió")
optp.add_option("-d", "--delete", dest="delete", action="store_true", default=False,
                help = "eliminar sessió")
optp.add_option("-l", "--list", dest="list", action="store_true", default=False,
                help = "mostra totes les sessions")
optp.add_option("-s", "--show", dest="show", action="store_true", default=False,
                help = "mostra les comandes")

(opt, args) = optp.parse_args()

conn = mysql.connector.connect(
    host="ubiwan.epsevg.upc.edu",
    port='3306',
    user="amep10", 
    password="iKae6iePa7aiH6",
    database="amep10")

c = conn.cursor()

tabname = "sessio"

# Verificar que les taules relacionades existeixen
def check_foreign_tables():
    for table in ["disciplina", "entrenador"]:
        c.execute("SHOW TABLES LIKE %s;", (table,))
        if not c.fetchone():
            print(f"ERROR: La taula {table} no existeix.")
            exit(1)

if opt.init:
    print("Creating table "+tabname)
    check_foreign_tables()
    try:
        do_query(c, f"""
            CREATE TABLE `{tabname}` (
                id INT AUTO_INCREMENT PRIMARY KEY,
                date DATETIME,
                limit_persones INT,
                disciplina VARCHAR(255),
                entrenador VARCHAR(9),
                FOREIGN KEY (disciplina) REFERENCES disciplina(nom)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                FOREIGN KEY (entrenador) REFERENCES entrenador(dni)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            );
        """)
    except Exception as e:
        print("Table not created: ", e)
        y = input("Try drop table first? [y]:")
        if y == 'y':
            do_query(c, f"DROP TABLE `{tabname}`;")
            do_query(c, f"""
                CREATE TABLE `{tabname}` (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    date DATETIME,
                    limit_persones INT,
                    disciplina VARCHAR(255),
                    entrenador VARCHAR(9),
                    FOREIGN KEY (disciplina) REFERENCES disciplina(nom),
                        ON DELETE CASCADE
                        ON UPDATE CASCADE,
                    FOREIGN KEY (entrenador) REFERENCES entrenador(dni)
                        ON DELETE CASCADE
                        ON UPDATE CASCADE
                );
            """)
    conn.commit()

elif opt.add:
    print("Afegint sessions, deixa la data en blanc per a sortir")
    while True:
        date = input("Data i hora (YYYY-MM-DD HH:MM:SS): ")
        if not date:
            break
        limit = input("Límit de persones: ")
        disciplina = input("Disciplina: ")
        entrenador = input("DNI entrenador: ")
        q = f"INSERT INTO `{tabname}` (date, limit_persones, disciplina, entrenador) VALUES (%s, %s, %s, %s);"
        do_query(c, q, (date, limit, disciplina, entrenador))
    conn.commit()

elif opt.delete:
    print("Esborrant sessió")
    sid = input("ID de la sessió: ")
    q = f"DELETE FROM `{tabname}` WHERE id = %s;"
    do_query(c, q, (sid,))
    conn.commit()
    if c.rowcount:
        print(f"S'ha esborrat la sessió amb id {sid}.")
    else:
        print(f"No s'ha trobat cap sessió amb id {sid}.")

elif opt.list:
    print("Llistant sessions, deixa l'id en blanc per a mostrar tota la taula")
    sid = input("ID de la sessió: ")
    if not sid:
        do_query(c, f"SELECT * FROM `{tabname}`")
        for row in c:
            print("id: %s, date: %s, limit_persones: %s, disciplina: %s, entrenador: %s" % row)
    else:
        q = f"SELECT * FROM `{tabname}` WHERE id = %s;"
        do_query(c, q, (sid,))
        row = c.fetchone()
        if row:
            print("id: %s, date: %s, limit_persones: %s, disciplina: %s, entrenador: %s" % row)
        else:
            print(f"No s'ha trobat cap sessió amb id {sid}.")
else:
    optp.print_help()

c.close()
