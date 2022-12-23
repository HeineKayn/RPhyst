from quart import Blueprint, request, render_template
from .partie import *

combatBP = Blueprint('combat', __name__)

partie = Partie()
partie.addJoueur("Brouss")

@combatBP.route("/")
async def combat():
    return await render_template('combat.html')

@combatBP.route('/update', methods=['POST'])
async def combat_update():
    dic_partie = vars(partie)
    try :
        dic_partie["joueurs"] = [vars(x) for x in dic_partie["joueurs"]]
    except:
        pass
    return {"content" : dic_partie}