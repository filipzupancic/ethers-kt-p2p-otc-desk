# Stage 1: Build the application
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy environment variables from docker-compose or .env file
ARG VITE_API_URL

# Build the application using environment variables (VITE_API_URL is passed from outside)
RUN echo "Building with VITE_API_URL=$VITE_API_URL" && \
  VITE_API_URL=$VITE_API_URL npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output to the nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Accept a build argument to determine which nginx.conf to use
ARG NGINX_CONF

# Copy the appropriate nginx configuration file based on the build argument
COPY ${NGINX_CONF} /etc/nginx/conf.d/default.conf

# Expose port 80 (HTTP)
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
