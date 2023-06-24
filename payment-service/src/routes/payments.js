import express from 'express'

function getPaymentRoutes() {
  const router = express.Router()
  router.get('/', makePayment)
  return router
}

async function makePayment(req, res) {
  res.send("Hello from payment-service!")
}

export {getPaymentRoutes}
