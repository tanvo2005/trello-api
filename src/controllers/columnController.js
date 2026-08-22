// controller dùng để xử lý điều hướng

import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { columnService } from '~/services/columnService'

const createNew = async (req, res, next) => {
  try {
    const createColumn = await columnService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createColumn)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

export const columnController = {
  createNew,

}