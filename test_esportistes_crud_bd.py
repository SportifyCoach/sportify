#! /usr/bin/python3

from optparse import OptionParser
import mysql.connector

def do_query(c, q, n=''):
    if opt.show:
        print("Query is: " + q + " with values " + str(n))
    c.execute(q, n)

optp = OptionParser()
optp.add_option("-i", "--init", dest="init", action="store_true", default=False,
                help="crea taula esportistes")
optp.add_option("-a", "--add", dest="add", action="store_true", default=False,
                help = "afegir esportista")
optp.add_option("-d", "--delete", dest="delete", action="store_true", default=False,
                help = "eliminar esportista")
optp.add_option("-l", "--list", dest="list", action="store_true", default=False,
                help = "mostra tots els esportistes")
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

tabname = "esportista"

if opt.init:
    print("Creating table " + tabname)
    try:
        do_query(c, f"""
            CREATE TABLE {tabname} (
                dni VARCHAR(9) PRIMARY KEY,
                nom VARCHAR(30),
                cognom VARCHAR(30),
                tlf VARCHAR(15),
                email VARCHAR(255) UNIQUE
            );
        """)
    except:
        print("Table not created")
        y = input("Try drop table first? [y]:")
        if y.lower() == 'y':
            do_query(c, f"DROP TABLE {tabname};")
            do_query(c, f"""
                CREATE TABLE {tabname} (
                    dni VARCHAR(9) PRIMARY KEY,
                    nom VARCHAR(30),
                    cognom VARCHAR(30),
                    tlf VARCHAR(15),
                    email VARCHAR(255) UNIQUE
                );
            """)
    conn.commit()

elif opt.add:
    print("Afegint esportistes, deixa el dni en blanc per a sortir")
    while True:
        dni = input("dni: ")
        if not dni:
            break
        nom = input("nom: ")
        cognom = input("cognom: ")
        tlf = input("tlf: ")
        email = input("email: ")
        q = f"INSERT INTO `{tabname}` VALUES (%s, %s, %s, %s, %s);"
        do_query(c, q, (dni, nom, cognom, tlf, email))
    conn.commit()

elif opt.delete:
    print("Esborrant esportista")
    dni = input("dni: ")
    q = f"DELETE FROM `{tabname}` WHERE dni = %s;"
    do_query(c, q, (dni,))
    conn.commit()
    if c.rowcount:
        print(f"S'ha esborrat l'esportista amb dni {dni}.")
    else:
        print(f"No s'ha trobat cap esportista amb dni {dni}.")

elif opt.list:
    print("Cerca esportistes, deixa el dni en blanc per a mostrar tota la taula")
    dni = input("dni: ")
    if not dni:
        do_query(c, f"SELECT * FROM `{tabname}`")
        for row in c:
            print("dni: %s, nom: %s, cognom: %s, tlf: %s, email: %s" % (row[0], row[1], row[2], row[3], row[4]))
    else:
        q = f"SELECT * FROM `{tabname}` WHERE dni = %s;"
        do_query(c, q, (dni,))
        row = c.fetchone()
        if row:
            print("dni: %s, nom: %s, cognom: %s, tlf: %s, email: %s" % (row[0], row[1], row[2], row[3], row[4]))
        else:
            print(f"No s'ha trobat cap esportista amb dni {dni}.")
else:
    optp.print_help()

c.close()
