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
    return board
  } catch (error) { throw error }
}
export const boardService = {
  createNew,
  getDetails
}