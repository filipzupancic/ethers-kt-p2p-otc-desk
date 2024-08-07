# Stage 1: Build the application
FROM openjdk:21-jdk-slim AS builder

# Set the working directory
WORKDIR /app

# Copy the Gradle wrapper and other required files
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .

# Ensure the Gradle wrapper has execute permissions
RUN chmod +x gradlew

# Copy the source code
COPY src ./src

# Download dependencies and build the application
RUN ./gradlew --no-daemon build -x test

# Stage 2: Create the runtime image
FROM openjdk:21-jdk-slim

# Add a volume pointing to /tmp
VOLUME /tmp

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Copy the built JAR file from the builder stage
COPY --from=builder /app/build/libs/ethers-kt-p2p-otc-desk-0.0.1-SNAPSHOT.jar app.jar

# Run the JAR file
ENTRYPOINT ["java", "-jar", "/app.jar"]
