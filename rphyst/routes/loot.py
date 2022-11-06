from quart import Blueprint, render_template, redirect, url_for

lootBP = Blueprint('loot', __name__)

@lootBP.route("/")
async def acceuil():
    return await render_template('loot.html')
