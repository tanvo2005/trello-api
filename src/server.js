// const express = require('express')
import express from 'express'
const app = express()
const hostname = 'localhost'
const port = 8017

app.get('/', (req, res) => {
  res.send('<h1>Hello World voxuantanPY</h1>')
})

app.listen(port, hostname, () => {
  console.log(`hello voxuantan . I am running server at http://${hostname}:${port}/`)
})