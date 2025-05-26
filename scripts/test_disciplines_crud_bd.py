#! /usr/bin/python3

from optparse import OptionParser
import mysql.connector

def do_query(c, q, n=''):
    if opt.show:
        print("Query is: " + q + " with values " + str(n))
    c.execute(q, n)

optp = OptionParser()
optp.add_option("-i", "--init", dest="init", action="store_true", default=False,
                help="crea taula disciplina")
optp.add_option("-a", "--add", dest="add", action="store_true", default=False,
                help = "afegir disciplina")
optp.add_option("-d", "--delete", dest="delete", action="store_true", default=False,
                help = "eliminar disciplina")
optp.add_option("-l", "--list", dest="list", action="store_true", default=False,
                help = "mostra totes les disciplines")
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

tabname = "disciplina"

if opt.init:
    print("Creating table "+tabname)
    try:
        do_query(c, f"""
            CREATE TABLE `{tabname}` (
                nom VARCHAR(255) PRIMARY KEY,
                espai VARCHAR(255)
            );
        """)
    except:
        print("Table not created")
        y = input("Try drop table first? [y]:")
        if y == 'y':
            do_query(c, f"DROP TABLE `{tabname}`;")
            do_query(c, f"""
                CREATE TABLE `{tabname}` (
                    nom VARCHAR(255) PRIMARY KEY,
                    espai VARCHAR(255)
                );
            """)
    conn.commit()

elif opt.add:
    print("Afegint disciplines, deixa el nom en blanc per a sortir")
    while True:
        nom = input("Nom de la disciplina: ")
        if not nom:
            break
        espai = input("Espai: ")
        q = f"INSERT INTO `{tabname}` (nom, espai) VALUES (%s, %s);"
        do_query(c, q, (nom, espai))
    conn.commit()

elif opt.delete:
    print("Esborrant disciplina")
    nom = input("Nom de la disciplina: ")
    q = f"DELETE FROM `{tabname}` WHERE nom = %s;"
    do_query(c, q, (nom,))
    conn.commit()
    if c.rowcount:
        print(f"S'ha esborrat la disciplina amb nom {nom}.")
    else:
        print(f"No s'ha trobat cap disciplina amb nom {nom}.")

elif opt.list:
    print("Llistant disciplines, deixa el nom en blanc per a mostrar tota la taula")
    nom = input("Nom de la disciplina: ")
    if not nom:
        do_query(c, f"SELECT * FROM `{tabname}`")
        for row in c:
            print("nom: %s, espai: %s" % row)
    else:
        q = f"SELECT * FROM `{tabname}` WHERE nom = %s;"
        do_query(c, q, (nom,))
        row = c.fetchone()
        if row:
            print("nom: %s, espai: %s" % row)
        else:
            print(f"No s'ha trobat cap disciplina amb nom {nom}.")
else:
    optp.print_help()

c.close()
conn.close()
