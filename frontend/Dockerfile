# Use a Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install
RUN npm install react-router-dom axios web-vitals bootstrap framer-motion jwt-decode@latest react-router-dom

# Copy the rest of the application files
COPY . .

# Expose the port React runs on
EXPOSE 3000

# Start the React application
CMD ["npm", "start"]