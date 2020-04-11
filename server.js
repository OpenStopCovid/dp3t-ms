#!/usr/bin/env node
require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const app = express()

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

app.use(express.json({limit: '100kb'}))

const keysIndex = new Map()

app.post('/declare-case', (req, res) => {
  const {contactKeys} = req.body

  if (!contactKeys || !Array.isArray(contactKeys)) {
    return res.status(400).send({
      code: 400,
      message: 'contactKeys is required and must be an array'
    })
  }

  console.log(`Declared case: ${contactKeys.length} contact keys`)

  contactKeys.forEach(contactKey => {
    if (!keysIndex.has(contactKey)) {
      keysIndex.set(contactKey, {addedAt: new Date()})
    }
  })

  res.sendStatus(204)
})

app.post('/check-status', (req, res) => {
  const {personalKeys} = req.body

  if (!personalKeys || !Array.isArray(personalKeys)) {
    return res.status(400).send({
      code: 400,
      message: 'personalKeys is required and must be an array'
    })
  }

  const matchedKeys = personalKeys.filter(personalKey => {
    return keysIndex.has(personalKey)
  })

  if (matchedKeys.length > 0) {
    return res.send({
      status: 'positive',
      matchedKeys
    })
  }

  res.send({
    status: 'negative'
  })
})

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
