from flask import Flask

app = Flask(__name__, template_folder="../homepage", static_folder='../room/build', static_url_path='/')
