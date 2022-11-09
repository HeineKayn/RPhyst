from quart import Blueprint, request, render_template
from random import choice

lootBP = Blueprint('loot', __name__)

@lootBP.route("/")
async def acceuil():
    return await render_template('loot.html')

@lootBP.route("/roll", methods=['GET','POST'])
async def roll():
    data = await request.form
    loot_list = data["loots"]
    nb_drop = int(data["n"])

    loot_list = loot_list.split("\n")
    item_list = [item.strip() for item in loot_list if item != "Loot"]
    loots     = {}

    for _ in range(nb_drop):
        loot = choice(item_list)
        if loot in loots.keys():
            loots[loot] += 1
        else :
            loots[loot] = 1

    loots = dict(sorted(loots.items()))
    text = ""
    for key, value in loots.items():
        if value > 1 :
            text += f"- {key} x{value}\n"
        else :
             text += f"- {key}\n"

    return [text]