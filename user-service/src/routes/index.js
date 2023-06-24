import express from 'express'
import {getUserRoutes} from './users'

function getRoutes() {
  const router = express.Router()
  router.use('/users', getUserRoutes())
  return router
}

export {getRoutes}
