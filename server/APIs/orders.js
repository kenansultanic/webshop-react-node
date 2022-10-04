const pool = require('../database/databasePool')

const orders = {
    placeNewOrder: (req, res, next) => {
        req.cart = req.body.cart
        pool.query(`INSERT INTO orders (user_id, order_date, order_status)
                    VALUES ($1, NOW(), 'in proccesssing') RETURNING id`, [req.cookies.user.id], (err, result) => {
                if (err) console.log(err)
                req.order_id = result.rows[0].id
                next()
            })
    },
    addOrderItems: (req, res, next) => {
        let query = `INSERT INTO order_items (order_id, product_id, quantity, price, color, size) VALUES `
        const params = [req.order_id]
        let counter = 1
        req.cart.forEach(item => {
            params.push(item.id, item.quantity, item.price, item.color, item.size)
            query += `($1, $${++counter}, $${++counter}, $${++counter}, $${++counter}, $${++counter}),`
        })
        pool.query(query.slice(0, -1), params, (err, result) => {
            if (err) console.log(err)
            next()
        })
    },
    getUserOrders: (req, res, next) => {
        pool.query(`SELECT * FROM orders WHERE user_id = $1`, [req.cookies.user.id], (err, result) => {
            if (err) console.log(err)
            req.orders = result.rows
            next()
        })
    },
}

module.exports = orders