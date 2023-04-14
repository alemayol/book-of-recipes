import Recipe from "../models/Recipe.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError, BadRequestError } from "../errors/index.js";

const getAllRecipes = async (req, res) => {
  const allRecipe = await Recipe.find({ createdBy: req.user.userID }).sort(
    `createdAt`
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
  const { name, ingredients, preparationSteps } = req.body;
  req.body.createdBy = req.user.userID;

  if (
    name === undefined ||
    ingredients === undefined ||
    preparationSteps === undefined
  ) {
    throw new BadRequestError(`Please fill all fields`);
  }

  const recipe = await Recipe.create({ ...req.body });

  return res.status(StatusCodes.CREATED).json(recipe);
};

const updateRecipe = async (req, res) => {
  const {
    params: { id: recipeID },
    body: { name, ingredients, preparationSteps },
    user: { userID },
  } = req;

  if (
    name === undefined ||
    ingredients === undefined ||
    preparationSteps === undefined
  ) {
    throw new BadRequestError(`Please fill all fields`);
  }

  const recipe = await Recipe.findOneAndUpdate(
    { _id: recipeID, createdBy: userID },
    { name, ingredients, preparationSteps },
    { runValidators: true, new: true }
  );

  if (!recipe) throw new NotFoundError(`No such recipe was found`);

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
