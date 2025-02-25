# Backend Dockerfile for our Trello-like application
FROM node:16-alpine

WORKDIR /app

# Copy package.json and package-lock.json files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript code
RUN npm run build

# Debug - verify the build output exists
RUN ls -la dist/ || echo "dist directory is empty or doesn't exist"

# Expose port for the backend API
EXPOSE 4000

# Command to run the application
CMD ["npm", "start"]