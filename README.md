# Recipes API

Book of Recipes is a REST API that allows you to create an user and save your favorite recipes along with its preparation steps. It's still a **work in progress**. All endpoints return _JSON_.

## Creating an User

To create an user you must fetch the endpoint /auth/register. You'll need to pass the following data:

  1. username. String, required, unique
  2. email. String, required, unique
  3. password. String, required, minimum length 6 characters

To log in, the endpoint is /auth/login, to login use your username and password. Not your email, though i might add that later on.

## Refresh Authentication

The endpoint to refresh your athentication token is /refresh_token, this API has multi-device support

## Logout

The endpoint to log out is /logout

## CRUD Recipes

Once logged in, you'll have access to crud operations, the following are the endpoints:

- GET /recipes/dashboard.

It returns all recipes created by the user, sorted by creation date.

- POST /recipes/create

Receives the following fields:
  1. Image. Not required, will use default if not provided
  2. Name. String
  3. Category
  4. Ingredients. Array of strings\*
  5. Preparation Steps. Array of strings\*

Returns created recipe

- GET /recipes/:id
  
Returns recipe by ID

- PATCH /recipes/:id

  Receives the following fields:
  1. Image. Not required, will use the same if not changed and default if previous image is deleted.
  2. Name. String
  3. Category
  4. Ingredients. Array of strings\*
  5. Preparation Steps. Array of strings\*

Returns updated recipe

- DELETE /recipes/:id

Receives recipe ID. Returns message with name of deleted recipe

\*Minimum length = 1 ; Maximum length = 5;
