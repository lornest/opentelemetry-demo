import express from 'express'

const userServiceUrl = process.env.USER_SERVICE_URL

function getOrderRoutes() {
  const router = express.Router()
  router.post('', createOrder)
  return router
}

async function createOrder(req, res) {
  const response = await fetch(`${userServiceUrl}/api/users/123`)
  if (!response.ok) {
    res.status(500).send("Error fetching user")
    return
  }
  res.send(response.body)
}

export {getOrderRoutes}
