const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const router = require('./router')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.use("/api", router)
app.use(middleware.requestLogger)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
