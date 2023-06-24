import express from 'express'
import {getOrderRoutes} from './orders'

function getRoutes() {
  const router = express.Router()
  router.use('/orders', getOrderRoutes())
  return router
}

export {getRoutes}
