//  cấu hình kết nối đến mongodb

import { env } from '~/config/environment'


import { MongoClient, ServerApiVersion } from 'mongodb'
// khởi tạo 1 đối tượng trelloDatabaseInstance là null vì chưa kết nối đến mongodb
let trelloDatabaseInstance = null

// khởi tạo 1 đối tượng clinet instance để connet đến môngodb
const mogoClinetInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

// kết nối tới mogodb
export const CONNECT_DB = async () => {
  // gọi kết nối với mogodb alat với URI đã khai báo trong thân của client instance
  await mogoClinetInstance.connect()

  // kết nối thành công thì lấy database theo tên và gán ngược lại nó vào biến trelloDatabaseInstance đã khai báo ở trên
  trelloDatabaseInstance = mogoClinetInstance.db(env.DATABASE_NAME)
}

// đóng kết nối đến mogodb khi server dừng lại
export const CLOSE_DB = async () => {
  console.log('close mogodb ')
  await mogoClinetInstance.close()
}

// Function GET_DB (không async) này có nhiệm vụ export ra cái Trello Database Instance
// sau khi đã connect thành công tới MongoDB để chúng ta sử dụng ở nhiều nơi khác nhau trong code.
// Lưu ý phải đảm bảo chỉ luôn gọi cái GET_DB này sau khi đã kết nối thành công tới MongoDB
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('must connect to database first')
  return trelloDatabaseInstance
}


