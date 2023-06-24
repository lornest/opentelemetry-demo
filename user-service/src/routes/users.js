import express from 'express'

function getUserRoutes() {
  const router = express.Router()
  router.get('/:id', getUser)
  return router
}

async function getUser(req, res) {
  res.send("Hello from user-service!")
}

export {getUserRoutes}
