// controller dùng để xử lý điều hướng

import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
  try {
    //
    // console.log('req.body', req.body)
    // console.log('req.query', req.query)
    // console.log('req.params', req.params)
    // console.log('req.files', req.files)
    // console.log('req.cookies', req.cookies)

    // điều hướng dữ liệu sang tầng service
    // sử dung await vì bên service là hàm async nên trả về 1 promise
    const createBoard = await boardService.createNew(req.body)
    // throw new ApiError(StatusCodes.BAD_GATEWAY, 'tanvopy test error')
    // có kết quả thì trả về phía client
    res.status(StatusCodes.CREATED).json(createBoard)
  } catch (error) {
    next(error) // gọi middleware xử lý lỗi tập trung nó sẽ đưa về middleware sư lí lỗi ở server.js
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

const getDetails = async (req, res, next) => {
  try {
    // console.log('req.params', req.params)
    const boardId = req.params.id
    // điều hướng dữ liệU sang tầng service
    const board = await boardService.getDetails(boardId)

    // trả kết quả về phía client
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createNew,
  getDetails
}