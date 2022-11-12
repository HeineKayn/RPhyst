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
        print(query)
        loots = eval(query)
        for i,loot in enumerate(loots):
            loots[i] = { key: loot[key] for key in attr }
        loots = [i for n, i in enumerate(loots) if i not in loots[n + 1:]] # enlever duplicata
        return  {"titles" : attr,"objects" : loots}

    # manque MOB et VENTE
    def getQueryLoot(self,info):
        query = f"""
                    'Loot' in item.keys() and 
                    (not item['Niveau'] or int(item['Niveau'])<=int({info['Level']})) and
                    item['Région'] in [{info['RégionL']}, 'Partout', 'Toutes', ''] and
                    item['Zone'] in [{info['ZoneL']}, 'Partout', 'Toutes', ''] and
                    item['Rareté'] in [{info['RaretéL']}] and
                    item['Vente'] != 'Non'
                """
        return query

    def getQueryConso(self,info):
        query = f"""
                    'Craft' in item.keys() and 
                    (not item['Niveau'] or int(item['Niveau'])<=int({info['Level']})) and
                    item['Type'] in [{info['TypeR']}] and 
                    item['Rareté'] in [{info['RaretéR']}] and
                    item['Vente'] != 'Non'
                """
        return query

    def getQueryEquip(self,info):
        query = f"""
                    'Equipement' in item.keys() and 
                    (not item['Niveau'] or int(item['Niveau'])<=int({info['Level']})) and
                    item['Région'] in [{info['RégionE']}, 'Partout', 'Toutes', ''] and
                    item['Zone'] in [{info['ZoneE']}, 'Partout', 'Toutes', ''] and
                    item['Rareté'] in [{info['RaretéE']}] and
                    item['Vente'] != 'Non'
                """
        return query

    def getQueriesMarchand(self,shopkeeper):
        infos = self.sheetMarchand.get_all_records()
        info = [info for info in infos if info["Marchand"] == shopkeeper][0]
        for key,value in info.items():
            if type(value) == str:
                new_vals = value.split(",")
                new_vals = [f"'{x.strip()}'" for x in new_vals]
                new_vals = ','.join(new_vals)
                info[key] = new_vals

        queryLoot = self.getQueryLoot(info)
        queryConso = self.getQueryConso(info)
        queryEquip = self.getQueryEquip(info)

        return [queryLoot,queryConso,queryEquip]

    def refresh(self):
        self.__init__()