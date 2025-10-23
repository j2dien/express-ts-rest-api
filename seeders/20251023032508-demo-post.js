'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    //  Add seed commands here.
     
    //  Example:
    await queryInterface.bulkInsert('Posts', [
      {
        title: "Post 1",
        description: "Post 1 description",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Post 2",
        description: "Post 2 description",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Post 3",
        description: "Post 3 description",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
    */
    await queryInterface.bulkDelete('Posts', null, {});
  }
};
