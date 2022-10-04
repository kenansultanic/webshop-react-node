const DatauriParser = require('datauri/parser')

const containsCartProducts = (products, id) => {
    let contains = false
    products.forEach(product => {
        if (product.id === id)
            contains = true
    })
    return contains
}

const util = {
    randomNumber: (min, max) => Math.floor(Math.random() * (max - min + 1) + min),
    dataUri: (name, file) => {
        const parser = new DatauriParser()
        return parser.format(name.slice(-4), file).content
    },
    parseProducts: (products, images, colors = [], sizes = [], keywords = []) => {
        const result = []
        products.forEach(product => {
            const tempImages = images.filter(image => image.product_id === product.id)
            const tempColors = colors.filter(color => color.product_id === product.id)
            const tempSizes = sizes.filter(size => size.product_id === product.id)
            const tempKeywords = keywords.filter(keyword => keyword.product_id === product.id)
            result.push({...product, images: tempImages, colors: tempColors, sizes: tempSizes, keywords: tempKeywords})
        })
        return result
    },
    addToCart: (cart, product) => {
        if (containsCartProducts(cart, product.id)) {
            cart.map(item => {
                if (item.id === product.id)
                    if (item.size === product.size) {
                        item.price += product.price
                        item.quantity += product.quantity
                        return item
                    }
                return item
            })
        } else cart.push(product)
        return cart
    },
    deleteFromCart: (products, id) => products.filter(product => product.id !== id),
    calculateCartPrice: products => {
        let price = 0
        if (!products) return {price: 0, shipping: 0}
        products.forEach(product => {
            price += product.quantity * product.price
        })
        return {price: price, shipping: price >= 100 ? 0 : 5 + products.length}
    },
}

module.exports = util