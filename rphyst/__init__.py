from quart import Blueprint, redirect

# ---------------

rphystBP = Blueprint('rphyst', __name__, template_folder='templates', static_folder='static')

# ---------------

from .routes.loot import lootBP
rphystBP.register_blueprint(lootBP,url_prefix='/loot')

# ---------------

@rphystBP.route("/")
async def hello():
    return redirect("/rphyst/loot") # à changer