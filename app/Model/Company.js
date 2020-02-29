'use strict'

const Lucid = use('Lucid')

class Company extends Lucid {

  static get table () {
    return 'companies'
  }

  products () {
    return this.belongsToMany('App/Model/Product', 'companies_products', 'company_id', 'product_id')
  }

}

module.exports = Company
