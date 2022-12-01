
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');

// Sequileze connection
const sequelize = new Sequelize('company', 'puakb5auucq91Nm.root', 'Sanskar@2001', {
    host: 'gateway01.us-west-2.prod.aws.tidbcloud.com',
    port: 4000,
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            ca: fs.readFileSync('ca-certificates.crt'),
            rejectUnauthorized: true
        }
    }
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

module.exports = sequelize;