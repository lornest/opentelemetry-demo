import express from 'express'
import { insertOrder } from '../repositories/order-repository'
import { logger } from '../logger'

const getUserEndpoint = `${process.env.USER_SERVICE_URL}/api/users`
const makePaymentEndpoint = `${process.env.PAYMENT_SERVICE_URL}/api/payments`

function getOrderRoutes() {
  const router = express.Router()
  router.post('', createOrder)
  return router
}

async function createOrder(req, res) {
  logger.info(`Calling user service to get user with ID: ${req.body.userId}`)
  const userResponse = await fetch(`${getUserEndpoint}/${req.body.userId}`)
  if (!userResponse.ok) {
    res.status(500).send("Error fetching user")
    return
  }

  logger.info(`Calling payment service to make payment with card number: ${req.body.cardNumber}`)
  let user = await userResponse.json()
  const paymentResponse = await fetch(`${makePaymentEndpoint}/processPayment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: user.id,
      paymentCard: req.body.cardNumber,
      postalCode: user.postalCode, 
    })
  })
  if (!paymentResponse.ok) {
    logger.error(`Error making payment for card number: ${req.body.cardNumber}`)
    res.status(500).send("Error making payment")
    return
  }

  const insertResult = await insertOrder({
    userId: user.id,
    cardNumber: req.body.cardNumber,
  })

  if (!insertResult) {
    res.status(500).send("Error creating order in database")
    return
  }

  res.send("Order created successfully")
}

export {getOrderRoutes}
