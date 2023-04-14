import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError.js";

class ForbiddenError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

export default ForbiddenError;
