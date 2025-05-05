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
    print("Creating table "+tabname)
    try:
        do_query(c, "CREATE TABLE %s (dni VARCHAR(9) PRIMARY KEY, tlf VARCHAR(15), email VARCHAR(255) UNIQUE);" % tabname)
    except:
        print("Table not created")
        y = input("Try drop table first? [y]:")
        if y == 'y':
            do_query(c, "DROP TABLE %s;" % tabname)
            do_query(c, "CREATE TABLE %s (dni VARCHAR(9) PRIMARY KEY, tlf VARCHAR(15), email VARCHAR(255) UNIQUE);" % tabname)
    conn.commit()

elif opt.add:
    print("Afegint esportistes, deixa el dni en blanc per a sortir")
    while True:
        dni = input("dni: ")
        if not dni:
            break
        tlf = input("tlf: ")
        email = input("email: ")
        q = f"INSERT INTO `{tabname}` VALUES (%s, %s, %s);" % ("%s", "%s", "%s")
        do_query(c, q, (dni, tlf, email))
    conn.commit()

elif opt.delete:
    print("Esborrant esportista")
    dni = input("dni: ")
    q = f"DELETE FROM `{tabname}` WHERE dni=%s;" % ("%s")
    do_query(c, q, (dni,))
    conn.commit()
    if c.rowcount:
        print("S'ha esborrat l'esportista amb dni %s." % dni)
    else:
        print("No s'ha trobat cap esportista amb dni %s." % dni)

elif opt.list:
    print("Cerca esportistes, deixa el dni en blanc per a mostrar tota la taula")
    dni = input("dni: ")
    if not dni:
        do_query(c, f"SELECT * FROM `{tabname}`")
        for row in c:
            print("dni: %s, tlf: %s, email: %s" % (row[0], row[1], row [2]))
    else:
        q = f"SELECT * FROM `{tabname}` WHERE dni = %s;"  % ("%s")
        do_query(c, q, (dni,))
        row = c.fetchone()
        if row:
            print("dni: %s, tlf: %s, email: %s" % (row[0], row[1], row [2]))
        else:
            print("No s'ha trobat cap esportista amb dni %s." % dni)
else:
    optp.print_help()

c.close()
