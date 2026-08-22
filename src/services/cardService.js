// service là tầng để sử lí dữ liệu 

/**
 * tất cả các hàm service đều bắt buộc phải có return , nếu không có reutrn
 * sẽ không có kết quả trả về cho controller nếu không nó sẽ khônng nhận được 
 * thứ gì cả cái request sẽ chạy mãi
 */

import { slugify } from '~/utils/formatters'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { cloneDeep } from 'lodash'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // xử lí logic dữ liệu
    const newCard = {
      ...reqBody,
    }
    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)
    // .....
    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard) // cập nhật mảng cardOrderIds trong bảng column
    }
    return getNewCard
  } catch (error) {
    throw error
  }
}


export const cardService = {
  createNew,
}