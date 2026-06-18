
// eslint-disable no-console
import express from 'express'
import exitHook from 'async-exit-hook'
import { env } from '~/config/environment'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'
import { APIs_V1 } from '~/routes/v1'

const START_SERVER = () => {
  const app = express()

  // phải có 
  app.use(express.json()) // middleware để parse dữ liệu json từ client gửi lên

  app.use('/v1', APIs_V1)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello ${env.AUTHOR}, I am running at ${env.APP_HOST}:${env.APP_PORT}/`)
  })

  // thực hiện các tác vụ clearn up trước khi dừng server lại
  exitHook(() => {
    console.log('4 .disconnecting from mongodb cloud alat...')
    CLOSE_DB()
    console.log('5 .disconnected from mongodb cloud alat...')
  })
}

// cách kết nối khác dùng try catch
// IIFE (Immediately Invoked Function Expression) là một hàm được định nghĩa và
// thực thi ngay lập tức sau khi nó được tạo ra. Cú pháp của IIFE thường là một 
// hàm ẩn danh được bao quanh bởi dấu ngoặc đơn, và sau đó được gọi ngay sau đó bằng cách
// thêm cặp dấu ngoặc đơn ở cuối.
(async () => {
  try {
    console.log('1. connecting to mogodb...')
    await CONNECT_DB()
    console.log('2. connected to mongodb successfully')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})() // tác dụng cảu cập ngoạc nhon thứ 2 là để nó thực thi luôn cái funcion async

// connect_db là 1 async function nên nó sẽ trả về 1 promise
// chỉ khi kết nối database thành công thì mới start server lên
// CONNECT_DB()
//   .then(() => console.log('connected to mongodb successfully'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0) // dừng server lại nếu có lỗi xảy ra trong quá trình kết nối đến mongodb
//   }) 