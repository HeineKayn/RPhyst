from quart import Blueprint, render_template, redirect
from quart_auth import *

import json

loginPhystBP = Blueprint('login', __name__)

passwordPath = './rphyst/static/password.txt'

@loginPhystBP.route("/")
async def login(password=""):
    if not current_user.auth_id :
        return await render_template('loginRPhyst.html')
    else : 
        logout_user()
        return redirect("/rphyst")

@loginPhystBP.route("/insert/<password>")
async def login_mdp(password=""):
    
    if password != "" :
        try : 
            with open(passwordPath) as json_file:
                mdp_dic = json.load(json_file)
        except : 
            mdp_dic = []

        for key, mdp_list in mdp_dic.items():
            if password in mdp_list :
                login_user(user=AuthUser(int(key)),remember=True)

    if not current_user.auth_id :
        return redirect("/rphyst/login")
    else : 
        return redirect("/rphyst")

@loginPhystBP.route("/logout")
async def logout():
    logout_user()
    return redirect("/rphyst")
