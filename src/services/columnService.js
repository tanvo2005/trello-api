// service là tầng để sử lí dữ liệu 

/**
 * tất cả các hàm service đều bắt buộc phải có return , nếu không có reutrn
 * sẽ không có kết quả trả về cho controller nếu không nó sẽ khônng nhận được 
 * thứ gì cả cái request sẽ chạy mãi
 */

import { slugify } from '~/utils/formatters'
import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { cloneDeep } from 'lodash'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // xử lí logic dữ liệu
    const newColumn = {
      ...reqBody,
    }
    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      // xử lí cấu trúc data ở đây trước khi trả dữ liệu về
      getNewColumn.cards = [] // tạo mảng card rổng
      //  cập nhật mảng columnOrderIds trong bảng board
      await boardModel.pushColumnOrderIds(getNewColumn)
    }


    return getNewColumn
  } catch (error) {
    throw error
  }
}


export const columnService = {
  createNew,
}