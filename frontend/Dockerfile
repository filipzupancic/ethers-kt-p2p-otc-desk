# Use an official Node.js image to build and run the application
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 5173 for the Vite development server
EXPOSE 5173

# Start the Vite development server and ensure it binds to all network interfaces
CMD ["npm", "run", "dev", "--", "--host"]
