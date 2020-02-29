'use strict'

const Company = use('App/Model/Company')

class CompanyController {

  * show (request, response) {
    const companyId = request.param('id')
    const company = yield Company.query().select('id','name','short_name').where('id', companyId).first()
    if (company) {
      return response.ok(company)
    }
    return response.notFound('ERROR')
  }

}

module.exports = CompanyController
