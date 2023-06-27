import express from 'express'
import { delay } from '../utils/delay'

function getPaymentRoutes() {
  const router = express.Router()
  router.post('/processPayment', processPayment)
  return router
}

async function processPayment(req, res) {
  // call validateCardNumber and return an error if invalid
  let cardValid = validateCardNumber(req.body.paymentCard);
  if (!cardValid) {
    res.status(500).send(`Card ${req.body.paymentCard} failed validation`)
    return
  }
  let success = await processWithThirdPartyPaymentProvider()
  console.log(success)
  if (!success) {
    res.status(500).send(`Payment failed with card ${req.body.paymentCard}`)
    return
  }
  res.send(`Payment made successfully with card ${req.body.paymentCard}`)
}

function validateCardNumber(cardNumber) {
  // here we're just hardcoding a response based on the mock users. One card is valid the other is not
  // we're also simulating a network delay of up to a 2 seconds
  return delay(cardNumber === "****-****-****-9876", Math.random() * 2)
}

async function processWithThirdPartyPaymentProvider() {
  // here we're simulating a call to a third party payment provider, with potential network delays up to 6 seconds.
  return delay(Math.random() < 0.5, Math.random() * 6)
}

export {getPaymentRoutes}
