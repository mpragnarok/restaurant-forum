'use strict';
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [{
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        isAdmin: true,
        name: 'root',
        createdAt: new Date(),
        updatedAt: new Date(),
        image: faker.image.imageUrl()
      }, {
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        isAdmin: false,
        name: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
        image: faker.image.imageUrl()
      },
      {
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        isAdmin: false,
        name: 'user2',
        createdAt: new Date(),
        updatedAt: new Date(),
        image: faker.image.imageUrl()
      }
    ], {})
    queryInterface.bulkInsert('Categories',
      ['Chinese', 'Japanese', 'Italian', 'Mexican', 'Vegetarian', 'American', 'Fusion', 'Cafe']
      .map((item, index) =>
        ({
          id: index + 1,
          name: item,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})
    return queryInterface.bulkInsert('Restaurants', Array.from({ length: 50 }).map(d => ({
      name: faker.name.findName(),
      tel: faker.phone.phoneNumber(),
      address: faker.address.streetAddress(),
      opening_hours: '08:00',
      image: faker.image.imageUrl(),
      description: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date(),
      CategoryId: Math.floor(Math.random() * 5) + 1
    })), {})
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {})
    queryInterface.bulkDelete('Categories', null, {})
    return queryInterface.bulkDelete('Restaurants', null, {})
  }
};