const pool = require('../database/databasePool')
const bcrypt = require('bcrypt')
const SALT = process.env.SALT

const users = {
    addUser: (req, res, next) => {
        console.log(SALT)
        bcrypt.hash(req.body.password, SALT, (err, hash) => {
            if (err) console.log(err)
            pool.query(`INSERT INTO users (name, email, password, type, status) 
                  VALUES ($1, $2, $3, $4, 'inactive') ON CONFLICT DO NOTHING RETURNING id`,
                [req.body.name, req.body.email, hash, req.params.type],
                (err, result) => {

                    if (req.params.type === 'store' && result.rowCount === 1) {

                        pool.query(`INSERT INTO store_info (store_id, phone, address, store_type, pfp_url, cover_url) VALUES ($1, $2, $3, $4, $5, $6)`,
                            [result.rows[0].id, req.body.phone, req.body.address, req.body.type, util.getDefaultStorePfp(), util.getDefaultStoreCover()], err => {
                                if (err) console.log(err)
                            })
                    }
                    if (result.rows.length > 0) {
                        req.newUserId = result.rows[0].id
                        req.newUserType = req.params.type
                    }
                    req.rowCount = result.rowCount
                    next()
                })
        })
    },
    getUser: (req, res, next) => {
        pool.query(`SELECT * FROM users u INNER JOIN user_details ud ON u.id = ud.user_id WHERE email = $1`,
                    [req.body.email], (err, result) => {
                    if (err) console.log(err)
                    
                    if (result.rows.length > 0) {
                        bcrypt.compare(req.body.password, result.rows[0].password, (err, response) => {
                            if (err) console.log(err)
                            if (response) {
                                const {password, ...rest} = result.rows[0]
                                req.user = rest
                            }
                            else req.result = {message: 'Wrong password'}
                            next()
                        })
                    } else {
                        req.result = {message: "User doesn't exist"}
                        next()
                    }
                })
    },
    getUserByEmail: (req, res, next) => {
        pool.query(`SELECT * FROM users WHERE email = $1`, [req.params.email], (err, result) => {
            if (err) console.log(err)
            req.user = result.rows[0]
            next()
        })
    }
}


module.exports = users