FROM alpine:latest

RUN apk add bash

RUN apk add openjdk11-jre

RUN apk add maven

COPY .mvn/ /application/backend/.mvn
COPY ./pom.xml ./mvnw /application/backend/

WORKDIR /application/backend

RUN ./mvnw dependency:go-offline -B

COPY ./src /application/backend/src

RUN ./mvnw -Dmaven.test.skip clean package spring-boot:repackage

ENTRYPOINT ["java", "-jar", "/application/backend/target/application-release.jar"]
