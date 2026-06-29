// controller dùng để xử lý điều hướng

import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  try {
    //
    // console.log('req.body', req.body)
    // console.log('req.query', req.query)
    // console.log('req.params', req.params)
    // console.log('req.files', req.files)
    // console.log('req.cookies', req.cookies)

    // điều hướng dữ liệu sang tầng service

    throw new ApiError(StatusCodes.BAD_GATEWAY, 'tanvopy test error')
    // có kết quả thì trả về phía client
    // res.status(StatusCodes.CREATED).json({ message: 'Post from controller create new board successfully' })
  } catch (error) {
    next(error) // gọi middleware xử lý lỗi tập trung nó sẽ đưa về middleware sư lí lỗi ở server.js
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

export const boardController = {
  createNew
}