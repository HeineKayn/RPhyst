from quart import Quart, redirect, request
import os

# ---------------

from dotenv import load_dotenv

load_dotenv()
app_pass = os.getenv('APP_Pass')

# ---------------

app = Quart(__name__, static_folder=None)

from discord.ext.ipc import Client

ipc_pass = os.getenv('IPC_Pass')
global ipc_client 
ipc_client = Client(secret_key = ipc_pass)
app.config["ipc_client"] = ipc_client

# ---------------

from rphyst import rphystBP
app.register_blueprint(rphystBP,url_prefix='/rphyst')

# Default route
@app.route("/")
def default():
    return redirect("/rphyst")

# ---------------

if __name__ == "__main__":
	app.run(host="localhost", port=5000, debug=True)