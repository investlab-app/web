# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

# Copy only the files needed for installing dependencies and building
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Build the app
RUN pnpm run build

# ---- Nginx Stage ----
FROM nginx:alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config template and startup script
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY start-nginx.sh /start-nginx.sh

# Make the startup script executable
RUN chmod +x /start-nginx.sh

EXPOSE 80

CMD ["/start-nginx.sh"]
