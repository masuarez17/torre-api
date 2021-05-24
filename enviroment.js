module.exports = {
    hashKey: 'ASDDWQA',
    databaseConfig: {
        database: 'torre',
        username: 'root',
        password: 'root',
        params: {
            host: 'localhost',
            port: '3306',
            dialect: 'mysql',
            logging: false,
            define: {
                underscored: false,
                freezeTableName: false,
                charset: 'utf8',
                timestamps: true,
                createdAt: true,
                updatedAt: true
            },
            pool: {
                max: 20,
                idle: 30000
            },
        },
    }
}
