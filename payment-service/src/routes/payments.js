import express from 'express'
import { delay } from '../utils/delay'
import otel, { SpanStatusCode } from '@opentelemetry/api'
import { SemanticAttributes } from '@opentelemetry/semantic-conventions'
import { logger } from '../logger'

function getPaymentRoutes() {
  const router = express.Router()
  router.post('/processPayment', processPayment)
  return router
}

// Get a tracer from the global tracer provider
const tracer = otel.trace.getTracer('payment-service')

/**
  This function makes some calls to stubbed out third party payment providers.
  We simulate some network delays to make the calls more realistic.
 */
async function processPayment(req, res) {
  return tracer.startActiveSpan('payment-service.processPayment', async (span) => {
    span.setAttribute(SemanticAttributes.CODE_FUNCTION, 'processPayment')
    span.setAttribute(SemanticAttributes.CODE_FILEPATH, __filename)
    span.setAttribute('paymentCard', req.body.paymentCard)
    logger.info(`Processing payment with card ${req.body.paymentCard}`)
    let cardValid = await validateCardNumber(req.body.paymentCard);
    if (!cardValid) {
      res.status(500).send(`Card ${req.body.paymentCard} failed validation`)
      span.end()
      return
    }
    let success = await processWithThirdPartyPaymentProvider()
    if (!success) {
      res.status(500).send(`Payment failed with card ${req.body.paymentCard}`)
      span.end()
      return
    }
    span.end()
    res.send(`Payment made successfully with card ${req.body.paymentCard}`)
  })
}

/**
 * This function simulates a call to a third party card provider to validate the card number.
 * We simulate some network delays to make the calls more realistic.
 * @param {int} cardNumber
 * @returns {boolean} true if the card is valid, false otherwise
 */
async function validateCardNumber(cardNumber) {
  return tracer.startActiveSpan('payment-service.validateCardNumber', async (span) => {
    span.setAttribute(SemanticAttributes.CODE_FUNCTION, 'validateCardNumber')
    span.setAttribute(SemanticAttributes.CODE_FILEPATH, __filename)
    span.setAttribute('cardNumber', cardNumber)
    
    let valid = await delay(cardNumber === "****-****-****-9876", Math.random() * 1)
    if (!valid) {
      logger.error(`Card ${cardNumber} failed validation`)
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: "Card failed validation"
      })
    } else {
      console.log("Card passed validation")
    }
    span.end()
    return valid
  })
}

/**
 * This function simulates a call to a third party payment provider.
 * We simulate some network delays to make the calls more realistic.
 * @returns {boolean} true if the payment was successful, false otherwise
 */
async function processWithThirdPartyPaymentProvider() {
  return tracer.startActiveSpan('payment-service.processWithThirdPartyPaymentProvider', async (span) => {
    span.setAttribute(SemanticAttributes.CODE_FUNCTION, 'processWithThirdPartyPaymentProvider')
    span.setAttribute(SemanticAttributes.CODE_FILEPATH, __filename)
    span.setAttribute('thirdPartyPaymentProvider', 'Stripe')
    
    console.log("Processing payment with third party payment provider")
    let successful = await delay(Math.random() < 0.5, Math.random() * 3)
    if (!successful) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: "Payment failed"
      })
    } 
    span.end()
    return successful
  })
}

export {getPaymentRoutes}
