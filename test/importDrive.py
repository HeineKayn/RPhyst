import gspread
from oauth2client.service_account import ServiceAccountCredentials
from pprint import pprint
from operator import *

scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/drive.file','https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name('googleCreds.json', scope)
client = gspread.authorize(creds)

class Sheet():

    def __init__(self):
        self.client = client.open('Loot et artisanat')
        self.sheetLoot = self.client.get_worksheet(0)
        self.sheetEquip = self.client.get_worksheet(1)
        self.sheetConso = self.client.get_worksheet(2)
        self.sheetMarchand = self.client.get_worksheet(3)

        self.sheet = []
        for sheet_chunk in [self.sheetLoot, self.sheetEquip, self.sheetConso] :
            self.sheet += sheet_chunk.get_all_records()  
        self.sheet = [item for item in self.sheet if item['Valeur achat'] and item['Valeur achat'] != '#N/A' ] # Tej les vides

    def getMarchands(self):
        return self.sheetMarchand.col_values(1)[1:]

    def test(self):
        pprint(self.sheetMarchand.get_all_records())
        print("\n================================")
        pprint(self.sheetMarchand.get_all_values())

    def getShop(self,query,attr):
        # loots = [item for item in self.sheet if 'Loot' in item.keys()]
        query = f'[item for item in self.sheet if {query}]'
        loots = eval(query)
        for i,loot in enumerate(loots):
            loots[i] = { key: loot[key] for key in attr }
        return loots

# -------

# Le frontend créera un string (requete) qu'il enverra au back
# Profil de Cebo par exemple
lootQuery =  "'Loot' in item.keys() and (not item['Niveau'] or int(item['Niveau'])<4) and item['Région'] in ['Shurima', 'Toutes',''] and item['Zone'] in ['Grand Sai', 'Partout',''] and item['Marchand'] in ['', 'Cebo']"
consoQuery = "'Craft' in item.keys() and (not item['Level'] or int(item['Level'])<4) and item['Type'] in ['Alchimie','Couture']"
equipQuery = "'Equipement' in item.keys() and (not item['Niveau'] or int(item['Niveau'])<=4)"# and item['Région'] in ['Shurima', 'Toutes',''] and item['Zone'] in ['Grand Sai', 'Partout',''] and item['Vente']!='Non'"

sheet = Sheet()

res = sheet.getShop(lootQuery,["Loot"])
# res = [x for x in res if x["Loot"] == "Pierre"]
pprint(res)
# sheet.getShop(consoQuery)
# sheet.getShop(equipQuery)

# sheet.test()

# pprint(sheet.getMarchands())


# Classement des items fait par frontend (script charon)
# Sert à rien de formater, sera fait en front par le django
# Page exprès pour édit les profils de marchand