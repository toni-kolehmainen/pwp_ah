const { resourceProperties } = require('../static/profiles');

// Function to create HAL structure for a single embedded resource
const createHalEmbedded = (resource, path, canEdit = true, showAuctionByUser = false, showBidsByAuction = false) => {
  const halStructure = {
    _links: {
      self: { href: `/api/${path}/${resource.id}` }
    },
    ...resource
  };
  // Add the 'edit' link conditionally
  if (canEdit) {
    halStructure._links.edit = { href: `/api/${path}/${resource.id}`, method: 'PUT' };
  }

  // Add the 'delete' link conditionally
  // if (canDelete) {
  halStructure._links.delete = { href: `/api/${path}/${resource.id}`, method: 'DELETE' };
  // }

  if (showAuctionByUser) {
    halStructure._links.auctionByUser = { href: `/api/users/${resource.id}/auctions`, method: 'GET' };
  }

  if (showBidsByAuction) {
    halStructure._links.bidsByAuction = { href: `/api/auctions/${resource.id}/bids`, method: 'GET' };
  }

  return halStructure;
};

// Function to create HAL structure for a single resource
const createHalLinks = (resource, path, canEdit = true, showAuctionByUser = false, showBidsByAuction = false) => {
  const halStructure = {
    _links: {
      self: { href: `/api/${path}/${resource.id}` },
      all: { href: `/api/${path}` },
      profile: { href: `/profile/${path}` }
    },
    ...resource
  };

  // Add the 'edit' link conditionally
  if (canEdit) {
    halStructure._links.edit = { href: `/api/${path}/${resource.id}`, method: 'PUT' };
  }

  // Add the 'delete' link conditionally
  // if (canDelete) {
  halStructure._links.delete = { href: `/api/${path}/${resource.id}`, method: 'DELETE' };
  // }

  if (showAuctionByUser) {
    halStructure._links.auctionByUser = { href: `/api/users/${resource.id}/auctions`, method: 'GET' };
  }

  if (showBidsByAuction) {
    halStructure._links.bidsByAuction = { href: `/api/auctions/${resource.id}/bids`, method: 'GET' };
  }

  return halStructure;
};

// Function to delete HAL structure for a single resource
const deleteHalLinks = (path) => {
  const halStructure = {
    _links: {
      self: { href: `/api/${path}` },
      create: { href: `/api/${path}`, method: 'POST' },
      profile: { href: `/profile/${path}` }
    },
    message: `Deleted successfully from ${path}`
  };

  return halStructure;
};

// Function to put HAL structure for a single resource
const putHalLinks = (resource, path) => {
  const halStructure = {
    _links: {
      self: { href: `/api/${path}/${resource.id}` },
      create: { href: `/api/${path}`, method: 'POST' },
      profile: { href: `/profile/${path}` },
      edit: { href: `/api/${path}/${resource.id}`, method: 'PUT' },
      delete: { href: `/api/${path}/${resource.id}`, method: 'DELETE' }
    },
    ...resource,
    message: `${path} updated successfully`
  };

  return halStructure;
};

// Function to create HAL structure for a resource profile
const createHalProfile = (resourceId, path, canEdit = true) => {
  const halStructure = {
    _links: {
      self: { href: `/profile/${path}` },
      item: {
        href: `/api/${path}/${resourceId}`,
        templated: true
      }
    },
    properties: resourceProperties(path),
    actions: [
      {
        name: 'create',
        method: 'POST',
        href: `/api/${path}`,
        title: `Create a new object to ${path}`
      },
      {
        name: 'get all',
        method: 'GET',
        href: `/api/${path}`,
        title: `Get a all objects from ${path}`
      },
      {
        name: 'get single',
        method: 'GET',
        href: `/api/${path}/${resourceId}`,
        title: `Get a single object from ${path} by ${resourceId}`
      },
      {
        name: 'delete',
        method: 'DELETE',
        href: `/api/${path}/${resourceId}`,
        templated: true,
        title: `Delete object from ${path}`
      }
    ]
  };

  if (canEdit) {
    halStructure.actions.push({
      name: 'update',
      method: 'PUT',
      href: `/api/${path}/${resourceId}`,
      templated: true,
      title: `Update an existing object in ${path}`
    });
  }

  return halStructure;
};

module.exports = {
  createHalLinks,
  createHalEmbedded,
  createHalProfile,
  deleteHalLinks,
  putHalLinks
};
