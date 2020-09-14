FROM python:3

ENV PYTHONUNBUFFERED="1"
ENV DOCKERIZE_VERSION="v0.2.0"

ENV TZ=Europe/Amsterdam
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /code
COPY . .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt && \
    pip install uwsgi

RUN ["chmod", "+x", "/code/entrypoint.sh"]
ENTRYPOINT ["/code/entrypoint.sh"]
CMD ["runserver"]
