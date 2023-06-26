import express from 'express'

const getUserEndpoint = `${process.env.USER_SERVICE_URL}/api/users`
const makePaymentEndpoint = `${process.env.PAYMENT_SERVICE_URL}/api/payments`

function getOrderRoutes() {
  const router = express.Router()
  router.post('', createOrder)
  return router
}

async function createOrder(req, res) {
  // First, we fetch the user from the user service
  console.log(req.body)
  const userResponse = await fetch(`${getUserEndpoint}/${req.body.userId}`)
  if (!userResponse.ok) {
    res.status(500).send("Error fetching user")
    return
  }
  // We then use the user's information to make a payment request to the payment service
  console.log(`Making payment request to ${makePaymentEndpoint}`)
  let user = await userResponse.json()
  console.log(user)
  const paymentResponse = await fetch(`${makePaymentEndpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: user.id,
      paymentCard: user.paymentCard,
    })
  })
  if (!paymentResponse.ok) {
    console.log(paymentResponse.text())
    res.status(500).send("Error making payment")
    return
  }
  res.send("Order created!")
}

export {getOrderRoutes}
