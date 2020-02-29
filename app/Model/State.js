'use strict'

const Lucid = use('Lucid')

class State extends Lucid {

  static get table () {
    return 'states'
  }

}

module.exports = State
