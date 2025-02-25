# Frontend Dockerfile for our Trello-like application
FROM node:16-alpine

WORKDIR /app

# Copy package.json and package-lock.json files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port for the React application
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]