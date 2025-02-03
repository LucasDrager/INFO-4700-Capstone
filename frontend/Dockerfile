FROM node:18-alpine

# Set our working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of our code
COPY . .

# Expose port 3000 for the React dev server
EXPOSE 3000

# Default command is "npm start", which runs the dev server
CMD ["npm", "start"]
