// Function gets all bids from the database
const getResource = async (Resource, condition, next) => {
  try {
    const resource = await Resource.findAll({ where: condition, raw: true });

    // If no bids are found, return a 204 No Content response
    if (resource.length === 0) {
      return [];
    }
    return resource;
  } catch (e) {
    const error = new Error(e.message);
    error.name = e.name;
    return next(error);
  }
};

module.exports = {
  getResource
};
