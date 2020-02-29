'use strict'

const Lucid = use('Lucid')
const moment = use('moment')

class LeadPayment extends Lucid {

  static get table () {
    return 'lead_payments'
  }

  static get updateTimestamp () {
    return null
  }

}

module.exports = LeadPayment
