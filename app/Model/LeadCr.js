'use strict'

const Lucid = use('Lucid')

class LeadCr extends Lucid {

  static get table () {
    return 'lead_cr'
  }

  lead () {
    return this.belongsTo('App/Model/Lead', 'id', 'id');
  }

  agent () {
    return this.belongsTo('App/Model/Account', 'id', 'agent_id').select('id','email','name','lastname1')
  }

  disposition () {
    return this.belongsTo('App/Model/Disposition').select('id','name')
  }

}

module.exports = LeadCr
