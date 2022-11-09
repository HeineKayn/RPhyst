from quart import Blueprint, request, render_template

shopBP = Blueprint('shop', __name__)

@shopBP.route("/")
async def shop():
    return await render_template('shop.html')
