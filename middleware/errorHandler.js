import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = async (err, req, res, next) => {
  let customError = {
    msg: err.message || "Something went horribly wrong! Please try again",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (err.name === `CastError`) {
    customError.msg = `No recipe found with the id: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  if (err.name === `ValidationError`) {
    customError.msg = Object.values(err.errors).map((item) => item);
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err && err.code === 11000) {
    customError.msg = `Duplicate value, please change the following fields: ${Object.keys(
      err.keyValue
    )}`;
    customError.duplicates = [...Object.keys(err.keyValue)];

    customError.statusCode = StatusCodes.CONFLICT;
  }

  return res.status(customError.statusCode).json({
    ok: false,
    status: customError.statusCode,
    message: customError.msg,
    duplicates: customError.duplicates || false,
  });
};

export default errorHandlerMiddleware;
