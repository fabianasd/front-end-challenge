# syntax=docker/dockerfile:1

############################
# 1) Build the Vue app
############################
FROM node:22-alpine AS build
WORKDIR /app

# Install deps (use lockfile if present)
COPY package*.json ./
RUN npm ci --include=dev || npm install

# Copy sources and build
COPY . .
RUN npm run build

############################
# 2) Serve static files with Nginx
############################
FROM nginx:1.27-alpine

# Remove default site and add our SPA config
RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d/app.conf

# Copy the compiled app
COPY --from=build /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]