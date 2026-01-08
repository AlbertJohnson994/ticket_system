# Use Eclipse Temurin JDK 17
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy the JAR file
COPY target/*.jar app.jar

# Create data directory for SQLite
RUN mkdir -p /data

# Expose port
EXPOSE 5000

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
