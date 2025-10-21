# syntax=docker/dockerfile:1.6

############################
# 1) Install dependencies with cache
############################
FROM node:22-alpine AS deps
WORKDIR /app

COPY package*.json ./
# Use BuildKit cache to speed up npm installs
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --progress=false

############################
# 2) Build the Vue app (reuses node_modules)
############################
FROM deps AS build
WORKDIR /app

# Copy only what’s needed for build to maximize cache hits
COPY tsconfig*.json ./
COPY vite.config.ts vitest.config.ts eslint.config.ts ./
COPY index.html ./
COPY public ./public
COPY src ./src
COPY .env ./.env

RUN npm run build

############################
# 3) Serve static files with Nginx
############################
FROM nginx:1.27-alpine AS runtime
ENV NODE_ENV=production

# Remove default site and add our SPA config
RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d/app.conf

# Copy the compiled app
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

############################
# 4) Development (Vite dev server with HMR)
############################
FROM node:22-alpine AS dev
WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --progress=false

# Copy only what’s needed; in compose we bind-mount the source
COPY tsconfig*.json ./
COPY vite.config.ts vitest.config.ts eslint.config.ts ./
COPY index.html ./
COPY public ./public
COPY src ./src
COPY .env ./.env

ENV HOST=0.0.0.0
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
