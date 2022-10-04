import PasswordValidator from 'password-validator'

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const schema = new PasswordValidator()
schema
    .is().min(8).max(24)
    .has().uppercase().lowercase()
    .has().digits(1)
    .has().not().spaces()

const helpers = {
    hasColor: (product, colors) => {
        if (colors.length === 0)
            return true
        for (let i = 0; i < product.colors.length; i++)
            if (colors.includes(product.colors[i].color))
                return true
        return false
    },
    hasSize: (product, sizes) => {
        if (sizes.length === 0)
            return true
        for (let i = 0; i < product.sizes.length; i++)
            if (sizes.includes(product.sizes[i].size))
                return true
        return false
    },
    hasPrice: (product, from, to) => {
        if (!from || !to)
            return true
        return from <= product.price <= to
    }
}

const util = {
    validateEmail: email => {
        return String(email)
            .toLowerCase()
            .match(emailRegex)
    },
    validatePassword: password => schema.validate(password),
    getDistinctSizes: products => {
        const result = []
        products.forEach(product => {
            product.sizes.forEach(item => {
                if (!result.includes(item.size))
                    result.push(item.size)
            })
        })
        return result
    },
    getDistinctColors: products => {
        const result = []
        products.forEach(product => {
            product.colors.forEach(item => {
                if (!result.includes(item.color))
                    result.push(item.color)
            })
        })
        return result
    },
    filterProducts: (products, colors, sizes, priceFrom, priceTo) => {
        const result = []
        products.forEach(product => {
            if (helpers.hasColor(product, colors) && helpers.hasSize(product, sizes) && helpers.hasPrice(product, priceFrom, priceTo))
                result.push(product)
        })
        return result
    },
    filterByType: (products, types) => {
        const result = []
        products.forEach(product => {
            if (types.includes(product.type.toLowerCase()))
                result.push(product)
        })
        return result
    }
}

export default util