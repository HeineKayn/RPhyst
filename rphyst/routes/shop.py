from quart import Blueprint, request, render_template, redirect

shopBP = Blueprint('shop', __name__)

@shopBP.route("/")
async def shopChoice():
    shopkeepers=["cebo","tibo"]
    return await render_template('shopChoice.html',sks=shopkeepers)

@shopBP.route("/marchand/<shopkeeper>")
async def shop(shopkeeper=""):

    if not shopkeeper:
        return redirect("/")

    people = {
        "titles" : ["Nom","Prénom","Age"],
        "objects" : [
            {"Nom":"Dupont","Prénom":"Jean","Age":53},
            {"Nom":"Clavier","Prénom":"Steve","Age":41},
            {"Nom":"Souris","Prénom":"Pierrier","Age":45}
        ]
    }
    pets = {
        "titles" : ["Espece","Nom"],
        "objects" : [
            {"Espece":"Chien","Nom":"Bil"},
            {"Espece":"Chat","Nom":"Chip"},
            {"Espece":"Souris","Nom":"Dorian"}
        ]
    }
    fruit = {
        "titles" : ["Type","Poids","Achat","Revente"],
        "objects" : [
            {"Type":"Pomme","Poids":15,"Poida":15,"Poidb":5},
            {"Type":"Poire","Poids":31,"Poida":15,"Poidb":5},
            {"Type":"Peche","Poids":1,"Poida":15,"Poidb":5}
        ]
    }

    categories = [fruit,people,pets]
    for cat in categories:
        # cat["objects"] *= 10
        for i,_ in enumerate(cat["titles"]):
            cat["titles"][i] += " ↕"
        cat["titles"]  += ["Achat"]
    return await render_template('shop.html',categories=categories)
