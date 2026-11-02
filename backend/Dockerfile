FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
RUN apk add --no-cache maven
COPY . .
RUN mvn clean package -DskipTests
EXPOSE 8080
CMD ["sh", "-c", "java -jar target/*.jar"]