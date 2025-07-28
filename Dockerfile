# Stage 1: Build the React application
FROM node:20-alpine AS build
# Install build tools for any native dependencies
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Assuming your bundler outputs to `dist/` (e.g. Vite)
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:1.25-alpine
# Copy the correct build output directory
COPY --from=build /app/dist /usr/share/nginx/html
# Load your custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
