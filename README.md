# RoomieMatch
UCLA Roommate Matcher

CS 144 Final Project

Lauren Liu, Aneesh Bonthala, Alexander Chen

## Overview
RoomieMatch is a web application that helps UCLA students find compatible roommates based on lifestyle and personality traits. Users will fill out a profile questionnaire (sleep schedule, cleanliness, study habits, social preferences, etc.), and our system will find and recommend the most similar profiles. Users can swipe or drag & drop profiles into "Like" or "Dislike" categories. Matches are stored and can be revisited later. Users will be given the contact card (phone number, email, etc) for each of their matches.

## Building & Deploying

Fill out the `server/.example_env` file with the proper environment variables. Rename this file to `.env`.

Fill out the `client/.example_env` file with the proper environment variables. Rename this file to `.env`.

### Locally

At the root project directory, run `docker compose up --build`.

### Cloud

If changes are made to the `server/`, run the following commands to redeploy:
```bash
# 1. Rebuild docker image; replace v1 with latest version number
docker build \
  -t us-west1-docker.pkg.dev/cs144-25s-aneeshbonthala/roommiematch/team28-server:v1 \
  -f server/Dockerfile \
  .

# 2. Push image to artifact registry; replace v1 with latest version number
docker push us-west1-docker.pkg.dev/cs144-25s-aneeshbonthala/roommiematch/team28-server:v1

# 3. change version number in server-deployment.yaml image name

# 4. Apply deployment to GKE
kubectl apply -f server-deployment.yaml
```

If changes are made to the `client/`, run the following commands to redeploy:
```bash
# 1. Rebuild docker image; replace v1 with latest version number
docker build \
  -t us-west1-docker.pkg.dev/cs144-25s-aneeshbonthala/roommiematch/team28-client:v8 \
  -f client/Dockerfile \
  --build-arg VITE_API_KEY=$(kubectl get secret client-secrets -o jsonpath="{.data.VITE_API_KEY}" | base64 -d) \
  --build-arg VITE_DOCKER=true \
  .

# 2. Push image to artifact registry; replace v1 with latest version number
docker push us-west1-docker.pkg.dev/cs144-25s-aneeshbonthala/roommiematch/team28-client:v1

# 3. change version number in client-deployment.yaml image name

# 4. Apply deployment to GKE
kubectl apply -f client-deployment.yaml
```

Sanity-check that the deployment is running:
```bash
kubectl get services

kubectl logs deployment/team28-client

kubectl logs deployment/team28-server
```