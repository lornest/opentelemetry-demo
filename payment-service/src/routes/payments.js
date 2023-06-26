import express from 'express'

function getPaymentRoutes() {
  const router = express.Router()
  router.post('', makePayment)
  return router
}

async function makePayment(req, res) {
  res.send(`Payment made successfully with card ${req.body.paymentCard}`)
}

export {getPaymentRoutes}
