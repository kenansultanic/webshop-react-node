const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dws.webshop@gmail.com',
        pass: 'jszoaanxkrgvxtlj'
    }
})

const email = {
    passwordRestart: (code, email) => {
        const mailOptions = {
            from: 'dws.webshop@gmail.com',
            to: email,
            subject: 'Promjena lozinke',
            text: `Vaš kod za promjenu lozinke je ${code}`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.log(error)
        })
    },
    userOrderCreated: (email, orderId) => {
        const mailOptions = {
            from: 'dws.webshop@gmail.com',
            to: email,
            subject: 'Nova narudžba',
            text: `Kreirana nova narudžba u vaše ime, redni broj narudžbe je ${orderId}`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.log(error)
        })
    },
    newsletterEmail: (email, text) => {
        const mailOptions = {
            from: 'dws.webshop@gmail.com',
            to: email,
            subject: 'Nova poruka',
            text: text
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.log(error)
        })
    }
}

module.exports = email