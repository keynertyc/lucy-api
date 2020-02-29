'use strict'

const Lucid = use('Lucid')
const moment = use('moment')

class LeadFsl extends Lucid {

  static get table () {
    return 'lead_fsl'
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

module.exports = LeadFsl
