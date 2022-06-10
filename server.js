const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(morgan('dev'))

const PORT = process.env.PORT || 3333
app.listen(PORT)