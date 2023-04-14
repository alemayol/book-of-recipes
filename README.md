# Recipes API

Book of Recipes is a REST API that allows you to create an user and save your favorite recipes along with its preparation steps. It's still a **work in progress**. All endpoints return _JSON_.

## Creating an User

To create an user you must fetch the endpoint /auth/register. You'll need to pass an username, email and password. The first two are _unique_.

To log in, the endpoint is /auth/login, to login use your username and password. Not your email, though i might add that later on.

## Refresh Authentication

The endpoint to refresh your athentication token is /refresh_token, this API has multi-device support

## CRUD Recipes

Once logged in, you'll have access to crud operations, the following are the endpoints:

- GET api/dashboard. It returns all recipes created by the user, sorted by creation date.

- POST /api/recipes/create. Receives the following fields:
  1. Name, String
  2. Ingredients, Array of strings\*
  3. Preparation Steps, Array of strings\*

Returns created recipe

- GET /api/recipes/:id. Returns recipe by ID

- PATCH /api/recipes/:id. Receives the following fields:
  1. Name, String
  2. Ingredients, Array of strings\*
  3. Preparation Steps, Array of strings\*

Returns updated recipe

- DELETE /api/recipes/:id. Receives recipe ID. Returns message with name of deleted recipe

\*Minimum length = 1 ; Maximum length = 5;
