const { body, validationResult } = require("express-validator");
const api_response = require("../helpers/api-response")


const validationError = async (req,res) => {
  console.log("here")
  error = validationResult(req);
  if (!error.isEmpty()) {
    return api_response.validationError(
      res,
      error.array()[1]?.msg ?? error.array()[0].msg
    );
  }
};

module.exports = { validationError }
