from intrigue.rpc import Bridge

import json

import sys
import optparse
import time

from flask import Flask, request
from flask import render_template

app = Flask(__name__)

@app.route("/")
def t():
    return render_template('dashboard.html')
    
@app.route("/api/get_remotes", methods=["POST"])
def get_remotes():
    B = Bridge()
    data = request.get_data(cache=False,as_text=True)
    return B.requestRemotes(data)

@app.route("/api/get_services", methods=["POST"])
def get_services():
    B = Bridge()
    data = request.get_data(cache=False,as_text=True)
    return B.requestServices(data)

@app.route("/api/restart_one", methods=["POST"])
def restart_one():
    data = request.get_data(cache=False,as_text=True)
    if data == '':
        return "error id not attached"

    # get the address
    addrSplit = data.split('%')

    if len(addrSplit) != 2:
        return "error parsing control server address"

    # Split the id into two parts
    a = addrSplit[0].split("-")
    if len(a) != 2:
        return "error parsing id"

    B = Bridge()
    return B.restart_one(a[0],a[1], addrSplit[1])

@app.route("/api/restart_all", methods=["POST"])
def restart_all():
    data = request.get_data(cache=False,as_text=True)
    if data == '':
        return "error control server not set"
    B = Bridge()
    return B.restart(addr=data)

@app.route("/api/shutdown", methods=["POST"])
def shutdown():
    data = request.get_data(cache=False,as_text=True)
    if data == '':
        return "error control server not set"
    B = Bridge()
    return B.shutdown(addr=data)


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=5001)
# if __name__ == '__main__':
#     parser = optparse.OptionParser(usage="python3 app.py -p ")
#     parser.add_option('-p', '--port', action='store', dest='port', help='The port to listen on.')
#     (args, _) = parser.parse_args()
#     if args.port == None:
#         print("Missing required argument: -p/--port")
#         sys.exit(1)
#     app.run(host='0.0.0.0', port=int(args.port), debug=False)