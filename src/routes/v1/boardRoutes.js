import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'

const Router = express.Router()
Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET api get list boards' })
  })
  // .post((req, res) => {
  //   res.status(StatusCodes.CREATED).json({ message: 'POST api create new board' })
  // })
  .post(boardValidation.createNew)
export const boardRoutes = Router