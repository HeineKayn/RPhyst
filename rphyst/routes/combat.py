from quart import Blueprint, request, render_template
from quart_auth import *
from .partie import *
import json

combatBP = Blueprint('combat', __name__)

partie = Partie()
# partie.addJoueur("Brouss")

@combatBP.route("/")
async def combat():
    availableProfiles = partie.getAllProfiles()
    return await render_template('combat.html',players=availableProfiles)

@combatBP.route('/updateFront', methods=['POST'])
async def combat_update_front():
    dic_partie = json.loads(json.dumps(partie, default=lambda o: getattr(o, '__dict__', str(o))))
    return {"partie" : dic_partie, "permission" : current_user.auth_id}

@combatBP.route('/updateBack', methods=['POST'])
async def combat_update_back():
    req = dict(await request.form)
    action,value1,value2 = req["action"],req["value1"],req["value2"]
    if current_user.auth_id == 1 :
        if action == "remove_perso" : partie.removeJoueur(value1)
        # if action == "add_perso"    : partie.addJoueur(value1)
        if action == "valueTour" and value1.isdigit() : partie.tour = int(value1)
        if action == "valueIni"  and value1.isdigit() : partie.getJoueur(value2).init = int(value1) 
        if action == "valueHP" :
            joueur = partie.getJoueur(value2)
            if value1.isdigit()  : joueur.hp = int(value1)
            elif value1 == "reset" : joueur.hp = joueur.stats["HP"]

    if action == "add_perso"    : 
        partie.addJoueur(value1)
    return {}