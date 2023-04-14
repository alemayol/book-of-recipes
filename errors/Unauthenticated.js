import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError.js";

class UnauthenticatedError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnauthenticatedError;
