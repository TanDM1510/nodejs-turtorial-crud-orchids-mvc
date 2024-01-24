const { constants } = require("../../constants");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  const errorResponse = {
    title: "",
    message: err.message,
    stackTrace: err.stack,
  };
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      errorResponse.title = "Validation Failed";
      break;
    case constants.NOT_FOUND:
      errorResponse.title = "Not Found";

    case constants.UNAUTHORIZED:
      errorResponse.title = "Unauthorized";

    case constants.FORBIDDEN:
      errorResponse.title = "Forbidden";

    case constants.SERVER_ERROR:
      errorResponse.title = "Server Error";

    default:
      errorResponse.title = "Error";
      break;
  }
  res.json(errorResponse);
};

module.exports = errorHandler;
