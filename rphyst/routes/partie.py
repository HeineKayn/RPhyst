from random import randint
from .gspread import Sheet
sheet = Sheet()

class Joueur():
    
    def __init__(self,nom,stats):
        self.nom = nom
        self.pending = []
        self.init = randint(0,100)
        self.stats = stats
        self.hp   = self.stats["HP"]
        self.mana = self.stats["MANA"]
        self.ress = self.stats["RESS"]

        # AVOIR un self.spells

    def __str__ (self):
        return self.nom

class Partie():

    def __init__(self):
        self.tour = 0
        self.joueurs = []
        self.historique = []
        self.allStats = sheet.getStats()

    def getJoueur(self,jname):
        j = [j for j in self.joueurs if j.nom == jname]
        if j : return j[0]
        else : return None

    def getAllProfiles(self):
        return [stat["Personage"] for stat in self.allStats]

    def addJoueur(self,nom):
        nbExistant =  len([j for j in self.joueurs if nom in j.nom]) + 1
        stats = [stat for stat in self.allStats if stat["Personage"] == nom][0]
        if nbExistant > 1 : nom += " " + str(nbExistant)
        self.joueurs.append(Joueur(nom,stats))

    def removeJoueur(self,nom):
        self.joueurs.remove(self.getJoueur(nom))

    def __str__ (self):
        return " ".join(str(self.joueurs))

# p = Partie()
# p.addJoueur("Brouss")
# dic_partie = vars(p)
# dic_partie["joueurs"] = [vars(x) for x in dic_partie["joueurs"]]
# print(vars(p))


