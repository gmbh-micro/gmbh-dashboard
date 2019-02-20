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
    supervisor && \
    useradd -ms /bin/bash nginx

COPY ./conf/supervisord.conf /etc/supervisord.conf

COPY requirements.txt /tmp/requirements.txt
RUN pip3 install -r /tmp/requirements.txt

COPY ./app /app
WORKDIR /app

EXPOSE 5001

CMD ["/usr/bin/supervisord"]