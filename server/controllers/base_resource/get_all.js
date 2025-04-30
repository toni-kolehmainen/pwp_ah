const { createHalEmbedded } = require('../../utils/hal');

// This function it get all for a model
const getResource = async (db, hal, res, next) => {
  try {
    const resources = await db.model.findAll({
      where: db.where,
      attributes: db.attributes,
      raw: true
    });

    // If no resource are found, return a 204 No Content response
    if (resources.length === 0) {
      return res.status(204).end();
    }
    // else respond with bid data and hypermedia
    return res.json({
      _links:
    {
      self: { href: hal.self },
      profile: { href: `/profiles/${hal.path}/` },
      create: { href: `/api/${hal.path}`, method: 'POST' }
    },
      _embedded: {
        [hal.path]: resources.map((resource) => createHalEmbedded(resource, hal.path, hal.edit))
      }
    });
  } catch (e) {
    const error = new Error(e.message);
    error.name = e.name;
    return next(error);
  }
};

module.exports = {
  getResource
};
