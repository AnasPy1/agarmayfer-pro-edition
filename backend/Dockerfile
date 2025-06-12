# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port (make sure it matches your .env PORT)
EXPOSE 5000

# Start the server
CMD ["node", "src/app.js"]
