# haus-backend

This is the backend API for the haus-frontend repo. It's built using Node, Express, and Typescript with typeorm as the orm to 
the mysql database.
It currently provides support for creating an account, logging in, and posting/retrieving user-generated feedback.

The following routes are currently available:

## routes

### Authentication
POST /auth/login  --> Returns a Session object with a signed jwt token; the token must be included in calls to the server
POST /auth/register --> Returns a Session object with a signed jwt token; the token must be included in calls to the server

### Feedback
GET /feedback --> Retrieves all feedback associated with the current signed in user
POST /feedback --> Creates a new feedback entry for the current signed in user
