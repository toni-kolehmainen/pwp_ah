// const { connectToDatabase, sequelize } = require('../utils/db'); // Adjust path as needed
// const logger = require('../utils/logger'); // Assuming the logger is used in connectToDatabase
// const { dbSync  } = require('../models'); // models

// // Mock the logger methods (info and error)
// jest.mock('../utils/logger', () => ({
//   info: jest.fn(),
//   error: jest.fn(),
// }));

// jest.mock('../models', () => {
//   const mockModel = {
//     findAll: jest.fn(), // Return the mock user
//     findOne: jest.fn(),
//     create: jest.fn(),
//     update: jest.fn(), // Assuming one row updated
//     destroy: jest.fn(), // Assuming one row deleted
//   };

//   return {
//     User: mockModel,
//     Item: mockModel,
//     Category: mockModel,
//     Auction: mockModel,
//     Bid: mockModel,
//     dbSync: jest.fn(),
//   };
// });


// // Mock the sequelize instance and methods
// jest.mock('../utils/db', () => {
//   const originalDbModule = jest.requireActual('../utils/db');
  
//   return {
//     ...originalDbModule,
//     sequelize: {
//       ...originalDbModule.sequelize,
//       authenticate: jest.fn(),  // Mock the 'authenticate' method
//       close: jest.fn(),         // Mock the 'close' method as well
//     },
//   };
// });
// beforeAll(async () => {
//   await dbSync();
//   console.log('Database is synced before running tests');
// });
// // afterAll(async () => {
// //   // Make sure sequelize.close() is awaited here
// //   sequelize.close(); // Ensure we await close to properly handle async operation
// // });

// describe('DatabaseConnection', () => {
//   let consoleLogMock, exitMock;

//   beforeEach(() => {
//     jest.clearAllMocks();
//     consoleLogMock = jest.spyOn(console, 'log').mockImplementation(); // Silence console logs
//     exitMock = jest.spyOn(process, 'exit').mockImplementation(() => {}); // Prevent process.exit
//   });

//   afterEach(() => {
//     jest.restoreAllMocks(); // Restore mocks between tests
//     sequelize.close()
//   });
//   // afterAll(async() => {
//   //   // Ensure to mock a proper close of the connection in afterAll to avoid open handle
//   //   if (sequelize.close) {
//   //     sequelize.close.mockClear(); // Ensure it's properly cleared
//   //     await sequelize.close(); // Call the mock close
//   //   }
//   // });
//   it('should log "database connected" on successful connection', async () => {
//     // Mock the successful authentication
//     sequelize.authenticate.mockResolvedValueOnce(); // Simulate success

//     await connectToDatabase(); // Call the function
//     // await sequelize.authenticate();
//     await sequelize.authenticate();
//     // Assert authenticate was called
//     expect(sequelize.authenticate).toHaveBeenCalledTimes(1);
//     // Assert logger.info was called with the correct message
//     expect(logger.info).toHaveBeenCalledWith('database connected');
//     // Ensure process.exit was not called
//     expect(exitMock).not.toHaveBeenCalled();
//   });

//   // it('should log error and exit when connection fails', async () => {
//   //   sequelize.authenticate.mockRejectedValueOnce({
//   //     code: '28P01',                          // PostgreSQL error code for unique constraint violation
//   //     message: 'FATAL: password authentication failed for user "testuser"',  // Error message from PostgreSQL
//   //     parent : {
//   //       code: '28P01',  // PostgreSQL error code for authentication failure
//   //       message: 'FATAL: password authentication failed for user "testuser"',  // Message from the parent object
//   //     },
//   //     errors: [
//   //       {
//   //         message: 'Authentication failed for user "testuser"',
//   //       type: 'authentication failure',
//   //       path: 'username',  // Path to the field in error (optional)
//   //       value: 'testuser',
//   //       }
//   //     ]
//   //   });
//   //   try {
//   //     await connectToDatabase(); // Call the function
      
//   //   } catch (error) {
//   //     // await sequelize.authenticate();
//   //     // expect(sequelize.authenticate).toHaveBeenCalledTimes(1);
//   //     // Assert logger.error was called with the error
//   //     expect(logger.error).toHaveBeenCalledWith(error);
//   //     // Assert logger.info was called with 'connecting database failed'
//   //     expect(logger.error).toHaveBeenCalledWith('connecting database failed');
//   //     // Ensure process.exit was called with exit code 1
//   //     expect(exitMock).toHaveBeenCalledWith(1);
//   //   }
//   // });
// });
