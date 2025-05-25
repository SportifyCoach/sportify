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
    subprocess.run(["python3", "scripts/test_disciplines_crud_bd.py", "-i"], check=True)
    subprocess.run(["python3", "scripts/test_entrenadors_crud_bd.py", "-i"], check=True)
    subprocess.run(["python3", "scripts/test_esportistes_crud_bd.py", "-i"], check=True)
    subprocess.run(["python3", "scripts/test_sessions_crud_bd.py", "-i"], check=True)
    subprocess.run(["python3", "scripts/test_entrenaments_crud_bd.py", "-i"], check=True)
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
    ("Zumba", "Sala de ball"),
    ("Tennis", "Pistes de tennis 2"),
    ("Pàdel", "Pista de pàdel 1"),
    ("Voleibol", "Pista poliesportiva 2"),
    ("Arts marcials", "Dojo"),
    ("Pilates", "Sala de fitness 2"),
    ("Crossfit", "Zona d'entrenament funcional"),
    ("Gimnàstica rítmica", "Pavelló 3"),
    ("Natació sincronitzada", "Piscina petita"),
    ("Hoquei herba", "Camp exterior 2"),
    ("Skateboard", "Skatepark"),
    ("Parkour", "Zona d'obstacles"),
    ("Esgrima", "Sala d'armes"),
    ("Tai-txi", "Jardí exterior"),
    ("Aqua fitness", "Piscina recreativa")
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
    ("56789012E", "Clara", "Fernández Pons", "clara.fernandez@example.com", "handbol", 7),
    ("67890123F", "Joan", "Ribas Lluch", "joan.ribas@example.com", "natació", 9),
    ("78901234G", "Mireia", "Torres Blanch", "mireia.torres@example.com", "escalada", 8),
    ("89012345H", "David", "Moreno Grau", "david.moreno@example.com", "ioga", 6),
    ("90123456I", "Helena", "Ferrer Bosch", "helena.ferrer@example.com", "zumba", 7),
    ("01234567J", "Xavier", "Alonso Mir", "xavier.alonso@example.com", "ciclisme indoor", 5),
    ("11223344K", "Núria", "Gil Sabaté", "nuria.gil@example.com", "tennis", 8),
    ("22334455L", "Gerard", "Roig Ventura", "gerard.roig@example.com", "pàdel", 9),
    ("33445566M", "Sílvia", "Navarro Pujol", "silvia.navarro@example.com", "voleibol", 6),
    ("44556677N", "Oriol", "López Casals", "oriol.lopez@example.com", "arts marcials", 7),
    ("55667788O", "Laia", "Peris Font", "laia.peris@example.com", "pilates", 8),
    ("66778899P", "Pol", "Camps Duran", "pol.camps@example.com", "crossfit", 9),
    ("77889900Q", "Irene", "Garriga Salvat", "irene.garriga@example.com", "gimnàstica rítmica", 6),
    ("88990011R", "Jordi", "Requena Batlle", "jordi.requena@example.com", "natació sincronitzada", 7),
    ("99001122S", "Eva", "Castells Roca", "eva.castells@example.com", "hoquei herba", 5),
    ("10111213T", "Carles", "Pons Esteller", "carles.pons@example.com", "skateboard", 6),
    ("12131415U", "Sergi", "Molina Prats", "sergi.molina@example.com", "parkour", 7),
    ("13141516V", "Blanca", "Reyes Puigvert", "blanca.reyes@example.com", "esgrima", 8),
    ("14151617W", "Roger", "Sánchez Vidal", "roger.sanchez@example.com", "tai-txi", 6),
    ("15161718X", "Cristina", "Ortiz Lladó", "cristina.ortiz@example.com", "aqua fitness", 7)
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
    ("12345876A", "Marc", "Garcia", "612345678", "marc.garcia@email.com"),
    ("23456987B", "Laura", "Fernandez", "622345678", "laura.fernandez@email.com"),
    ("34567098C", "Joan", "Martínez", "632345678", "joan.martinez@email.com"),
    ("45678109D", "Anna", "Sánchez", "642345678", "anna.sanchez@email.com"),
    ("56789210E", "David", "Lopez", "652345678", "david.lopez@email.com"),
    ("67890321F", "Núria", "Soler", "662345678", "nuria.soler@email.com"),
    ("78901432G", "Pere", "Vidal", "672345678", "pere.vidal@email.com"),
    ("89012543H", "Clara", "Morales", "682345678", "clara.morales@email.com"),
    ("90123654I", "Oriol", "Ruiz", "692345678", "oriol.ruiz@email.com"),
    ("01234765J", "Helena", "Domènech", "602345678", "helena.domenech@email.com"),
    ("11235876K", "Pol", "Gil", "611223344", "pol.gil@email.com"),
    ("22346987L", "Júlia", "Reverter", "622334455", "julia.reverter@email.com"),
    ("33457098M", "Roger", "Esteve", "633445566", "roger.esteve@email.com"),
    ("44568109N", "Marta", "Carreras", "644556677", "marta.carreras@email.com"),
    ("55679210O", "Adrià", "Fabregat", "655667788", "adria.fabregat@email.com"),
    ("66780321P", "Aina", "Serra", "666778899", "aina.serra@email.com"),
    ("77891432Q", "Albert", "Pujol", "677889900", "albert.pujol@email.com"),
    ("88902543R", "Cristina", "Verdú", "688990011", "cristina.verdu@email.com"),
    ("99013654S", "Jordi", "Navarro", "699001122", "jordi.navarro@email.com"),
    ("10124765T", "Eva", "Bonet", "600112233", "eva.bonet@email.com"),
    ("12135876U", "Arnau", "Solà", "611223355", "arnau.sola@email.com"),
    ("23246987V", "Neus", "Roca", "622334466", "neus.roca@email.com"),
    ("34357098W", "Guillem", "Ribas", "633445577", "guillem.ribas@email.com"),
    ("45468109X", "Irene", "Llorens", "644556688", "irene.llorens@email.com"),
    ("56579210Y", "Gerard", "Mas", "655667799", "gerard.mas@email.com"),
    ("67680321Z", "Sílvia", "Balcells", "666778800", "silvia.balcells@email.com"),
    ("78791432A", "Quim", "Montoro", "677889811", "quim.montoro@email.com"),
    ("89802543B", "Carla", "Alarcón", "688990822", "carla.alarcon@email.com"),
    ("90913654C", "Lluna", "Santamaria", "699001833", "lluna.santamaria@email.com"),
    ("01024765D", "Xavier", "Ortega", "600112844", "xavier.ortega@email.com"),
    ("12135876E", "Lídia", "Marín", "611223855", "lidia.marin@email.com"),
    ("13246987F", "Toni", "Guasch", "622334866", "toni.guasch@email.com"),
    ("14357098G", "Jana", "Borràs", "633445877", "jana.borras@email.com"),
    ("15468109H", "Miquel", "Casanovas", "644556888", "miquel.casanovas@email.com"),
    ("16579210I", "Cèlia", "Estrada", "655667899", "celia.estrada@email.com"),
    ("17680321J", "Estel", "Moreno", "666778811", "estel.moreno@email.com"),
    ("18791432K", "Nil", "Domingo", "677889822", "nil.domingo@email.com"),
    ("19802543L", "Paula", "Rius", "688990833", "paula.rius@email.com"),
    ("20913654M", "Albert", "Vilaseca", "699001844", "albert.vilaseca@email.com"),
    ("21024765N", "Marina", "Prats", "600112855", "marina.prats@email.com"),
    ("22135876O", "Judit", "Caselles", "611223866", "judit.caselles@email.com"),
    ("23246987P", "Ricard", "Tort", "622334877", "ricard.tort@email.com"),
    ("24357098Q", "Ismael", "Campeny", "633445888", "ismael.campeny@email.com"),
    ("25468109R", "Olga", "Lladó", "644556899", "olga.llado@email.com"),
    ("26579210S", "Pau", "Martorell", "655667800", "pau.martorell@email.com"),
    ("27680321T", "Noa", "Granés", "666778822", "noa.granes@email.com"),
    ("28791432U", "Raül", "Ferré", "677889833", "raul.ferre@email.com"),
    ("29802543V", "Gemma", "Rovira", "688990844", "gemma.rovira@email.com"),
    ("30913654W", "Sergi", "Corbera", "699001855", "sergi.corbera@email.com"),
    ("31024765X", "Lucia", "Vendrell", "600112866", "lucia.vendrell@email.com"),
    ("32135876Y", "Isaac", "Manresa", "611223877", "isaac.manresa@email.com"),
    ("33246987Z", "Tània", "Ribas", "622334888", "tania.ribas@email.com"),
    ("34357098A", "Aleix", "Perelló", "633445899", "aleix.perello@email.com"),
    ("35468109B", "Sandra", "Valverde", "644556800", "sandra.valverde@email.com"),
    ("36579210C", "Jofre", "Andreu", "655667811", "jofre.andreu@email.com"),
    ("37680321D", "Carme", "Gallego", "666778833", "carme.gallego@email.com"),
    ("38791432E", "Arnau", "Baró", "677889844", "arnau.baro@email.com"),
    ("39802543F", "Vanesa", "Serra", "688990855", "vanesa.serra@email.com"),
    ("40913654G", "Eloi", "Canet", "699001866", "eloi.canet@email.com"),
    ("41024765H", "Judith", "Gallart", "600112877", "judith.gallart@email.com"),
    ("42135876I", "Roger", "Durán", "611223888", "roger.duran@email.com"),
    ("43246987J", "Clàudia", "Tarrés", "622334899", "claudia.tarres@email.com"),
    ("44357098K", "Martí", "Boix", "633445800", "marti.boix@email.com"),
    ("45468109L", "Elisabet", "Jorba", "644556811", "elisabet.jorba@email.com"),
    ("46579210M", "Albert", "Alay", "655667822", "albert.alay@email.com"),
    ("47680321N", "Cesc", "Cortina", "666778844", "cesc.cortina@email.com"),
    ("48791432O", "Andrea", "Vall", "677889855", "andrea.vall@email.com"),
    ("49802543P", "Víctor", "Ros", "688990866", "victor.ros@email.com"),
    ("50913654Q", "Emma", "Salvat", "699001877", "emma.salvat@email.com"),
    ("51024765R", "Gisela", "Bau", "600112888", "gisela.bau@email.com"),
    ("52135876S", "Oriol", "Avellaneda", "611223899", "oriol.avellaneda@email.com"),
    ("53246987T", "Natàlia", "Montero", "622334800", "natalia.montero@email.com"),
    ("54357098U", "Júlia", "Fàbregas", "633445811", "julia.fabregas@email.com"),
    ("55468109V", "Alejandro", "Gual", "644556822", "alejandro.gual@email.com"),
    ("56579210W", "Lluc", "Queralt", "655667833", "lluc.queralt@email.com"),
    ("57680321X", "Clàudia", "Bosch", "666778855", "claudia.bosch@email.com"),
    ("58791432Y", "Bernat", "Garriga", "677889866", "bernat.garriga@email.com"),
    ("59802543Z", "Sònia", "Peris", "688990877", "sonia.peris@email.com"),
    ("60913654A", "Isa", "Font", "699001888", "isa.font@email.com")
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
for i in range(20):
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
for i in range(200):
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
conn.close()