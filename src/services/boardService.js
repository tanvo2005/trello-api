/*eslint no-useless-catch: "error"*/
// service là tầng để sử lí dữ liệu 

/**
 * tất cả các hàm service đều bắt buộc phải có return , nếu không có reutrn
 * sẽ không có kết quả trả về cho controller nếu không nó sẽ khônng nhận được 
 * thứ gì cả cái request sẽ chạy mãi
 */

import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { cloneDeep } from 'lodash'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // xử lí logic dữ liệu
    const newBoard = {
      ...reqBody,  // đẩy lên có title, desciption, và tạo thêm cái slug
      slug: slugify(reqBody.title)
    }

    // gọi tới tầng model để sử lí lưu bảng ghi newBoard vào trong databas
    const createdBoard = await boardModel.createNew(newBoard)
    // console.log('createdBoard', createdBoard)

    // lấy bảng ghi boards sau khi gọi tuỳ mục đích sử dụng
    // lúc này insertedId bản chất của nó là 1 new ObjectId()
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    // console.log('getNewBoard', getNewBoard)

    //
    // làm thêm các xử lí logic khác với các Collection khác nếu có
    // bắn email notification cho admin khi có một cái board mới được tạo ra

    // trả kết quả về 
    // return createdBoard
    return getNewBoard
  } catch (error) {
    //
    throw error
  }
}

const getDetails = async (boardId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // gọi tới tầng model để sử lí lưu bảng ghi newBoard vào trong databas
    const board = await boardModel.getDetails(boardId)
    // nếu board rổng thì ném ra lỗi không tìm thấy board
    if (!board) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')

    // boardModel trả dữ liệu về tâng service 
    // xử lí dữ liệu trả về cho giống mocdata
    // coloneDeep board ra một cái mới để xử lí không ảnh hưởng đến board ban đầu
    const resBoard = cloneDeep(board)
    // đưa card về đúng column của nó
    resBoard.columns.forEach(column => {
      // column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString()) // so sánh băng phải chuyển về toString() vì card.columnId là ObjectId còn column._id là string nên không so sánh được
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))

    })
    // xoá mảng card khỏi board ban đàu 
    delete resBoard.cards // xóa cái mảng cards đi vì đã đưa về đúng column của nó rồi
    return resBoard
  } catch (error) { throw error }
}
export const boardService = {
  createNew,
  getDetails
}