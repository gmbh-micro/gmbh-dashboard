from intrigue.rpc import Bridge

import json

from flask import Flask, request
from flask import render_template

app = Flask(__name__)

@app.route("/")
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

@app.route("/api/restart_one", methods=["POST"])
def restart_one():
    data = request.get_data(cache=False,as_text=True)
    print(data)
    if data == '':
        return "error id not attached"
    # Split the id into two parts
    a = data.split("-")
    if len(a) != 2:
        return "error parsing id"

    B = Bridge()
    return B.restart_one(a[0],a[1])

@app.route("/api/restart_all", methods=["POST"])
def restart_all():
    B = Bridge()
    return B.restart()