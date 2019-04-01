FROM ubuntu:18.04

RUN apt-get update && \
    apt -y upgrade && \
    apt-get -y install \
    python3-pip \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3-dev \
    nano \
    bash \
    git \
    supervisor && \
    useradd -ms /bin/bash nginx

RUN git clone https://github.com/gmbh-micro/gmbh-dashboard.git

RUN mv ./gmbh-dashboard/conf/supervisord.conf /etc/supervisord.conf
RUN mv ./gmbh-dashboard/requirements.txt /tmp/requirements.txt

RUN pip3 install -r /tmp/requirements.txt

RUN mkdir /app
RUN mv ./gmbh-dashboard/app/* /app/
WORKDIR /app

EXPOSE 5001

CMD ["/usr/bin/supervisord"]