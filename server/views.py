from .app import app
from flask import render_template

@app.route('/')
def homepage():
    return render_template('index.html')

@app.route('/<id>')
def room(id):
    return app.send_static_file('index.html')