const { Sequelize, DataTypes } = require('sequelize')
const { databaseConfig } = require('./enviroment')
const fs = require('fs')
const path = require('path')

const sequelize = new Sequelize(
    databaseConfig.database,
    databaseConfig.username,
    databaseConfig.password,
    databaseConfig.params
    )

// Fetching models
const dir = path.join(__dirname, 'models')
fs.readdirSync(dir).forEach(file => {
    const modelDir = path.join(dir, file)
    const model = require(modelDir)(sequelize, DataTypes)
    sequelize.models[model.name] = model
});

module.exports = sequelize
