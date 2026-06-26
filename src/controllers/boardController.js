// controller dùng để xử lý điều hướng

import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  try {
    //
    console.log('req.body', req.body)
    console.log('req.query', req.query)
    console.log('req.params', req.params)
    console.log('req.files', req.files)
    console.log('req.cookies', req.cookies)

    // điều hướng dữ liệu sang tầng service

    // có kết quả thì trả về phía client
    res.status(StatusCodes.CREATED).json({ message: 'Post from controller create new board successfully' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

export const boardController = {
  createNew
}