const http = require('http')
const app = require('./app')
const cluster = require('cluster')
const cpus = require('os').cpus()
const database = require('./database')

const port = process.env.PORT || 3000

if (cluster.isMaster) {
    console.log(`Starting REST API on ${cpus.length} cpu's`)
    console.log(`Master cluster ${process.pid} is running`)
    console.log('Listening to port: ', port)

    // Database connection
    database.sync()
        .then(() => {
            console.log('Database successfully synchronized')
        })
        .catch((error) => {
            console.log(`Error creating tables: ${error}`)
        })

    cpus.forEach(() => cluster.fork())

    cluster.on("listening", worker => {
        console.log(`Cluster ${worker.process.pid} listening`)
    })

    cluster.on("disconnect", worker => {
        console.log(`Cluster ${worker.process.pid} disconnected`)
    })

    cluster.on("exit", worker => {
        console.log(`Cluster ${worker.process.pid} died`)
        cluster.fork()
    })
} else {
    const server = http.createServer(app)

    server.listen(port)
}
