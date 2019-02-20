# Copyright 2018 The gRPC Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
FROM python:3.7-alpine as base

FROM base as builder
RUN apk add --update --no-cache \
    gcc \
    linux-headers \
    make \
    musl-dev \
    python-dev \
    g++
ENV GRPC_PYTHON_VERSION 1.15.0
RUN python -m pip install --upgrade pip
RUN pip install --install-option="--prefix=/install" grpcio==${GRPC_PYTHON_VERSION} grpcio-tools==${GRPC_PYTHON_VERSION} grpcio-reflection==${GRPC_PYTHON_VERSION} grpcio-health-checking==${GRPC_PYTHON_VERSION} grpcio-testing==${GRPC_PYTHON_VERSION}

FROM base
ENV GRPC_PYTHON_VERSION 1.15.0
COPY --from=builder /install /usr/local


# below modified from here https://github.com/hellt/nginx-uwsgi-flask-alpine-docker

COPY requirements.txt /tmp/requirements.txt

RUN apk add --no-cache \
    bash \
    libc6-compat \
    nginx \
    uwsgi \
    uwsgi-python3 \
    supervisor && \
    pip3 install --upgrade pip setuptools && \
    pip3 install -r /tmp/requirements.txt && \
    rm /etc/nginx/conf.d/default.conf && \
    rm -r /root/.cache

# Copy the Nginx global conf
COPY ./conf/nginx.conf /etc/nginx/
# Copy the Flask Nginx site conf
COPY ./conf/flask-site-nginx.conf /etc/nginx/conf.d/
# Copy the base uWSGI ini file to enable default dynamic uwsgi process number
COPY ./conf/uwsgi.ini /etc/uwsgi/
# Custom Supervisord config
COPY ./conf/supervisord.conf /etc/supervisord.conf

# Add demo app
COPY ./app /app
WORKDIR /app

CMD ["/usr/bin/supervisord"]