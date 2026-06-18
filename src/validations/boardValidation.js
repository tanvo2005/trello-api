import joi, { required } from 'joi'
import { StatusCodes } from 'http-status-codes'
/**
 * validate là bắc buộc ở phía backend vì đây lad điểm cuối để lưu trữ dữ liệu vào database
 * thông thường trong thực tế luôn validate ở cả 2 phía backend và frontend
 */
const createNew = async (req, res, next) => {
  // taọ biến chứa 1 điều kiện đúng để so sánh
  const corretCondition = joi.object({
    title: joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'title is required tanvoxuan',
      'string.min': 'title must be at least 3 characters long',
      'string.max': 'title must be at most 50 characters long',
      'string.empty': 'title cannot be empty',
      'string.trim': 'title cannot have leading or trailing whitespace',
    }),
    description: joi.string().required().min(3).max(256).trim().strict(),

  })

  try {
    console.log('req.body: ', req.body)// backend nhận được dữ liệu từ client gửi lên thông qua req.body

    // abortEarly: false đẻ chỉ định trả về nhiều lỗi nếu có
    // abortEarly: false để biết hành động vaditation có dừng xớm hay không ; mặc định là true
    // ví dụ nếu title bị lôi nó sẽ trả về lỗi trước để sữa sau đó tới những trường khắc, 
    await corretCondition.validateAsync(req.body, { abortEarly: false })// kiẻm tra dữ liệu từ client gửi lên có hợp lệ theo đièu kiện mà ta cho  hay không, nếu không hợp lệ sẽ trả về lỗi và dừng thực thi
    // next() // đưa dữ liệu sang tầng khác để tiếp tục xử lý middlware hoặc controller

    res.status(StatusCodes.CREATED).json({ message: 'Post from validation api create new board' })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: new Error(error).message })
    // UNPROCESSABLE_ENTITY trả vè mã 422 là thực thể dữ liệu không thể thực thi được
  }


}

export const boardValidation = {
  createNew
}