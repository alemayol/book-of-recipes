import mongoose from "mongoose";
import path from "node:path";
import fs from "fs";
/*import { BadRequestError } from "../errors/index.js";*/

const defaultImage = fs.readFileSync(
  path.join(process.cwd(), "/images/no-image.png"),
);

function shortArray(arr) {
  return arr && arr.length >= 1;
}

function longArray(arr) {
  return arr && arr.length <= 5;
}

const ingredientsValidators = [
  { validator: shortArray, msg: `Please provide at least 1 ingredient` },
  { validator: longArray, msg: `Please provide no more than 5 ingredients` },
];

const preparationValidators = [
  { validator: shortArray, msg: `Please provide at least 1 preparation step` },
  {
    validator: longArray,
    msg: `Please provide no more than 5 preparation steps`,
  },
];

const RecipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, `Please give a name to this recipe`],
      maxlength: 20,
    },
    ingredients: {
      type: [String],
      default: undefined,
      validate: ingredientsValidators,
    },
    preparationSteps: {
      type: [String],
      default: undefined,
      validate: preparationValidators,
    },
    category: {
      type: String,
      enum: [
        "Breakfast",
        "Lunch",
        "Dinner",
        "Thai",
        "Brunch",
        "Salads",
        "Burgers",
        "Pizza",
        "Fast Food",
        "Rice",
        "Seafood",
        "Pasta",
        "Beef",
        "Pork",
        "Vegetarian",
        "Bread",
        "Sauces",
        "Baking",
        "Desserts",
        "Vegan",
      ],
      required: true,
    },
    image: {
      type: Buffer,
      data: Buffer,
      default: defaultImage,
    },
    createdBy: {
      type: mongoose.Types.ObjectId, // Tying the job to the users object id (_id in mongoDB)
      ref: `User`, // specifying which Schema we are aiming for
      required: [true, `Please provide user`],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model(`Recipe`, RecipeSchema);
