

import joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { BOARD_TYPE } from '~/utils/constants'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'
// define collection name and schema

const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = joi.object({
  title: joi.string().required().min(3).max(50).trim().strict(),
  slug: joi.string().min(3).trim().strict(),
  description: joi.string().required().min(3).max(225).trim().strict(),
  type: joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE).required(),
  columnOrderIds: joi.array().items(
    // items() là objectid các phần tử id nên phải kiểm tra xem có đúng định dạng hay không mà nó là
    // mảng khi khởi tạo có thể rổng nên không cần required() 
    joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]), // default([]) : mặc định khi khởi tạo boảd thì sẽ gán cho nó1 cái mãng rỗng
  createdAt: joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: joi.date().timestamp('javascript').default(null),
  _destroy: joi.boolean().default(false),

})

const validateBeforeCreate = async (data) => { // hàm kiểm tra dữ liệu trước khi tạo dữ liệu
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

// nhận được data từ phía service gọi sang
const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data) // sử dụng hàm validate
    // trỏ đến DB đến collection là board và insert data vào collection đó
    const createdBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(valiData)// dùng dữ liệu sau khi đã được kiểm tra để insert vào mogodb
    return createdBoard
  } catch (error) {
    throw new Error(error)
  }
}

// sau khi tạo được dữ liệu trong database thì sẽ query 1 lần nữa tìm dữ liệu dựa vào id để hiển thị ra fontend
const findOneById = async (id) => {

  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
      // _id: id
      // id ở đây phải nhận được là kiểu objectId() thì mới tìm được dữ liệu và có kết quả còn nếu 
      // id là string thì sẽ k hông tìm được dữ liệu và kết quả trả về là null cà để sử lí vấn đề đó
      // chúng ta sử dụng ObjectId() để convert id từ string sang objectId() để an toàn hơn
      _id: new ObjectId(id)
    })
    return result
  } catch (error) { throw new Error(error) }
}

// query sẽ tổng hợp ( aggregate) đê lấy column và card thuộc về cái board đó
const getDetails = async (id) => {
  try {
    // const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([ // aggregate() : tổng hợp dữ liệu từ nhiều collection khác nhau
      {
        $match: {
          _id: new ObjectId(id), // timf kiếm board dựa vào id
          _destroy: false
        }
      },
      {
        $lookup: { // đi tìm kiếm
          from: columnModel.COLUMN_COLLECTION_NAME, // từ collection column
          localField: '_id', // lấy _id của board
          foreignField: 'boardId', // so sánh với boardId của column
          as: 'columns' // trả về kết quả là 1 mảng có tên là columns
        }
      },
      {
        $lookup: {
          from: cardModel.CARD_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'cards'
        }
      }
    ]).toArray() // toArray() : chuyển kết quả trả về thành mảng
    // console.log('result', result)
    return result[0] || {} // trả về kết quả đầu tiên của mảng hoặc 1 object rỗng nếu không có kết quả
  } catch (error) { throw new Error(error) }
}
export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails
}
