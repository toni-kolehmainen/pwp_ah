const mockUser = {
  id: 1,
  name: 'John Doe',
  nickname: 'Johnny',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
  password: 'hashedpassword123',
  toJSON: jest.fn().mockReturnValue({
    id: 1,
    name: 'John Doe',
    nickname: 'Johnny',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
  }),
};

const mockUpdateUser = {
  password: 'hashedpassword123'
};

const mockUpdateUser1 = {
  name: 'pekka'
};

const mockUpdateUserInvalid = {
  name: 'pekka',
  password: 'hashedpassword123'
};

const mockUserWrong = {
  nickname: 'Johnny',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
  password: 'hashedpassword123'
};

const mockCategories = [
  {
    name: 'Toys',
    description: 'lorum'
  },
  {
    name: 'Sports'
  }
];

const mockCategory = {
  name: 'Electronics'
};

const mockCategoryWrong = {
  description: 'lorum'
};

// Mock data for items
const mockItem = {
  name: 'Sample Item',
  description: 'This is a sample item.',
  userId: 1,
  categoryId: 1
};

const mockItemWrong = {
  description: 'This is a sample item without a name.',
  userId: 1,
  categoryId: 1
};

const mockUpdateItem = {
  description: 'This is an updated item description.'
};

const mockUpdateItem1 = {
  name: 'Updated Item Name'
};

const mockUpdateItemInvalid = {
  name: 'Updated Item Name',
  description: 'This is an updated item description.'
};

const mockItems = [
  {
    id: 1,
    name: 'Sample Item 1',
    description: 'This is a sample item 1.',
    userId: 1,
    categoryId: 1
  },
  {
    id: 2,
    name: 'Sample Item 2',
    description: 'This is a sample item 2.',
    userId: 2,
    categoryId: 2
  }
];

module.exports = {
  mockUser,
  mockCategory,
  mockUserWrong,
  mockCategories,
  mockCategoryWrong,
  mockUpdateUser,
  mockUpdateUserInvalid,
  mockUpdateUser1,
  mockItem,
  mockItemWrong,
  mockUpdateItem,
  mockUpdateItemInvalid,
  mockUpdateItem1,
  mockItems
};

