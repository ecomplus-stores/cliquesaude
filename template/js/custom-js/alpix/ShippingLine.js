import {
  i19days,
  i19free,
  i19freeShipping,
  // i19pickUpToday,
  i19receiveToday,
  i19untilTomorrow,
  i19upTo,
  i19workingDays
} from '@ecomplus/i18n'

import {
  i18n,
  formatMoney
} from '@ecomplus/utils'

const i19pickUpToday = 'Retire hoje'

export default {
  name: 'ShippingLine',

  props: {
    shippingLine: {
      type: Object,
      required: true
    },
    serviceCode: {
      type: Object,
      required: true
    },
    productionDeadline: {
      type: Number,
      default: 0
    }
  },

  computed: {
    deadlineStr () {
      const shipping = this.shippingLine
      const isWorkingDays = (shipping.posting_deadline && shipping.posting_deadline.working_days) ||
        (shipping.delivery_time && shipping.delivery_time.working_days)
      let days = shipping.posting_deadline ? shipping.posting_deadline.days : 0
      if (shipping.delivery_time) {
        days += shipping.delivery_time.days
      }
      days += this.productionDeadline
      if (days > 1) {
        return `${i18n(i19upTo)} ${days} ` +
          i18n(isWorkingDays ? i19workingDays : i19days).toLowerCase()
      }
      return i18n(days === 1
        ? i19untilTomorrow
        : shipping.pick_up ? i19pickUpToday : i19receiveToday)
    },

    freightValueStr () {
      const { shippingLine } = this
      const freight = typeof shippingLine.total_price === 'number'
        ? shippingLine.total_price
        : shippingLine.price
      if (freight) {
        return formatMoney(freight)
      } else {
        return i18n(shippingLine.pick_up ? i19free : i19freeShipping)
      }
    }
  },

  methods:{
    // callback() {
    //   //console.log('iha')
    //   if($('.unidade-entrega').length == 0){
    //     setTimeout(() => {
    //       $('.scheduled_cliquesaude .10').closest('a').wrapAll('<div class="unidade-entrega"></div>')
    //       $('.scheduled_cliquesaude .20').closest('a').wrapAll('<div class="unidade-entrega"></div>')
          
    //       $('.unidade-entrega').each(function(){
    //         let name = $(this).find('.scheduled_cliquesaude').first().next('small').text()
    //         $('<strong class="unidade-entrega-titulo">'+ name +'</strong>').insertBefore($(this))
    //       })
    //     }, 100);
    //   }
      
      //let inputs = document.getElementsByClassName('scheduled_cliquesaude')
      
      //console.log(inputs)
      //console.log(inputs.length)

      // for(let item of document.getElementsByClassName('scheduled_cliquesaude')){
      //   console.log(item)
      // }

      
      // for(let i=0; i< inputs.length; i++){
      //   console.log(inputs[i])
      // }
      // inputs.forEach(function(el, index, array){
      //   console.log(el)
      // });

      // $.each('.scheduled_cliquesaude', function(k,v){
      //   let nome = $(v).find('small').text();
      //   let id = $(v).find('div:first-child').attr('class');
      //   unidades.push({label: nome, id: id});
      // });

      //console.log(unidades)
    // },
  },

  // directives: {
  //   forCallback(el, binding) {
  //     //console.log(binding)
  //     let element = binding.value
  //     var key = element.key
  //     var len = 0
  //     if (Array.isArray(element.array)) {
  //       len = element.array.length
  //     }

  //     else if (typeof element.array === 'object') {
  //       var keys = Object.keys(element.array)
  //       key = keys.indexOf(key)
  //       len = keys.length
  //     }
      
  //     if (key == len - 1) {
  //       if (typeof element.callback === 'function') {
  //         element.callback()
  //       }
  //     }
  //   }
  // },

  
}