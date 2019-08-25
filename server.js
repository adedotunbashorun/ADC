let express = require('express')
let morgan = require('morgan')
let path = require('path')
let cors = require('cors')
const config = require('./config/index')
const routes = require('./config/route')
let sequelize_db = require('./config/db')

app = express()

const port = process.env.port || 5000


sequelize_db.authenticate().then(() => {
    console.log('Connected')
}).catch(err => {
    console.log(err, 'something is wrong')
    process.exit()
})

app.use(cors({
    origin: [],
    credentials: true
}))

//middleware for logging your request
app.use(morgan('dev'))

//this is for your request data
app.use(express.json({ limit: config.data.limit }))
app.use(express.urlencoded({ limit: config.data.limit, extended: config.data.extended }))

//set static folder
app.use(express.static(path.join(__dirname, '/')))
app.use('/', express.static(path.join(__dirname, '/')))

//routes init
routes.forEach( route => {
    app.use('/api', route)
});

app.set('port',port)
module.exports = app