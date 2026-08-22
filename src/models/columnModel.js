import joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = joi.object({
  boardId: joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: joi.string().required().min(3).max(50).trim().strict(),
  //item trong mảng cardOrderIds là ObjectId nên cần thêm pattern cho chuẩn 
  cardOrderIds: joi.array().items(
    joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  createdAt: joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: joi.date().timestamp('javascript').default(null),
  _destroy: joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => { // hàm kiểm tra dữ liệu trước khi tạo dữ liệu
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

// nhận được data từ phía service gọi sang
const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data) // sử dụng hàm validate
    const newColumnToAdd = {
      ...valiData,
      boardId: new ObjectId(valiData.boardId)// convert boardId từ string sang objectId() để lưu vào database
    }
    // trỏ đến DB đến collection là board và insert data vào collection đó
    const createdColumn = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(newColumnToAdd)// dùng dữ liệu sau khi đã được kiểm tra để insert vào mogodb
    return createdColumn
  } catch (error) {
    throw new Error(error)
  }
}

// sau khi tạo được dữ liệu trong database thì sẽ query 1 lần nữa tìm dữ liệu dựa vào id để hiển thị ra fontend
const findOneById = async (id) => {

  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({
      // _id: id
      // id ở đây phải nhận được là kiểu objectId() thì mới tìm được dữ liệu và có kết quả còn nếu 
      // id là string thì sẽ k hông tìm được dữ liệu và kết quả trả về là null cà để sử lí vấn đề đó
      // chúng ta sử dụng ObjectId() để convert id từ string sang objectId() để an toàn hơn
      _id: new ObjectId(id)
    })
    return result
  } catch (error) { throw new Error(error) }
}

// push 1 giá trị cardid và cuối mảng cardOrderIds của column
const pushCardOrderIds = async (card) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(card.columnId) }, // tìm kiếm column dựa vào columnId của card
      { $push: { cardOrderIds: new ObjectId(card._id) } },
      { returnDocument: 'after' } // phải có nếu không có nó sẽ trả về bảng ghi trước khi update
    )
    return result.value
  } catch (error) { throw new Error(error) }
}

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  pushCardOrderIds
}