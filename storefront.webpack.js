const path = require('path')
module.exports = () => ({
  resolve: {
    alias: {
      './html/InstantSearch.html': path.resolve(__dirname, 'template/js/custom-js/html/InstantSearch.html'),
      './html/AccountForm.html': path.resolve(__dirname, 'template/js/custom-js/alpix/AccountForm.html'),
      './html/EcCheckout.html': path.resolve(__dirname, 'template/js/custom-js/alpix/EcCheckout.html'),
      './html/ShippingLine.html': path.resolve(__dirname, 'template/js/custom-js/alpix/ShippingLine.html'),
      './js/ShippingLine.js': path.resolve(__dirname, 'template/js/custom-js/alpix/ShippingLine.js'),
      './html/ShippingCalculator.html': path.resolve(__dirname, 'template/js/custom-js/alpix/ShippingCalculator.html'),
      './js/ShippingCalculator.js': path.resolve(__dirname, 'template/js/custom-js/alpix/ShippingCalculator.js')
    }
  }
})

//'./js/ShippingLine.js': path.resolve(__dirname, 'template/js/custom-js/js/ShippingLine.js'),
// './html/ShippingLine.html': path.resolve(__dirname, 'template/js/custom-js/html/ShippingLine.html'),
