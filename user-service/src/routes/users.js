import express from 'express'
import humps from 'humps'
import { findUser } from '../repositories/user-repository'

function getUserRoutes() {
  const router = express.Router()
  router.get('/:id', getUser)
  return router
}

async function getUser(req, res) {
  let user = await findUser(req.params.id)
  user = humps.camelizeKeys(user)
  res.json(user)
}

export {getUserRoutes}
