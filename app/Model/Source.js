'use strict'

const Lucid = use('Lucid')

class Source extends Lucid {

  static get table () {
    return 'sources'
  }

}

module.exports = Source
