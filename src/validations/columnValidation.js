import joi, { required } from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPE } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

/**
 * validate là bắc buộc ở phía backend vì đây lad điểm cuối để lưu trữ dữ liệu vào database
 * thông thường trong thực tế luôn validate ở cả 2 phía backend và frontend
 */
const createNew = async (req, res, next) => {
  // taọ biến chứa 1 điều kiện đúng để so sánh
  const corretCondition = joi.object({
    boardId: joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: joi.string().required().min(3).max(50).trim().strict(),

  })

  try {

    await corretCondition.validateAsync(req.body, { abortEarly: false })
    next()

    // res.status(StatusCodes.CREATED).json({ message: 'Post from validation api create new board' })
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }


}

export const columnValidation = {
  createNew
}