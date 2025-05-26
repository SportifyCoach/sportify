#! /usr/bin/python3

from optparse import OptionParser
import mysql.connector

def do_query(c, q, n=''):
    if opt.show:
        print("Query is: " + q + " with values " + str(n))
    c.execute(q, n)

optp = OptionParser()
optp.add_option("-i", "--init", dest="init", action="store_true", default=False,
                help="crea taula entrenament")
optp.add_option("-a", "--add", dest="add", action="store_true", default=False,
                help = "afegir entrenament")
optp.add_option("-d", "--delete", dest="delete", action="store_true", default=False,
                help = "eliminar entrenament")
optp.add_option("-l", "--list", dest="list", action="store_true", default=False,
                help = "mostra tots els entrenaments")
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

tabname = "entrenament"

if opt.init:
    print("Creating table " + tabname)
    try:
        do_query(c, f"""
            CREATE TABLE IF NOT EXISTS `{tabname}` (
                id INT AUTO_INCREMENT PRIMARY KEY,
                valoracio FLOAT,
                sessio_id INT,
                esportista_dni VARCHAR(9),
                FOREIGN KEY (sessio_id) REFERENCES sessio(id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                FOREIGN KEY (esportista_dni) REFERENCES esportista(dni)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                UNIQUE (esportista_dni, sessio_id)
            );
        """)
    except Exception as e:
        print("Table not created:", e)
        y = input("Try drop table first? [y]:")
        if y == 'y':
            do_query(c, f"DROP TABLE `{tabname}`;")
            do_query(c, f"""
                CREATE TABLE IF NOT EXISTS `{tabname}` (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    valoracio FLOAT,
                    sessio_id INT,
                    esportista_dni VARCHAR(9),
                    FOREIGN KEY (sessio_id) REFERENCES sessio(id)
                        ON DELETE CASCADE
                        ON UPDATE CASCADE,
                    FOREIGN KEY (esportista_dni) REFERENCES esportista(dni)
                        ON DELETE CASCADE
                        ON UPDATE CASCADE,
                    UNIQUE (esportista_dni, sessio_id)
                );
            """)
    conn.commit()

elif opt.add:
    print("Afegint entrenaments, deixa la valoració en blanc per a sortir")
    while True:
        valoracio = input("Valoració (0-10): ")
        if not valoracio:
            break
        sessio_id = input("ID de la sessió: ")
        esportista_dni = input("DNI de l'esportista: ")
        q = f"""
            INSERT INTO `{tabname}` 
            (valoracio, sessio_id, esportista_dni) 
            VALUES (%s, %s, %s);
        """
        do_query(c, q, (valoracio, sessio_id, esportista_dni))
    conn.commit()

elif opt.delete:
    print("Esborrant entrenament")
    id = input("ID de l'entrenament: ")
    q = f"DELETE FROM `{tabname}` WHERE id = %s;"
    do_query(c, q, (id,))
    conn.commit()
    if c.rowcount:
        print(f"S'ha esborrat l'entrenament amb ID {id}.")
    else:
        print(f"No s'ha trobat cap entrenament amb ID {id}.")

elif opt.list:
    print("Llistant entrenaments, deixa el ID en blanc per mostrar-los tots")
    id = input("ID de l'entrenament: ")
    if not id:
        do_query(c, f"SELECT id, valoracio, sessio_id, esportista_dni FROM `{tabname}`")
        for row in c:
            print("ID: %d, Valoració: %.2f, Sessió ID: %d, Esportista DNI: %s" % row)
    else:
        q = f"SELECT id, valoracio, sessio_id, esportista_dni FROM `{tabname}` WHERE id = %s;"
        do_query(c, q, (id,))
        row = c.fetchone()
        if row:
            print("ID: %d, Valoració: %.2f, Sessió ID: %d, Esportista DNI: %s" % row)
        else:
            print(f"No s'ha trobat cap entrenament amb ID {id}.")
else:
    optp.print_help()

c.close()
