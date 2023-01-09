from quart import Quart, redirect, request
import os

# ---------------

from dotenv import load_dotenv

load_dotenv()
app_pass = os.getenv('APP_Pass')

# ---------------

app = Quart(__name__, static_folder=None)

from quart_auth import *

auth_manager = AuthManager(app)
app.secret_key = app_pass 
app.config.from_mapping(QUART_AUTH_COOKIE_HTTP_ONLY = False)
app.config.from_mapping(QUART_AUTH_COOKIE_SECURE    = False)
app.config.from_mapping(QUART_AUTH_COOKIE_SECURE    = False)

config = {
    "DEBUG": True,                # some Flask specific configs
    "CACHE_TYPE": "SimpleCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300
}

app.config.from_mapping(config)

# ---------------

from rphyst import rphystBP
app.register_blueprint(rphystBP,url_prefix='/rphyst')

# Default route
@app.route("/")
def default():
    return redirect("/rphyst")

# ---------------

if __name__ == "__main__":
	app.run(host="localhost", port=5001, debug=True)