import express from 'express'
import { insertOrder } from '../repositories/order-repository'

const getUserEndpoint = `${process.env.USER_SERVICE_URL}/api/users`
const makePaymentEndpoint = `${process.env.PAYMENT_SERVICE_URL}/api/payments`

function getOrderRoutes() {
  const router = express.Router()
  router.post('', createOrder)
  return router
}

async function createOrder(req, res) {
  // First, we fetch the user from the user service
  console.log(req.headers)
  const userResponse = await fetch(`${getUserEndpoint}/${req.body.userId}`)
  if (!userResponse.ok) {
    res.status(500).send("Error fetching user")
    return
  }
  // We then use the user's information to make a payment request to the payment service
  console.log(`Making payment request to ${makePaymentEndpoint}`)
  let user = await userResponse.json()
  console.log(user)
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
    console.log(paymentResponse.text())
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
