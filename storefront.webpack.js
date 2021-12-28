const path = require('path')
console.log(path.resolve(__dirname, 'template/js/custom-js/html/TheProduct.html'))
module.exports = () => ({
  resolve: {
    alias: {
      //'./js/ShippingLine.js': path.resolve(__dirname, 'template/js/custom-js/js/ShippingLine.js'),
      // './html/ShippingLine.html': path.resolve(__dirname, 'template/js/custom-js/html/ShippingLine.html'),
      './html/InstantSearch.html': path.resolve(__dirname, 'template/js/custom-js/html/InstantSearch.html'),
      './html/EcCheckout.html': path.resolve(__dirname, 'template/js/custom-js/alpix/EcCheckout.html'),
      './html/ShippingLine.html': path.resolve(__dirname, 'template/js/custom-js/alpix/ShippingLine.html'),
      './js/ShippingLine.js': path.resolve(__dirname, 'template/js/custom-js/alpix/ShippingLine.js'),
      './html/ShippingCalculator.html': path.resolve(__dirname, 'template/js/custom-js/alpix/ShippingCalculator.html'),
      './js/ShippingCalculator.js': path.resolve(__dirname, 'template/js/custom-js/alpix/ShippingCalculator.js')
    }
  }
})
