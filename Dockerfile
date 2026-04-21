# Use lightweight image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependencies first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of code
COPY . .

# Set environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "index.js"]