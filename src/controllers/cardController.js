// controller dùng để xử lý điều hướng

import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { cardService } from '~/services/cardService'

const createNew = async (req, res, next) => {
  try {
    const createCard = await cardService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createCard)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

export const cardController = {
  createNew,

}