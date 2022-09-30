FROM ubuntu:22.04
RUN apt-get update && apt-get install -y libatomic1

USER root
WORKDIR /app
COPY . /app
RUN ["chmod", "+x", "./run.sh"]
CMD ./run.sh