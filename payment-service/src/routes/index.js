import express from 'express'
import {getPaymentRoutes} from './payments'

function getRoutes() {
  const router = express.Router()
  router.use('/payments', getPaymentRoutes())
  return router
}

export {getRoutes}
