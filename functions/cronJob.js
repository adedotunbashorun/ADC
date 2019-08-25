const fs = require("fs")
let shell = require("shelljs")
const cron = require("node-cron")
const Activity = require('./activity')



cron.schedule("*/10 * * * *", function () {
    console.log("---------------------")
    console.log("Running Cron Job 1")
})

cron.schedule("*/01 * * * *", function () {
    console.log("---------------------")
    console.log("Running Cron Job 2")
    
})


// To backup a database
cron.schedule("59 23 * * *", function () {
    console.log("---------------------")
    console.log("Running Cron Job")
    if (shell.exec("sqlite3 database.sqlite  .dump > data_dump.sql").code !== 0) {
        shell.exit(1)
    } else {
        shell.echo("Database backup complete")
    }
})