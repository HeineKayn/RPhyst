from quart import Blueprint, request, render_template
from .partie import *
import json

combatBP = Blueprint('combat', __name__)

partie = Partie()
partie.addJoueur("Brouss")

@combatBP.route("/")
async def combat():
    return await render_template('combat.html')

@combatBP.route('/updateFront', methods=['POST'])
async def combat_update_front():
    dic_partie = json.loads(json.dumps(partie, default=lambda o: getattr(o, '__dict__', str(o))))
    return {"content" : dic_partie}

@combatBP.route('/updateBack', methods=['POST'])
async def combat_update_back():
    req = dict(await request.form)
    action,type,value = req["action"],req["type"],req["value"]
    if "remove" in action :
        if "perso" in type :
            partie.removeJoueur(value)
    return {}