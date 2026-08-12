

import joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
// define collection name and schema

const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = joi.object({
  title: joi.string().required().min(3).max(50).trim().strict(),
  slug: joi.string().min(3).trim().strict(),
  description: joi.string().required().min(3).max(225).trim().strict(),
  columnOrderIds: joi.array().items(
    // items() là objectid các phần tử id nên phải kiểm tra xem có đúng định dạng hay không mà nó là
    // mảng khi khởi tạo có thể rổng nên không cần required() 
    joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]), // default([]) : mặc định khi khởi tạo boảd thì sẽ gán cho nó1 cái mãng rỗng
  createdAt: joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: joi.date().timestamp('javascript').default(null),
  _destroy: joi.boolean().default(false),

})

// nhận được data từ phía service gọi sang
const createNew = async (data) => {
  try {
    // trỏ đến DB đến collection là board và insert data vào collection đó
    const createdBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(data)
    return createdBoard
  } catch (error) {
    throw new Error(error)
  }
}

// sau khi tạo được dữ liệu trong database thì sẽ query 1 lần nữa tìm dữ liệu dựa vào id để hiển thị ra fontend
const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
      _id: id
      // id ở đây phải nhận được là kiểu objectId() thì mới tìm được dữ liệu và có kết quả còn nếu 
      // id là string thì sẽ k hông tìm được dữ liệu và kết quả trả về là null
    })
    return result
  } catch (error) { throw new Error(error) }
}
export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById
}