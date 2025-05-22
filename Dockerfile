# Use an official Node.js image as a base
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# install vite globally
RUN npm install -g -vite

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Create a production image
FROM nginx:alpine AS production

# Copy the built app from the previous stage to the NGINX web server directory
COPY --from=build /app/dist /usr/share/nginx/html

#copy the nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the NGINX server
EXPOSE 80

# Set the timezone of the container to match the host machine's timezone
RUN ln -sf /usr/share/zoneinfo/Asia/Kolkata /etc/localtime

# Start NGINX when the container starts
CMD ["nginx", "-g", "daemon off;"]
