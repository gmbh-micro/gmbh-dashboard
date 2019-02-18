from intrigue.rpc import Bridge

import json

from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route("/dashboard")
def t():
    return render_template('dashboard.html')
    
@app.route("/api/get_remotes", methods=["POST"])
def get_remotes():
    B = Bridge()
    return B.requestRemotes()

@app.route("/api/get_services", methods=["POST"])
def get_services():
    B = Bridge()
    return B.requestServices()