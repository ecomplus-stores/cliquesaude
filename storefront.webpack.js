const path = require('path')
console.log(path.resolve(__dirname, 'template/js/custom-js/html/TheProduct.html'))
module.exports = () => ({
  resolve: {
    alias: {
      //'./js/ShippingLine.js': path.resolve(__dirname, 'template/js/custom-js/js/ShippingLine.js'),
      //'./html/ShippingLine.html': path.resolve(__dirname, 'template/js/custom-js/html/ShippingLine.html')
    }
  }
})
