# Stage 1: Compile and Build

# Use official node image as the base image
FROM node:12.16.1-alpine As builder

# Set the working directory
WORKDIR /usr/src/app

# Add the source code to app
COPY package.json ./

# Install all the dependencies
RUN npm install -g @angular/cli

COPY . .

RUN node node_modules/esbuild/install.js

# Generate the build of the application
RUN npm run build


# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80
