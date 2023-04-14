import express from "express";
import {
  getAllRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipes.js";

const router = express.Router();

router.route(`/dashboard`).get(getAllRecipes);

router.route(`/recipes/create`).post(createRecipe);

router
  .route(`/recipes/:id`)
  .get(getRecipe)
  .patch(updateRecipe)
  .delete(deleteRecipe);

export default router;
