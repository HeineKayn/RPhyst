import gspread
from oauth2client.service_account import ServiceAccountCredentials
from pprint import pprint
from operator import *

scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/drive.file','https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name('googleCreds.json', scope)
client = gspread.authorize(creds)

class Sheet():

    def __init__(self):
        self.lootPage = client.open('Loot et artisanat')
        self.sheetLoot = self.lootPage.get_worksheet(0)
        self.sheetEquip = self.lootPage.get_worksheet(1)
        self.sheetConso = self.lootPage.get_worksheet(2)
        self.sheetMarchand = self.lootPage.get_worksheet(3)

        self.bddPage = client.open('Fiches et BDD')
        self.sheetStats = self.bddPage.get_worksheet(2)

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
        # for i,loot in enumerate(loots):
        #     loots[i] = { key: loot[key] for key in attr }
        return loots
        
    def getStats(self,name):
        infos = self.sheetStats.get_all_records()
        info = [info for info in infos if info["Personage"] == name][0]
        print(vars(sheet))

# -------

sheet = Sheet()
sheet.getStats("Brouss")
