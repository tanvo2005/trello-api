/*eslint no-useless-catch: "error"*/
// service là tầng để sử lí dữ liệu 

/**
 * tất cả các hàm service đều bắt buộc phải có return , nếu không có reutrn
 * sẽ không có kết quả trả về cho controller nếu không nó sẽ khônng nhận được 
 * thứ gì cả cái request sẽ chạy mãi
 */

import { slugify } from '~/utils/formatters'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // xử lí logic dữ liệu
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // gọi tới tầng model để sử lí lưu bảng ghi newBoard vào trong database
    //
    // làm thêm các xử lí logic khác với các Collection khác nếu có
    // bắn email notification cho admin khi có một cái board mới được tạo ra

    // trả kết quả về 
    return newBoard
  } catch (error) {
    //
    throw error
  }
}

export const boardService = {
  createNew
}