import express from 'express'
import {getPaymentRoutes} from './payments'

function getRoutes() {
  const router = express.Router()
  router.use('/users', getPaymentRoutes())
  return router
}

export {getPaymentRoutes}
