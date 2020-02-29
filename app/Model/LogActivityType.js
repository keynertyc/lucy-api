'use strict'

const Lucid = use('Lucid')

class LogActivityType extends Lucid {

  static get table () {
    return 'log_activity_types'
  }

}

module.exports = LogActivityType
