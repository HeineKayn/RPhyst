from quart import Blueprint, request, render_template

combatBP = Blueprint('combat', __name__)

@combatBP.route("/")
async def combat():
    return await render_template('combat.html')
