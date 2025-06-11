FROM node:18

WORKDIR /app

ARG VITE_API_KEY
ARG VITE_DOCKER

ENV VITE_API_KEY=$VITE_API_KEY
ENV VITE_DOCKER=$VITE_DOCKER

COPY client/package*.json ./
RUN npm install
COPY client .

EXPOSE 5173
CMD ["npm", "run", "dev"]