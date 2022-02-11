var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

const aws = require('aws-sdk')
async function loadStripeAPIKey() {
  const { Parameter } = await (new aws.SSM())
    .getParameter({
      Name: process.env["STRIPE_LIMITED_API_KEY"],
      WithDecryption: true, //暗号化されたパラメータを取得する際に、WithDecryption=Trueで指定すると、複合化して値を取得することができる
    })
    .promise()

    const stripeApiKey = Parameter.Value
    if (!stripeApiKey) {
      throw new Error('STRIPE_LIMITED_API_KEYがSecret valuesに設定されていません。')
    }

    return stripeApiKey
}

async function loadStripe() {
  const apiKey = await loadStripeAPIKey()
  return require('stripe')(apiKey)
}

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


/**********************
 * 商品一覧を取得するAPI *
 **********************/
app.get('/shop/products', async function(req, res) {
  // Add your code here
  const stripe = await loadStripe()
  const items = await stripe.products.list()
  const response = await Promise.all(items.data.map(async product => {
    const priceResponse = await stripe.prices.list({
      product: product.id
    })
    product.prices = priceResponse.data
    return product
  }))
  res.json(response);
});

/****************************
* Stripe Checkout           *
* 決済ページURLを作成するAPI    *
****************************/

app.post('/shop/products/:price_id/checkout', async function(req, res) {
  const stripe = await loadStripe()
  const priceId = req.params.price_id;
  const appUrl = req.headers.origin || 'http://localhost:3000';

  const price = await stripe.prices.retrieve(priceId)
  if (!price) {
    return res.status(404).json({
      message: '存在しない料金IDです。'
    })
  }

  const session = await stripe.checkout.sessions.create({
    mode: price.type === 'recurring' ? 'subscription': 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price: priceId,
      quantity: 1
    }],
    cancel_url: `${appUrl}/cancel`,
    success_url: `${appUrl}/success`,
  })
  
  res.json(session)
});


app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app