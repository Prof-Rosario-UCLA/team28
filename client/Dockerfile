FROM node:18

WORKDIR /app

ARG VITE_API_KEY
ARG VITE_DOCKER
ENV VITE_API_KEY=$VITE_API_KEY
ENV VITE_DOCKER=$VITE_DOCKER

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 4173
CMD ["npx", "vite", "preview", "--host", "0.0.0.0"]
