'use strict'

const Lucid = use('Lucid')

class LogActivity extends Lucid {

  static get table () {
    return 'log_activities'
  }

  type () {
    return this.belongsTo('App/Model/LogActivityType', 'id', 'log_activity_type_id').select('id','name')
  }

  user () {
    return this.belongsTo('App/Model/Account', 'id', 'user_id').select('id','name','lastname1')
  }

  lead () {
    return this.belongsTo('App/Model/Lead', 'id', 'lead_id').select('id', 'name', 'lastname')
  }

  static get updateTimestamp () {
    return null
  }

}

module.exports = LogActivity
