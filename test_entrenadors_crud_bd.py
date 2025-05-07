#! /usr/bin/python3

from optparse import OptionParser
import mysql.connector

def do_query(c, q, n=''):
    if opt.show:
        print("Query is: " + q + " with values " + str(n))
    c.execute(q, n)

optp = OptionParser()
optp.add_option("-i", "--init", dest="init", action="store_true", default=False,
                help="crea taula entrenador")
optp.add_option("-a", "--add", dest="add", action="store_true", default=False,
                help = "afegir entrenador")
optp.add_option("-d", "--delete", dest="delete", action="store_true", default=False,
                help = "eliminar entrenador")
optp.add_option("-l", "--list", dest="list", action="store_true", default=False,
                help = "mostra tots els entrenadors")
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

tabname = "entrenador"

if opt.init:
    print("Creating table " + tabname)
    try:
        do_query(c, f"""
            CREATE TABLE IF NOT EXISTS `{tabname}` (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nom VARCHAR(50) NOT NULL,
                cognoms VARCHAR(70) NOT NULL,
                email VARCHAR(120) NOT NULL UNIQUE,
                especialitat VARCHAR(80) NOT NULL,
                experiencia INT NOT NULL
            );
        """)
    except:
        print("Table not created")
        y = input("Try drop table first? [y]:")
        if y == 'y':
            do_query(c, f"DROP TABLE `{tabname}`;")
            do_query(c, f"""
                CREATE TABLE `{tabname}` (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nom VARCHAR(50) NOT NULL,
                    cognoms VARCHAR(70) NOT NULL,
                    email VARCHAR(120) NOT NULL UNIQUE,
                    especialitat VARCHAR(80) NOT NULL,
                    experiencia INT NOT NULL
                );
            """)
    conn.commit()

elif opt.add:
    print("Afegint entrenadors, deixa el nom en blanc per a sortir")
    while True:
        nom = input("Nom: ")
        if not nom:
            break
        cognoms = input("Cognoms: ")
        email = input("Email: ")
        especialitat = input("Especialitat: ")
        experiencia = input("Anys d'experiència: ")
        q = f"""
            INSERT INTO `{tabname}` 
            (nom, cognoms, email, especialitat, experiencia) 
            VALUES (%s, %s, %s, %s, %s);
        """
        do_query(c, q, (nom, cognoms, email, especialitat, experiencia))
    conn.commit()

elif opt.delete:
    print("Esborrant entrenador per ID")
    id = input("ID de l'entrenador: ")
    q = f"DELETE FROM `{tabname}` WHERE id = %s;"
    do_query(c, q, (id,))
    conn.commit()
    if c.rowcount:
        print(f"S'ha esborrat l'entrenador amb ID {id}.")
    else:
        print(f"No s'ha trobat cap entrenador amb ID {id}.")

elif opt.list:
    print("Llistant entrenadors, deixa el ID en blanc per a mostrar tots")
    id = input("ID de l'entrenador: ")
    if not id:
        do_query(c, f"SELECT id, nom, cognoms, email, especialitat, experiencia FROM `{tabname}`")
        for row in c:
            print("ID: %d, Nom: %s, Cognoms: %s, Email: %s, Especialitat: %s, Experiència: %d" % row)
    else:
        q = f"""
            SELECT id, nom, cognoms, email, especialitat, experiencia 
            FROM `{tabname}` WHERE id = %s;
        """
        do_query(c, q, (id,))
        row = c.fetchone()
        if row:
            print("ID: %d, Nom: %s, Cognoms: %s, Email: %s, Especialitat: %s, Experiència: %d" % row)
        else:
            print(f"No s'ha trobat cap entrenador amb ID {id}.")
else:
    optp.print_help()

c.close()
