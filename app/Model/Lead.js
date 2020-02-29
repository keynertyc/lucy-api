'use strict'

const Lucid = use('Lucid')

class Lead extends Lucid {

  static get table () {
    return 'leads'
  }

  company () {
    return this.belongsTo('App/Model/Company').select('id','name')
  }

  source () {
    return this.belongsTo('App/Model/Source').select('id','name')
  }

  disposition () {
    return this.belongsTo('App/Model/Disposition').select('id','name')
  }

  agent () {
    return this.belongsTo('App/Model/Account', 'id', 'agent_id').select('id','email','name','lastname1')
  }

  state () {
    return this.belongsTo('App/Model/State').select('id','name')
  }

  city () {
    return this.belongsTo('App/Model/City').select('id','name')
  }

  logs () {
    return this.hasMany('App/Model/LogActivity', 'id', 'lead_id')
  }

}

module.exports = Lead

