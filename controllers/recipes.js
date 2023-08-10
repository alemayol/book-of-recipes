import Recipe from "../models/Recipe.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError, BadRequestError } from "../errors/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getAllRecipes = async (req, res) => {
  const allRecipe = await Recipe.find({ createdBy: req.user.userID }).sort(
    `-createdAt`
  );

  return res.status(200).json(allRecipe);
};

const getRecipe = async (req, res) => {
  const { id: recipeID } = req.params,
    { userID } = req.user;

  if (!recipeID) throw new BadRequestError(`Recipe ID not provided`);

  const singleRecipe = await Recipe.findOne({
    _id: recipeID,
    createdBy: userID,
  });

  if (!singleRecipe)
    throw new NotFoundError(`Recipe with id ${recipeID} not found`);

  return res.status(StatusCodes.OK).json(singleRecipe);
};

const createRecipe = async (req, res) => {
  const { name, ingredients, preparationSteps, category } = req.body;

  /* Adding recipe image and user id to the req.body to use it to create the recipe */

  if (req.file) {
    req.body.image = fs.readFileSync(path.join("./Images/", req.file.filename));
  }

  req.body.createdBy = req.user.userID;

  if (
    name === undefined ||
    ingredients === undefined ||
    preparationSteps === undefined ||
    category === undefined
  ) {
    throw new BadRequestError(`Please fill all fields`);
  }

  if (!category)
    throw new BadRequestError(`${category} is not a valid category`);

  const recipe = await Recipe.create({ ...req.body });

  fs.rmSync(path.join("./Images/", req.file.filename), {
    maxRetries: 2,
  });

  return res.status(StatusCodes.CREATED).json(recipe);
};

const updateRecipe = async (req, res) => {
  const {
    params: { id: recipeID },
    body: { name, ingredients, preparationSteps },
    user: { userID },
  } = req;

  let image;

  if (req.file) {
    image = fs.readFileSync(path.join("./Images/", req.file.filename));
  } else {
    image = fs.readFileSync(
      path.join(__dirname, "../defaultImages/no-image.png")
    );
  }

  if (
    name === undefined ||
    ingredients === undefined ||
    preparationSteps === undefined
  ) {
    throw new BadRequestError(`Please fill all fields`);
  }

  const recipe = await Recipe.findOneAndUpdate(
    { _id: recipeID, createdBy: userID },
    { name, ingredients, preparationSteps, image },
    { runValidators: true, new: true }
  );

  if (!recipe) throw new NotFoundError(`No such recipe was found`);

  if (req.file) {
    fs.rmSync(path.join("./Images/", req.file.filename), {
      maxRetries: 2,
    });
  }

  return res.status(StatusCodes.OK).json(recipe);
};

const deleteRecipe = async (req, res) => {
  const { id: recipeID } = req.params,
    {
      user: { userID },
    } = req;

  const recipe = await Recipe.findOneAndRemove({
    _id: recipeID,
    createdBy: userID,
  });

  if (!recipe) throw new BadRequestError(`Cannot find such recipe`);

  return res
    .status(StatusCodes.OK)
    .json({ msg: `Recipe ${recipe.name} deleted!` });
};

export { getAllRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe };
