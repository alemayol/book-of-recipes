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

router.route(`/create`).post(createRecipe);

router.route(`/:id`).get(getRecipe).patch(updateRecipe).delete(deleteRecipe);

export default router;
