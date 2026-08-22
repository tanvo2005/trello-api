import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from '~/routes/v1/boardRoutes'
import { columnRoutes } from '~/routes/v1/columnRoutes'
import { cardRoutes } from '~/routes/v1/cardRoutes'

const Router = express.Router()
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'API vi are you ready to use' })
})

// api boards
Router.use('/boards', boardRoutes)
// api columns
Router.use('/columns', columnRoutes)
// api cards
Router.use('/cards', cardRoutes)

export const APIs_V1 = Router