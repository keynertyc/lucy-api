'use strict'

const Lucid = use('Lucid')

class Disposition extends Lucid {

  static get table () {
    return  'dispositions'
  }

}

module.exports = Disposition
