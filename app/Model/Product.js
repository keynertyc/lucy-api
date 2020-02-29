'use strict'

const Lucid = use('Lucid')

class Product extends Lucid {

  static get table () {
    return 'products'
  }

}

module.exports = Product
