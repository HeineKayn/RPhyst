import gspread
from oauth2client.service_account import ServiceAccountCredentials
from pprint import pprint
from operator import *

class Sheet():

    def __init__(self):
        scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/drive.file','https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name('googleCreds.json', scope)
        client = gspread.authorize(creds)

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

    def getShop(self,attr,query):
        query = f'[item for item in self.sheet if {query}]'
        loots = eval(query)
        for i,loot in enumerate(loots):
            loots[i] = { key: loot[key] for key in attr }
        return  {"titles" : attr,"objects" : loots}

    def getQueryLoot(self,info):
        query = f"""
                    'Loot' in item.keys() and 
                    (not item['Level'] or int(item['Level'])<{info["Level"]}) and
                    item['Région'] in ['{info["RégionL"]}', 'Toutes'] and
                    item['Zone'] in ['{info["ZoneL"]}', 'Partout'] and
                    item['Marchand'] in ['', '{info["Marchand"]}']
                """
        return query

    def getQueriesMarchand(self,shopkeeper):
        infos = self.sheetMarchand.get_all_records()
        info = [info for info in infos if info["Marchand"] == shopkeeper][0]

        queryLoot = self.getQueryLoot(info)
        
        return [queryLoot]

    def refresh(self):
        self.__init__()