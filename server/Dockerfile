FROM node:18

WORKDIR /app
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY server ./

ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "index.js"]