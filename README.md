# gmbh-dashboard

A browser based app to visualize and manage gmbh-micro clusters.

### To Run

Install dependencies with  `pip install -r requirements`
And then from this directroy run `./scripts/startServer.sh`

The dashboard, by default, will be started at: http://0.0.0.0:5001

#### Using wsgi
From the app directory run `uwsgi --http :5001 --wsgi-file main.py --callable app`

### Bulding the Docker image
Use the shell scripts to build, start and stop the image and container.

Notes about the Docker version
* On mac use `host.docker.internal` as the hostname for core and control if they are running on the localhost
* On linux you will need to run `ip a` to figure out what the host name will be

***This tool is intended to be used internally.***
