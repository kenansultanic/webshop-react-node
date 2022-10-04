const pool = require('../database/databasePool')
const util = require('../util/util')
const upload = require('../util/cloudinary')

const products = {
    addProduct: (req, res, next) => {
      pool.query(`INSERT INTO products (name, price, quantity, type, description, timestamp) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id`, 
                  [req.body.name, req.body.price, req.body.quantity, req.body.type, req.body.description],
                  (err, result) => {
                    if (err) console.log(err)
                    req.newProductId = result.rows[0]?.id
                    next()
                  })
    },
    addProductSizes: (req, res, next) => {
      const sizes = req.body.sizes.split(',')
      let s = ''
      sizes.forEach(size => {
        s += `(${req.newProductId}, '${size.trim()}'),`
      })
      pool.query(`INSERT INTO sizes (product_id, size) VALUES ${s.slice(0, -1)}`, (err, result) => {
        if (err) console.log(err)
        next()
      })
    },
    addProductColors: (req, res, next) => {
      const colors = req.body.colors.split(',')
      let s = ''
      colors.forEach(color => {
        s += `(${req.newProductId}, '${color.trim()}'),`
      })
      pool.query(`INSERT INTO colors (product_id, color) VALUES ${s.slice(0, -1)}`, (err, result) => {
        if (err) console.log(err)
        next()
      })
    },
    addProductKeywords: (req, res, next) => {
      let keywords = req.body.keywords.split(',')
      let s = ''
      keywords.forEach(keyword => {
        s += `(${req.newProductId}, '${keyword.trim()}'),`
      })
      pool.query(`INSERT INTO keywords (product_id, keyword) VALUES ${s.slice(0, -1)}`, (err, result) => {
        if (err) console.log(err)
        next()
      })
    },
    addProductImages: async (req, res, next) => {
      let s = ''
      let images = req.files?.images
      if (!images.length)
        images = [images]
      for (let i = 0; i < images.length; i++) {
        const result = await upload(util.dataUri(images[i].name, images[i].data))
        s += `(${req.newProductId}, '${result.secure_url}', ${i+1}),`
      }

      pool.query(`INSERT INTO product_images (product_id, img_url, img_number) VALUES ${s.slice(0, -1)}`, (err, result) => {
        if (err) console.log(err)
        next()
      })
  },
  getProductByID: (req, res, next) => {
    pool.query(`SELECT * FROM products WHERE id = $1`, [req.params.id], (err, result) => {
      if (err) console.log(err)
      req.product = result.rows[0]
      next()
    })
  },
  getSizesByProductID: (req, res, next) => {
    pool.query(`SELECT size FROM sizes WHERE product_id = $1`, [req.params.id], (err, result) => {
      if (err) console.log(err)
      req.sizes = result.rows
      next()
    })
  },
  getColorsByProductID: (req, res, next) => {
    pool.query(`SELECT color FROM colors WHERE product_id = $1`, [req.params.id], (err, result) => {
      if (err) console.log(err)
      req.colors = result.rows
      next()
    })
  },
  getKeywordsByProductID: (req, res, next) => {
    pool.query(`SELECT keyword FROM keywords WHERE product_id = $1`, [req.params.id], (err, result) => {
      if (err) console.log(err)
      req.keywords = result.rows
      next()
    })
  },
  getProuctImagesByProductID: (req, res, next) => {
    pool.query(`SELECT * FROM product_images WHERE product_id = $1`, [req.params.id], (err, result) => {
      if (err) console.log(err)
      req.images = result.rows
      next()
    })
  },
    createCoupon: (req, res, next) => {
      pool.query(`INSERT INTO coupon_codes (code, discount, valid_until, number_of_uses, money_saved)
                  VALUES ($1, $2, $3, 0, 0) ON CONFLICT DO NOTHING`,
                  [req.body.code, req.body.discount, req.body.validUntil],
          (err, result) => {
            res.result = result.rowCount
            next()
          })
    },
    createProduct: (req, res, next) => {
      pool.query(`INSERT INTO products (name, price, available_colors, available_sizes, keywords, quantity, type, description)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [req.body.name, req.body.price, req.body.colors, req.body.sizes, req.body.keywords, req.body.quantity, req.body.type, req.body.description],
                (err, result) => {
                  res.result = result.rowCount
                  next()
                })
    },
    deleteCoupon: (req, res, next) => {
        pool.query(`DELETE FROM coupon_codes WHERE id = $1`, [req.body.couponId], 
        (err, result) => {
          res.result = result.rowCount
          next()
        })
      },
      deleteProduct: (req, res, next) => {
        pool.query(`DELETE FROM products WHERE id = $1`, [req.body.productId],
        (err, result) => {
          res.result = result.rowCount
          next()
        })
      },
      getAllProducts: (req, res, next) => {
        pool.query(`SELECT * FROM products`, (err, result) => {
          if (err) console.log(err)
          req.products = result.rows
          next()
        })
      },
      getAllProductSizes: (req, res, next) => {
        pool.query(`SELECT * FROM sizes`, (err, result) => {
          if (err) console.log(err)
          req.sizes = result.rows
          next()
        })
      },
      getAllProductColors: (req, res, next) => {
        pool.query(`SELECT * FROM colors`, (err, result) => {
          if (err) console.log(err)
          req.colors = result.rows
          next()
        })
      },
      getAllProductImages: (req, res, next) => {
        pool.query(`SELECT * FROM product_images`, (err, result) => {
          if (err) console.log(err)
          req.images = result.rows
          next()
        })
      }
  }
  
  module.exports = products