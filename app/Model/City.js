'use strict'

const Lucid = use('Lucid')

class City extends Lucid {

  static get table () {
    return 'cities'
  }

}

module.exports = City
