import {
  i19add$1ToEarn,
  i19calculateShipping,
  i19freeShipping,
  i19zipCode
} from '@ecomplus/i18n'

import {
  $ecomConfig,
  i18n,
  price as getPrice,
  formatMoney
} from '@ecomplus/utils'

import { modules } from '@ecomplus/client'
import sortApps from '@ecomplus/storefront-components/src/js/helpers/sort-apps'
import CleaveInput from 'vue-cleave-component'
import ShippingLine from '@ecomplus/storefront-components/src/ShippingLine.vue'
// import Datepicker from '../node_modules/vanillajs-datepicker/js/Datepicker.js';
// import Datepicker from 'vanillajs-datepicker/Datepicker';


const localStorage = typeof window === 'object' && window.localStorage
const sessionStorage = typeof window === 'object' && window.sessionStorage
const zipStorageKey = 'shipping-to-zip'
const schedulingKey = 'scheduling-date'
const schedulingSetting = 'scheduling-setting'
const schedulingSelectedKey = 'scheduling-date-selected'

const reduceItemBody = itemOrProduct => {
  const shippedItem = {}
  ;[
    'product_id',
    'variation_id',
    'sku',
    'name',
    'quantity',
    'inventory',
    'currency_id',
    'currency_symbol',
    'price',
    'final_price',
    'dimensions',
    'weight'
  ].forEach(field => {
    if (itemOrProduct[field] !== undefined) {
      shippedItem[field] = itemOrProduct[field]
    }
  })
  return shippedItem
}

export default {
  name: 'ShippingCalculator',

  components: {
    CleaveInput,
    ShippingLine
  },

  props: {
    zipCode: String,
    canSelectServices: Boolean,
    canInputZip: {
      type: Boolean,
      default: true
    },
    countryCode: {
      type: String,
      default: $ecomConfig.get('country_code')
    },
    shippedItems: {
      type: Array,
      default () {
        return []
      }
    },
    shippingResult: {
      type: Array,
      default () {
        return []
      }
    },
    shippingData: {
      type: Object,
      default () {
        return {}
      }
    },
    shippingAppsSort: {
      type: Array,
      default () {
        return window.ecomShippingApps || []
      }
    }
  },

  data () {
    return {
      localZipCode: null,
      localDataSchedule: null,
      localShippedItems: [],
      amountSubtotal: null,
      shippingServices: [],
      selectedService: null,
      hasPaidOption: false,
      freeFromValue: null,
      isScheduled: false,
      retryTimer: null,
      isWaiting: false,
      hasCalculated: false,
      apx_scheduling:null,
      apx_savedSchedulingDate:null,
      apx_scheduleSelected:null,
      apx_agenda:null,
      apx_loopEnd:false,
      apx_loopQuantity:null,
      apx_DontSchedule:null
    }
  },

  computed: {
    i19add$1ToEarn: () => i18n(i19add$1ToEarn),
    i19calculateShipping: () => i18n(i19calculateShipping),
    i19zipCode: () => i18n(i19zipCode),
    i19freeShipping: () => i18n(i19freeShipping).toLowerCase(),

    // listeners() {
    //   return {
    //     ...this.$scheduling
    //   }
    // },

   
    cleaveOptions () {
      return this.countryCode === 'BR'
        ? { blocks: [5, 3], delimiter: '-' }
        : { blocks: [30] }
    },

    freeFromPercentage () {
      return this.hasPaidOption && this.amountSubtotal < this.freeFromValue
        ? Math.round(this.amountSubtotal * 100 / this.freeFromValue)
        : null
    },

    productionDeadline () {
      let maxDeadline = 0
      this.shippedItems.forEach(item => {
        if (item.quantity && item.production_time) {
          const { days, cumulative } = item.production_time
          const itemDeadline = cumulative ? days * item.quantity : days
          if (itemDeadline > maxDeadline) {
            maxDeadline = itemDeadline
          }
        }
      })
      return maxDeadline
    }
  },

  directives: {
    forCallback(el, binding) {
      //const {shippingServices} = this
      let element = binding.value
      var key = element.key
      var len = 0
      if (Array.isArray(element.array)) {
        len = element.array.length
      }

      else if (typeof element.array === 'object') {
        var keys = Object.keys(element.array)
        key = keys.indexOf(key)
        len = keys.length
      }
      
      if (key == len - 1) {
        if (typeof element.callback === 'function') {
          
          
          element.callback()
        }
      }
    }
  },

  methods: {
    formatMoney,

    callback() {
        if(this.apx_loopQuantity > 0){
          const {shippingServices} = this
          
          const {apx_agenda} = this
          let no_schedule = apx_agenda.filter(el => el.field == "no_schedule").length > 0 ? apx_agenda.filter(el => el.field == "no_schedule")[0].value : false
          
          setTimeout(() => {
            let unify = []
            $('.scheduled_cliquesaude > div').each(function(){
              let attr_class = $(this).attr('class')
              if(!unify.includes(attr_class)){
                unify.push(attr_class)
              }
            });
            

            $('.scheduled_cliquesaude > div').each(function(){
              let attr_class = $(this).attr('class')
              if(!unify.includes(attr_class)){
                unify.push(attr_class)
              }
            });
            let unidades = [];
            let select = $('<select class="form-control"></select>');
            if($('.unidade-entrega').length == 0){
              $.each(unify, function(k,v){
                $('.' + v).closest('a').wrapAll('<div class="unidade-entrega" style="display:none"></div>')
                let name = $('.' + v).first().attr('unidade');
                if(!unidades.includes(name)){
                  unidades.push(name);
                  select.append('<option value="_'+ v +'">'+ name +'</option>');
                }
                $('<strong class="unidade-entrega-titulo _'+ v +'" style="display:none">'+ name +'</strong>').insertBefore($('.' + v).first().closest('.unidade-entrega'))
                
                //if(k == unify.length -1)
                //$('.shipping-calculator__services [schedule="yes"]').css('visibility','visible!important')   
              })
              let selector = $('<div id="apx_selector" class="mb-4"><label>Selecione a unidade:</label></div>').append(select);
              selector.prependTo('[schedule="yes"]');
              $('.' + $('#apx_selector select').val()).show()
              $('.' + $('#apx_selector select').val()).next('.unidade-entrega').show()

              $('#apx_selector select').change(function(){
                $('.unidade-entrega, .unidade-entrega-titulo').hide();
                $('.' + $(this).val()).show()
                $('.' + $(this).val()).next('.unidade-entrega').show()
              })
              //alert()
              this.apx_loopQuantity = 0        
            }

            
          }, 500);
        }

        // setTimeout(() => {
        //   if($('.unidade-entrega').length == 0){
        //     $.each(unify, function(k,v){
        //       $('.' + v).closest('a').wrapAll('<div class="unidade-entrega"></div>')
        //     })
        //     //$('.scheduled_cliquesaude .10').closest('a').wrapAll('<div class="unidade-entrega"></div>')
        //     //$('.scheduled_cliquesaude .20').closest('a').wrapAll('<div class="unidade-entrega"></div>')
        //     //$('.scheduled_cliquesaude .30').closest('a').wrapAll('<div class="unidade-entrega"></div>')
            
        //     $('.unidade-entrega').each(function(){
        //       let name = $(this).find('.scheduled_cliquesaude').first().next('small').text()
        //       $('<strong class="unidade-entrega-titulo">'+ name +'</strong>').insertBefore($(this))
        //     })
        //   }
        // }, 1500);
      
    },
    
    updateDataSchedule (value) {
      
      //if (storedDate) {
      this.apx_scheduling = value
      
      let minDatePicker = new Date();
      minDatePicker.setDate(minDatePicker.getDate() + 1);        
      minDatePicker.setHours(0,0,0,0)

      let toDate = new Date(new Date(value))
      if(toDate < minDatePicker){
        this.apx_scheduling = minDatePicker.toISOString().split('T')[0]
        
      }      
    

      
      if (sessionStorage) {
        sessionStorage.setItem(schedulingKey, this.apx_scheduling)
      }
      this.fetchShippingServices(true)
    },

    updateDataScheduleSetting (value) {
      if (sessionStorage) {
        if($(value).is(':checked')){
          $(value).closest('#apx-datepicker').find('label:first-child, div').hide()
        }else{
          $(value).closest('#apx-datepicker').find('label:first-child, div').show()
        }
        this.apx_DontSchedule = $(value).is(':checked')
        sessionStorage.setItem(schedulingSetting, this.apx_DontSchedule)
        
      }
      this.fetchShippingServices(true)
    },
    

    updateZipCode () {
      this.$emit('update:zip-code', this.localZipCode)
    },

    parseShippingOptions_schedule (shippingResult = [], isRetry = false) {
      
      const {apx_scheduling} = this
      const {apx_scheduleSelected} = this
      
      let selected_schedule = 0;
      //if(apx_scheduling != null){
        axios.post('https://us-central1-cliquesaude-ecomplus.cloudfunctions.net/app/get/agenda', {
          storeId : storefront.settings.store_id,
          scheduleDate : apx_scheduling
        })
        .then((response) => {
          this.apx_agenda = response.data       
          
          let scheduleList = this.apx_agenda.filter(el => el.field == "scheduleList").length > 0 ? this.apx_agenda.filter(el => el.field == "scheduleList")[0].value : false
          let holidays = this.apx_agenda.filter(el => el.field == "holidays").length > 0 ? this.apx_agenda.filter(el => el.field == "holidays")[0].value : false
          let closed_dates = this.apx_agenda.filter(el => el.field == "closed_dates").length > 0 ? this.apx_agenda.filter(el => el.field == "closed_dates")[0].value : false
          let no_schedule = this.apx_agenda.filter(el => el.field == "no_schedule").length > 0 ? this.apx_agenda.filter(el => el.field == "no_schedule")[0].value : false

          
          
          
          
          
          
              
          let scheduleDate = apx_scheduling
          
          const currentDayFormat = new Date(apx_scheduling)
          
          let currentDay = currentDayFormat.getDay()
          
          const schedulingShippingServices = [] 
          
          let counter = 0
          

          //if(apx_scheduling != null){
            let scheduling_app = shippingResult.filter(el => el.app_id == 131722)[0];    
            for(let i = 0; i < scheduling_app.response.shipping_services.length; i++){

              let unidade = scheduling_app.response.shipping_services[i]
              
              for(let x = 0; x < unidade.shipping_line.custom_fields.length; x++){                        
                let day_config = JSON.parse(unidade.shipping_line.custom_fields[x].value)
                
                if(parseInt(day_config.week_day) == parseInt(currentDay)){
                  
                  
                  let schedule_compare = scheduleDate.split('-')[2] + '/' + scheduleDate.split('-')[1] + '/' + scheduleDate.split('-')[0]
                  

                  let available = true

                  
                  
                  
                  if(closed_dates != false){
                    if(closed_dates.includes(schedule_compare)){
                      available = false
                    }
                  }
                  if(holidays != false){
                    if(holidays.includes(schedule_compare)){
                      
                      day_config = unidade.shipping_line.custom_fields.filter(el => el.value.includes('"week_day":7')).length > 0 ? JSON.parse(unidade.shipping_line.custom_fields.filter(el => el.value.includes('week_day":7'))[0].value) : JSON.parse(unidade.shipping_line.custom_fields[x].value)
                      
                    }
                  }
                  
                  let {open_at, close_at, interval} = day_config
                  
                  let time1 = open_at.split(':');
                  let time2 = close_at.split(':');
                  let hour, minute, vagas;

                  hour = (parseInt(time2[0])-parseInt(time1[0])) * 60;
                  minute = parseInt(time1[1])+parseInt(time2[1]);
                  vagas = (hour + minute) / interval               

                  let current_hour = parseInt(open_at.split(':')[0])
                  let current_minute = parseInt(open_at.split(':')[1])
                  
                  
                  if(available){
                    for (let ordem = 1; ordem <= vagas; ordem++) {
                      let schedule_active = true
                      current_minute = current_minute.toString().length == 1 ? current_minute.toString() + '0' : current_minute  
                      let scheduled_date_time = scheduleDate + ' ' + current_hour + ':' + current_minute
                      
                      if(apx_scheduleSelected  == unidade.service_code + '|ScheduleDate:' + scheduled_date_time){
                        selected_schedule = counter
                      }
                      
                      if(scheduleList){
                        let scheduleAvailable = scheduleList.filter(el => el.time.toString() == (current_hour + ':' + current_minute).toString() && el.service_code.toString() == unidade.service_code.toString()).length > 0 ? false : true
                        if(scheduleAvailable == false){
                          schedule_active = false
                        }                    
                      }
                      
                      if(schedule_active == true){
                        schedulingShippingServices.push({
                          ...unidade,
                          service_code : unidade.service_code + '|ScheduleDate:' + scheduled_date_time,
                          shipping_line :{
                            ...unidade.shipping_line,
                            scheduled_delivery:{
                              end : scheduled_date_time
                            }
                          }                  
                        })
                      }

                      current_minute = parseInt(current_minute)
                      current_minute += interval
                          
                      if(current_minute >= 60){
                          let h = (current_minute / 60) << 0
                          current_hour +=  h
                          current_minute -= 60 * h
                      }
                      counter++
                    }
                  }
                }              
              }          
            }

            for(let i = 0; i < shippingResult.length; i++){
              if(shippingResult[i].app_id == 131722){
                shippingResult[i].response.shipping_services = schedulingShippingServices
              }
            }

            this.apx_loopQuantity = counter
            

            this.freeFromValue = null
            this.shippingServices = []
            if (shippingResult.length) {
              shippingResult.forEach(appResult => {
                const { validated, error, response } = appResult
                if (validated && !error) {
                  response.shipping_services.forEach(service => {
                    this.shippingServices.push({
                      app_id: appResult.app_id,
                      ...service
                    })
                  })
                  const freeShippingFromValue = response.free_shipping_from_value
                  if (
                    freeShippingFromValue &&
                    (!this.freeFromValue || this.freeFromValue > freeShippingFromValue)
                  ) {
                    this.freeFromValue = freeShippingFromValue
                  }
                }
              })
              if (!this.shippingServices.length) {
                if (!isRetry) {
                  this.fetchShippingServices(true)
                } else {
                  this.scheduleRetry()
                }
              } else {
                this.shippingServices = this.shippingServices.sort((a, b) => {
                  const priceDiff = a.shipping_line.total_price - b.shipping_line.total_price
                  return priceDiff < 0
                    ? -1
                    : priceDiff > 0
                      ? 1
                      : a.shipping_line.delivery_time && b.shipping_line.delivery_time &&
                        a.shipping_line.delivery_time.days < b.shipping_line.delivery_time.days
                        ? -1
                        : 1
                })
                this.setSelectedService(selected_schedule)
                this.hasPaidOption = Boolean(this.shippingServices.find(service => {
                  return service.shipping_line.total_price || service.shipping_line.price
                }))
                if (Array.isArray(this.shippingAppsSort) && this.shippingAppsSort.length) {
                  this.shippingServices = sortApps(this.shippingServices, this.shippingAppsSort)
                }
              }
            }
            
          //}
        }) 
      //}

      
    },

    parseShippingOptions (shippingResult = [], isRetry = false) {
      // let count = 0
      // $.each(shippingResult,function(k_,app_){
      
      //   $.each(app_.response.shipping_services,function(k__,shipping_service){
      
      //     count = count + shipping_service.shipping_line.length
      //   })
      // })
      
      
      
      const {apx_scheduling} = this
      
      if(apx_scheduling != null && this.apx_DontSchedule == false){
        
        return this.parseShippingOptions_schedule(shippingResult, isRetry)
      }else{
        this.freeFromValue = null
        this.shippingServices = []
        if (shippingResult.length) {
          shippingResult.forEach(appResult => {
            const { validated, error, response } = appResult
            if (validated && !error) {
              response.shipping_services.forEach(service => {
                this.shippingServices.push({
                  app_id: appResult.app_id,
                  ...service
                })
              })
              const freeShippingFromValue = response.free_shipping_from_value
              if (
                freeShippingFromValue &&
                (!this.freeFromValue || this.freeFromValue > freeShippingFromValue)
              ) {
                this.freeFromValue = freeShippingFromValue
              }
            }
          })
          if (!this.shippingServices.length) {
            if (!isRetry) {
              this.fetchShippingServices(true)
            } else {
              this.scheduleRetry()
            }
          } else {
            this.shippingServices = this.shippingServices.sort((a, b) => {
              const priceDiff = a.shipping_line.total_price - b.shipping_line.total_price
              return priceDiff < 0
                ? -1
                : priceDiff > 0
                  ? 1
                  : a.shipping_line.delivery_time && b.shipping_line.delivery_time &&
                    a.shipping_line.delivery_time.days < b.shipping_line.delivery_time.days
                    ? -1
                    : 1
            })
            this.setSelectedService(0)
            this.hasPaidOption = Boolean(this.shippingServices.find(service => {
              return service.shipping_line.total_price || service.shipping_line.price
            }))
            if (Array.isArray(this.shippingAppsSort) && this.shippingAppsSort.length) {
              this.shippingServices = sortApps(this.shippingServices, this.shippingAppsSort)
            }
          }
        }
      }
    },

    scheduleRetry (timeout = 10000) {
      clearTimeout(this.retryTimer)
      this.retryTimer = setTimeout(() => {
        if (this.localZipCode && !this.shippingServices.length && this.shippedItems.length) {
          this.fetchShippingServices(true)
        }
      }, timeout)
    },

    
    
    fetchShippingServices (isRetry) {
      
      //$('.shipping-calculator__services .list-group').empty()
      const {apx_scheduling, apx_DontSchedule} = this
      if (!this.isScheduled) {
        this.isScheduled = true
        setTimeout(() => {
          this.isScheduled = false
          const { storeId } = this
          const url = '/calculate_shipping.json'
          const method = 'POST'
          const data = {
            ...this.shippingData,
            to: {
              zip: this.localZipCode,
              ...this.shippingData.to
            }
          }
          if(apx_scheduling && !apx_DontSchedule){
            if(data.service_code != null){
              data.service_code = data.service_code + "|ScheduleDate:" + apx_scheduling
            }else{
              data.service_code = "ScheduleDate:" + apx_scheduling
            }            
          }
          if (this.localShippedItems.length) {
            data.items = this.localShippedItems
            data.subtotal = this.amountSubtotal
          }
          this.isWaiting = true
          modules({ url, method, storeId, data })
            //.then(({ data }) => this.parseShippingOptionsFirst(data.result, isRetry))
            .then(({ data }) => this.parseShippingOptions(data.result, isRetry))
            .catch(err => {
              if (!isRetry) {
                this.scheduleRetry(4000)
              }
              console.error(err)
            })
            .finally(() => {
              this.hasCalculated = true
              this.isWaiting = false
            })
        }, this.hasCalculated ? 150 : 50)
      }
    },

    submitZipCode () {
      this.updateZipCode()
      if (localStorage) {
        localStorage.setItem(zipStorageKey, this.localZipCode)
      }
      this.fetchShippingServices()
    },

    setSelectedService (i) {
      if (this.canSelectServices) {
        this.$emit('select-service', this.shippingServices[i])
        
        sessionStorage.setItem(schedulingSelectedKey, this.shippingServices[i].service_code)
        this.apx_scheduleSelected = this.shippingServices[i].service_code
        this.selectedService = i

      }
    }
  },

  watch: {
    shippedItems: {
      handler () {
        setTimeout(() => {
          this.localShippedItems = this.shippedItems.map(reduceItemBody)
          const { amountSubtotal } = this
          this.amountSubtotal = this.shippedItems.reduce((subtotal, item) => {
            return subtotal + getPrice(item) * item.quantity
          }, 0)
          if (
            this.hasCalculated &&
            (this.canSelectServices || amountSubtotal !== this.amountSubtotal ||
              (!this.shippingServices.length && !this.isWaiting))
          ) {
            this.fetchShippingServices()
          }
        }, 50)
      },
      deep: true,
      immediate: true
    },

    localZipCode (zipCode) {
      if (this.countryCode === 'BR' && zipCode.replace(/\D/g, '').length === 8) {
        this.submitZipCode()
      }
    },

    zipCode: {
      handler (zipCode) {
        if (zipCode) {
          this.localZipCode = zipCode
        }
      },
      immediate: true
    },

    shippingResult: {
      handler (result) {
        if (result.length) {
          this.parseShippingOptions(result)
        }
      },
      immediate: true
    }
  },
  mounted(){
    let minDatePicker = new Date();
    minDatePicker.setDate(minDatePicker.getDate() + 1);

    if(this.apx_DontSchedule){
      $('label.nda').closest('#apx-datepicker').find('label:first-child, div').hide()
    }else{
      $('label.nda').closest('#apx-datepicker').find('label:first-child, div').show()
    }
  },
  created () {   
     
    if (!this.zipCode && localStorage) {
      const storedZip = localStorage.getItem(zipStorageKey)
      if (storedZip) {
        this.localZipCode = storedZip
      }
    }

    if (!this.apx_scheduling && sessionStorage) {
      const storedDate = sessionStorage.getItem(schedulingKey)
      if (storedDate) {
        let minDatePicker = new Date();
        minDatePicker.setDate(minDatePicker.getDate() + 1);        
        minDatePicker.setHours(0,0,0,0)
        let toDate = new Date(storedDate)
        toDate.setHours(0,0,0,0)
        toDate.setDate(toDate.getDate() + 1);  
        if(toDate >= minDatePicker){
          this.apx_scheduling = storedDate
          
        }        
      }
    }

    if (!this.apx_scheduleSelected && sessionStorage) {
      const storedSchedule = sessionStorage.getItem(schedulingSelectedKey)
      if (storedSchedule) {
          this.apx_scheduleSelected = storedSchedule              
      }
    }    
    if (!this.apx_DontSchedule && sessionStorage) {
      const DontSchedule = sessionStorage.getItem(schedulingSetting)
      //if (DontSchedule) {
        this.apx_DontSchedule = DontSchedule  == "false"  ? false : true
      //}
    }    
    
  }
}
