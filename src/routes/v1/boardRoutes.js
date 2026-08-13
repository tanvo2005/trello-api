import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'

const Router = express.Router()
Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET api get list boards' })
  })
  // .post((req, res) => {
  //   res.status(StatusCodes.CREATED).json({ message: 'POST api create new board' })
  // })
  // bản chất các bước di chuyển của request nằm ở post khi boardValidation đưỢc thông qua nó sẽ dẫn đến boardController
  .post(boardValidation.createNew, boardController.createNew)

Router.route('/:id')
  .get(boardController.getDetails)
  .put() // dùng để update
export const boardRoutes = Router