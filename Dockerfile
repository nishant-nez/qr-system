# Use the latest Node.js image as base
FROM node:latest

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port Next.js app runs on
EXPOSE 3000

# Command to run the Next.js app
CMD ["npm", "run", "dev"]
