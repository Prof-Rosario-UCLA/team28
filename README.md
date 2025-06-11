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

In the `server/` directory, run `npm install`. In another terminal, run `redis-server` to start the redis server. Run `npm run dev` to start the server.

In the `client/` directory, run `npm install` and `npm run dev` to host the user interface on `http://localhost:5173`.

## Docker

At the root project directory, run `docker compose up --build`.