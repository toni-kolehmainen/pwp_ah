const mockUser = {
  name: 'John Doe',
  nickname: 'Johnny',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
  password: 'hashedpassword123',
}

const mockUserWrong = {
  nickname: 'Johnny',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
  password: 'hashedpassword123',
}

mockCategories = [
  {
    name: 'Toys',
    description: 'lorum'
  },
  {
    name: 'Sports'
  }
]
mockCategory = {
  name: 'Electronics'
}
mockCategoryWrong = {
  description: 'lorum'
}
module.exports = { mockUser, mockCategory, mockUserWrong, mockCategories, mockCategoryWrong };