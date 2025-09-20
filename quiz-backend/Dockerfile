# Step 1: Use an official OpenJDK image as base
FROM openjdk:21-jdk-slim

# Step 2: Add a volume to store logs (optional)
VOLUME /tmp

# Step 3: Expose port (same as in application.properties -> server.port)
EXPOSE 8081

# Step 4: Copy JAR file into container
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

# Step 5: Run the jar file
ENTRYPOINT ["java","-jar","/app.jar"]

