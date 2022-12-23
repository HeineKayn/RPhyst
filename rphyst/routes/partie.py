from random import randint
from .gspread import Sheet
sheet = Sheet()

class Joueur():
    
    def __init__(self,nom):
        self.nom = nom
        self.pending = []
        self.init = randint(0,100)
        self.stats = sheet.getStats(self.nom)
        self.hp   = self.stats["HP"]
        self.mana = self.stats["MANA"]
        self.ress = self.stats["RESS"]

class Partie():

    def __init__(self):
        self.tour = 0
        self.joueurs = []
        self.historique = []

    def addJoueur(self,nom):
        self.joueurs.append(Joueur(nom))

# p = Partie()
# p.addJoueur("Brouss")
# dic_partie = vars(p)
# dic_partie["joueurs"] = [vars(x) for x in dic_partie["joueurs"]]
# print(vars(p))


