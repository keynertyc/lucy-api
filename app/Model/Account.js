'use strict'

const Lucid = use('Lucid')

class Account extends Lucid {

  static get table () {
    return 'users'
  }

}

module.exports = Account
