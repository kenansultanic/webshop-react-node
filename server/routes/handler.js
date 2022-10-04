require('dotenv').config()
const express = require('express')
const router = express.Router()
const pool = require('../database/databasePool')
const bcrypt = require('bcrypt')
const products = require('../APIs/products')
const users = require('../APIs/users')
const orders = require('../APIs/orders')
const jwt = require('jsonwebtoken')
const email = require('../util/email')
const util = require('../util/util')
const SALT = process.env.SALT

// USERS

router.post('/register', (req, res) => {
  bcrypt.hash(req.body.password, SALT, (err, hash) => {
    if (err) console.log(err)
    pool.query(`INSERT INTO users (name, surname, email, password, newsletter) 
                VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
                [req.body.name, req.body.surname, req.body.email, hash, req.body.newsletter], 
                (err, result) => {
                  if (err) console.log(err)
                  res.status(200).json({isSaved: result.rowCount})
                })
  })
})

router.post('/login', users.getUser, (req, res) => {
  if (req.user) {
    const token = jwt.sign(req.user, process.env.JWT_SECRET, {expiresIn: '1d'})
    res.cookie('jwt', token, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
    res.cookie('user', req.user)
    res.status(200).json({accessToken: token, user: req.user})
  } 
  else res.status(401).json(req.result)
})

router.get('/token', (req, res) => {
  res.send({accessToken: req.cookies.jwt, user: req.cookies.user})
})

router.get('/logout', (req, res) => {
  res.clearCookie('jwt')
  res.clearCookie('user')
  res.sendStatus(200)
})

router.get('/get-user-info',  (req, res) => {
  res.status(200).json(req.cookies.user)
})

router.post('/change-email', users.getUser, (req, res) => {
  if (req.user) {
    pool.query(`UPDATE users SET email = $1 WHERE email = $2`, [req.body.newEmail, req.body.email], (err, result) => {
      if (err) console.log(err)
      res.sendStatus(200)
    })
  }
  else res.sendStatus(401)
})

router.post('/change-password', users.getUser, (req, res) => {
  if (req.user) {
    bcrypt.hash(req.body.newPassword, SALT, (err, hash) => {
      if (err) console.log(err)
      pool.query(`UPDATE users SET password = $1 WHERE email = $2`, [hash, req.body.email], (err, result) => {
                  if (err) console.log(err)
                  res.sendStatus(200)
                })
    })
  } else res.sendStatus(401)
})

router.post('/update-address', (req, res) => {
  pool.query(`UPDATE user_details SET address = $1, city = $2, zip = $3, region = $4, phone = $5 WHERE user_id = $6`,
              [req.body.address, req.body.city, req.body.zip, req.body.region, req.body.phone, req.body.id],
              (err, result) => {
                if (err) console.log(err)
                res.sendStatus(200)
              })
})

router.get('/user-order-history', (req, res) => {
  pool.query(`SELECT * FROM getUserOrderHistory($1)`, [req.cookies.user.id], (err, result) => {
    if (err) console.log(err)
    res.status(200).json(result.rows)
  })
})

router.post('/cancel-newsletter', (req, res) => {
  const {user} = req.cookies
  pool.query(`UPDATE users SET newsletter = false WHERE id = $1`, [user.id], (err, result) => {
    user.newsletter = false
    res.cookie('user', user)
    if (err) console.log(err)
    res.sendStatus(200)
  })
})

router.post('/join-newsletter', (req, res) => {
  const {user} = req.cookies
  pool.query(`UPDATE users SET newsletter = true WHERE id = $1`, [user.id], (err, result) => {
    user.newsletter = true
    res.cookie('user', user)
    if (err) console.log(err)
    res.sendStatus(200)
  })
})


// PASSWORD RESTART

router.get('/find-user/:email', users.getUserByEmail, (req, res) => {
  if (req.user) {
    const code = util.randomNumber(10000, 99999)
    const hash = bcrypt.hashSync(toString(code), SALT)
    res.cookie('restart_code', hash)
    email.passwordRestart(code, req.params.email)
    res.status(200).json({user: req.user})
  }
  else res.sendStatus(404)
})

router.post('/restart-password', (req, res) => {
  if (bcrypt.compareSync(toString(req.body.code), req.cookies.restart_code)) {
    bcrypt.hash(req.body.password, SALT, (err, hash) => {
        if (err) console.log(err)
        pool.query(`UPDATE users SET password = $1 WHERE id = $2`, [hash, req.params.id],
            (err, result) => {
                if (err) console.log(err)
                res.sendStatus(200)
            })
    })
} else sendStatus(401)
})


// PRODUCTS

router.get('/get-all-products', products.getAllProducts, products.getAllProductImages,
                                products.getAllProductSizes, products.getAllProductColors, (req, res) => {
  res.status(200).json(util.parseProducts(req.products, req.images, req.colors, req.sizes))
})

router.post('/new/product', products.createProduct, (req, res) => {
  if (res.result === 0)
    res.end('409')
  else res.end('200')
})

router.get('/products', products.getAllProducts, (req, res) => {
  res.end(JSON.stringify(req.products))
})

router.get('/product/:id', products.getProductByID, products.getSizesByProductID, products.getColorsByProductID,
                           products.getKeywordsByProductID, products.getProuctImagesByProductID, (req, res) => {
  res.status(200).json({
    ...req.product, 
    images: req.images, 
    colors: req.colors, 
    sizes: req.sizes, 
    keywords: req.keywords
  })
})

router.post('/add-to-cart', (req, res) => {
  const cart = req.cookies.cart
  const {id, name, price, type, images} = req.body.product
  const product = {id, name, price, type, images, quantity: parseInt(req.body.quantity), color: req.body.color, size: req.body.size}
  if (cart)
      res.cookie('cart', util.addToCart(cart, product))
  else res.cookie('cart', [product])
  res.sendStatus(200)
})

router.post('/remove-from-cart/:productID', (req, res) => {
  res.cookie('cart', util.deleteFromCart(req.cookies.cart, parseInt(req.params.productID)))
  res.sendStatus(200)
})

router.get('/cart', (req, res) => {
  res.json({cart: req.cookies?.cart || [], totalPrice: util.calculateCartPrice(req.cookies?.cart)})
})

router.post('/place-order', orders.placeNewOrder, orders.addOrderItems, (req, res) => {
  res.clearCookie('cart')
  res.sendStatus(200)
})

router.get('/find-coupon/:coupon', (req, res) => {
  pool.query(`SELECT * FROM coupons WHERE coupon = $1`, [req.params.coupon], (err, result) => {
    if (err) console.log(err)
    res.status(200).json(result.rows)
  })
})


// ADMIN

router.get('/dashboard-statistics', (req, res) => {
  pool.query(`SELECT * FROM getDashboardStatistics()`, (err, result) => {
    if (err) console.log(err)
    res.status(200).json(result.rows)
  })                                    
})

router.get('/get-new-orders', (req, res) => {
  pool.query(`SELECT * FROM orders ORDER BY order_date DESC LIMIT 8`, (err, result) => {
    if (err) console.log(err)
    res.status(200).json(result.rows)
    next()
})
})

router.get('/all-orders', (req, res) => {
  pool.query(`SELECT * FROM getAllOrders()`, (err, result) => {
    if (err) console.log(err)
    res.status(200).json(result.rows)
  })
})

router.post('/add-product', products.addProduct, products.addProductColors, products.addProductSizes, 
                            products.addProductKeywords, products.addProductKeywords, 
                            products.addProductImages, (req, res) => {
  res.sendStatus(200)
})

router.get('/new-products', (req, res) => {
  pool.query(`SELECT * FROM products ORDER BY timestamp ASC LIMIT 8`, (err, result) => {
    if (err) console.log(err)
    res.status(200).json(result.rows)
  })
})

router.post('/new-coupon', (req, res) => {
  pool.query(`INSERT INTO coupons (coupon, discount, number_of_uses, valid_until) VALUES ($1, $2, 0, $3) ON CONFLICT DO NOTHING`,
  [req.body.coupon, req.body.discount, req.body.validUntil], (err, result) => {
    if (err) console.log(err)
    res.sendStatus(200)
  })
})

router.post('/delete-coupon/:id', (req, res) => {
  pool.query(`DELETE FROM coupons WHERE id = ${req.params.id}`, (err, result) => {
    if (err) console.log(err)
    res.sendStatus(200)
  })
})

router.get('/coupons', (req, res) => {
  pool.query(`SELECT * FROM coupons`, (err, result) => {
    if (err) console.log(err)
    res.status(200).json(result.rows)
  })
})

router.post('/newsletter', (req, res) => {
  pool.query(`SELECT * FROM users WHERE newsletter IS true`, (err, result) => {
    if (err) console.log(err)
    result.rows.forEach(row => {
      email.newsletterEmail(row.email, req.body.text)
    })
    res.sendStatus(200)
  })
})


module.exports = router