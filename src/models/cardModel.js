import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  // .pattern(OBJECT_ID_RULE) kiểm tra chuỗi có đúng định dạng hay không, 
  // .message(OBJECT_ID_RULE_MESSAGE) : nếu không đúng định dạng thì sẽ trả về thông báo lỗi
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),// optional(), là tuỳ chọn có cũng được mà không có cũng được

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => { // hàm kiểm tra dữ liệu trước khi tạo dữ liệu
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

// nhận được data từ phía service gọi sang
const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data) // sử dụng hàm validate
    const newCardToAdd = {
      ...valiData,
      boardId: new ObjectId(valiData.boardId),
      columnId: new ObjectId(valiData.columnId)
    }
    // trỏ đến DB đến collection là board và insert data vào collection đó
    const createdCard = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(newCardToAdd)// dùng dữ liệu sau khi đã được kiểm tra để insert vào mogodb
    return createdCard
  } catch (error) {
    throw new Error(error)
  }
}

// sau khi tạo được dữ liệu trong database thì sẽ query 1 lần nữa tìm dữ liệu dựa vào id để hiển thị ra fontend
const findOneById = async (id) => {

  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({
      // _id: id
      // id ở đây phải nhận được là kiểu objectId() thì mới tìm được dữ liệu và có kết quả còn nếu 
      // id là string thì sẽ k hông tìm được dữ liệu và kết quả trả về là null cà để sử lí vấn đề đó
      // chúng ta sử dụng ObjectId() để convert id từ string sang objectId() để an toàn hơn
      _id: new ObjectId(id)
    })
    return result
  } catch (error) { throw new Error(error) }
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
}