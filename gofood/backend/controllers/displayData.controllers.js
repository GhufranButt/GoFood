import asyncHandler from "../utils/asyncHandlers.js";
import apiError from "../utils/apiErrors.js";

const displayData = asyncHandler(async (req, res) => {
  try {
    res.status(200).send({
      gofood: global.gofood,
      gofoodCategory: global.gofoodCategory,
    });
  } catch (error) {
    res.status(500).send(apiError("An error occurred while fetching data"));
  }
});

export { displayData };
