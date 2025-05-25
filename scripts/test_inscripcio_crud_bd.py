#! /usr/bin/python3

from optparse import OptionParser
import mysql.connector

def do_query(c, q, n=''):
    if opt.show:
        print("Query is: " + q + " with values " + str(n))
    c.execute(q, n)

optp = OptionParser()
optp.add_option("-i", "--init", dest="init", action="store_true", default=False,
                help="crea taula inscripcio")
optp.add_option("-a", "--add", dest="add", action="store_true", default=False,
                help = "afegir inscripció")
optp.add_option("-d", "--delete", dest="delete", action="store_true", default=False,
                help = "eliminar inscripció")
optp.add_option("-l", "--list", dest="list", action="store_true", default=False,
                help = "mostra totes les inscripcions")
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

tabname = "inscripcio"

# Verifica que les taules relacionades existeixen
def check_foreign_tables():
    for table in ["esportista", "sessio"]:
        c.execute("SHOW TABLES LIKE %s;", (table,))
        if not c.fetchone():
            print(f"ERROR: La taula {table} no existeix.")
            exit(1)

if opt.init:
    print("Creating table " + tabname)
    check_foreign_tables()
    try:
        do_query(c, f"""
            CREATE TABLE {tabname} (
                esportista_dni VARCHAR(9),
                sessio_id INT,
                PRIMARY KEY (esportista_dni, sessio_id),
                FOREIGN KEY (esportista_dni) REFERENCES esportista(dni),
                FOREIGN KEY (sessio_id) REFERENCES sessio(id)
            );
        """)
    except:
        print("Table not created")
        y = input("Try drop table first? [y]:")
        if y.lower() == 'y':
            do_query(c, f"DROP TABLE {tabname};")
            do_query(c, f"""
                CREATE TABLE {tabname} (
                    esportista_dni VARCHAR(9),
                    sessio_id INT,
                    PRIMARY KEY (esportista_dni, sessio_id),
                    FOREIGN KEY (esportista_dni) REFERENCES esportista(dni),
                    FOREIGN KEY (sessio_id) REFERENCES sessio(id)
                );
            """)
    conn.commit()

elif opt.add:
    print("Afegint inscripcions, deixa el dni en blanc per a sortir")
    while True:
        dni = input("DNI de l'esportista: ")
        if not dni:
            break
        sessio_id = input("ID de la sessió: ")
        q = f"INSERT INTO `{tabname}` VALUES (%s, %s);"
        do_query(c, q, (dni, sessio_id))
    conn.commit()

elif opt.delete:
    print("Esborrant inscripció")
    dni = input("DNI de l'esportista: ")
    sessio_id = input("ID de la sessió: ")
    q = f"DELETE FROM `{tabname}` WHERE esportista_dni = %s AND sessio_id = %s;"
    do_query(c, q, (dni, sessio_id))
    conn.commit()
    if c.rowcount:
        print(f"S'ha esborrat la inscripció de {dni} a la sessió {sessio_id}.")
    else:
        print("No s'ha trobat cap inscripció amb aquestes dades.")

elif opt.list:
    print("Llistant inscripcions, deixa el dni en blanc per a mostrar totes")
    dni = input("DNI de l'esportista: ")
    if not dni:
        do_query(c, f"SELECT * FROM `{tabname}`")
        for row in c:
            print("DNI: %s, Sessió: %s" % (row[0], row[1]))
    else:
        q = f"SELECT * FROM `{tabname}` WHERE esportista_dni = %s;"
        do_query(c, q, (dni,))
        for row in c:
            print("DNI: %s, Sessió: %s" % (row[0], row[1]))
else:
    optp.print_help()

c.close()
