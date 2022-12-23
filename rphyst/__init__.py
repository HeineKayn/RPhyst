from quart import Blueprint, redirect

# ---------------

rphystBP = Blueprint('rphyst', __name__, template_folder='templates', static_folder='static')

# ---------------

from .routes.loot import lootBP
rphystBP.register_blueprint(lootBP,url_prefix='/loot')

from .routes.shop import shopBP
rphystBP.register_blueprint(shopBP,url_prefix='/shop')

from .routes.combat import combatBP
rphystBP.register_blueprint(combatBP,url_prefix='/combat')

from .routes.loginPhyst import loginPhystBP
rphystBP.register_blueprint(loginPhystBP,url_prefix='/login')

# ---------------

@rphystBP.route("/")
async def hello():
    return redirect("/rphyst/shop")