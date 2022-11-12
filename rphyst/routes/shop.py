from quart import Blueprint, request, render_template, redirect
from .gspread import Sheet

shopBP = Blueprint('shop', __name__)
sheet = Sheet()

# lootQuery =  "'Loot' in item.keys() and (not item['Level'] or int(item['Level'])<4) and item['Région'] in ['Shurima', 'Toutes'] and item['Zone'] in ['Grand Sai', 'Partout'] and item['Marchand'] in ['', 'Cebo']"
# consoQuery = "'Craft' in item.keys() and (not item['Level'] or int(item['Level'])<4) and item['Type'] in ['Alchimie','Couture']"
# equipQuery = "'Equipement' in item.keys() and (not item['Niveau'] or int(item['Niveau'])<4) and item['Région'] in ['Shurima', 'Toutes'] and item['Zone'] in ['Grand Sai', 'Partout'] and item['Vente']!='Non'"

@shopBP.route("/")
async def shopChoice():
    shopkeepers = sheet.getMarchands()
    return await render_template('shopChoice.html',sks=shopkeepers)

@shopBP.route("/update")
async def updateShop():
    sheet.refresh()
    return redirect("/rphyst/shop")

@shopBP.route("/marchand/<shopkeeper>")
async def shop(shopkeeper=""):

    if not shopkeeper:
        return redirect("/")

    lootTitles  = ["Loot","Valeur achat","Valeur reprise"]
    consoTitles = ["Craft","Description","Valeur achat","Valeur reprise"]
    equipTitles = ["Classe","Emplacement","Niveau","Equipement","Stat 1","Val 1","Stat 2","Val 2","Stat 3","Val 3","Stat 4","Val 4","Valeur achat","Valeur reprise"]

    lootQuery,consoQuery,equipQuery = sheet.getQueriesMarchand(shopkeeper)

    categories = []
    categories += [sheet.getShop(lootTitles,lootQuery)]
    categories += [sheet.getShop(consoTitles,consoQuery)]
    categories += [sheet.getShop(equipTitles,equipQuery)]

    for categorie in categories:
        for i,_ in enumerate(categorie["titles"]):
            categorie["titles"][i] += " ↕"
        categorie["titles"]  += ["Achat"]
    return await render_template('shop.html',categories=categories)
