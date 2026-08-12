import joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

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

export const ColumnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA
}