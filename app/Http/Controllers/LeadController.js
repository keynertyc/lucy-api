'use strict'

const moment = use('moment')

const Database = use('Database')
const Lead = use('App/Model/Lead')
const LeadFsl = use('App/Model/LeadFsl')
const LeadPsl = use('App/Model/LeadPsl')
const LeadCr = use('App/Model/LeadCr')
const LeadRef = use('App/Model/LeadRef')
const LogActivity = use('App/Model/LogActivity')
const Company = use('App/Model/Company')
const Product = use('App/Model/Product')
const LeadPayment = use('App/Model/LeadPayment')

class LeadController {

  * index (request, response) {
    const leads = yield Lead.with('company','source','disposition','agent','state','city','logs','logs.user','logs.type').fetch()
    return response.ok(leads)
  }

  * updateProductStatus (request, response) {
    const leadId = request.param('id')
    const model = request.input('model')
    const product = request.input('product')
    const from = request.input('from')
    const status = request.input('status')
    const external_id = request.input('external_id')

    let leadProduct
    let leadInfo
    switch (model) {
      case 'LeadFsl':
        leadProduct = yield LeadFsl.findBy('id', leadId)
        break;
      case 'LeadPsl':
        leadProduct = yield LeadPsl.findBy('id', leadId)
        break;
      case 'LeadCr':
        leadProduct = yield LeadCr.findBy('id', leadId)
        break;
      case 'LeadRef':
        leadProduct = yield LeadRef.findBy('id', leadId)
        break;
      default:
        break;
    }

    if (leadProduct && model && product && from && status) {
      leadProduct.status = status
      if (yield leadProduct.save()) {
        if (external_id) {
          leadInfo = yield Lead.findBy('id', leadId)
          leadInfo.external_id = external_id
          yield leadInfo.save()
        }

        let verifyLeadPayment
        verifyLeadPayment = yield LeadPayment.query().where('lead_id', leadId).andWhere('notes', status).first()
        if (!verifyLeadPayment && (status == 'Preparing Docs' || status == 'Received Docs - Complete')) {
          const newLeadPayment = {
            lead_id: leadId,
            product: product,
            amount: 100.00,
            notes: status,
            status: 1
          }
          yield LeadPayment.create(newLeadPayment)
        }

        const newLogActivity = {
          body: product + ': new status = ' + status + ', from: ' + from,
          lead_id: leadId,
          log_activity_type_id: 1
        }
        yield LogActivity.create(newLogActivity)
        return response.ok('OK')
      }
    }
    return response.notFound('ERROR')
  }

  * sentToProcess (request, response) {
    let companyId, dateFrom, dateTo, company

    if (request.input('company_id') && request.input('date_from') && request.input('date_to')) {
      companyId = request.input('company_id')
      dateFrom = request.input('date_from')
      dateTo = request.input('date_to')
    } else {
      companyId = request.param('company')
      dateFrom = moment().startOf('week').add(1,'day').format('YYYY-MM-DD')
      dateTo = moment().endOf('week').add(1,'day').format('YYYY-MM-DD')
    }

    company = yield Company.query().with('products').where('id', companyId).first()
    if (company) {
      company = company.toJSON()
    } else if (!company && companyId != 'all') {
      return response.notFound('ERROR')
    }

    if (companyId == 'all') {
      const products = yield Product.all()
      company = new Object()
      company.products = products.toJSON()
    }

    let dataFinal = []
    let i = 0
    for (let j=0; j<company.products.length && company; j++) {
      const model = company.products[j].table
      let productData
      if (companyId == 'all') {
        productData = yield Database.table(model).select(Database.raw('date(' + model + '.created_at) as date,count(' + model + '.id) as total')).innerJoin('leads', model + '.id', 'leads.id').whereBetween(model + '.created_at',[dateFrom +' 00:00:00',dateTo +' 23:59:59']).groupBy('date')
      } else {
        productData = yield Database.table(model).select(Database.raw('date(' + model + '.created_at) as date,count(' + model + '.id) as total')).innerJoin('leads', model + '.id', 'leads.id').where('company_id', company.id).whereBetween(model + '.created_at',[dateFrom +' 00:00:00',dateTo +' 23:59:59']).groupBy('date')
      }
      let data = []
      let k = 0
      for (let l=0; l<productData.length; l++) {
        data[k] = [parseInt(moment(productData[l].date).unix()*1000), parseInt(productData[l].total)]
        k++
      }
      dataFinal[i] = { name: company.products[j].name, data: data }
      i++
    }
    return response.ok(dataFinal)

  }

  * productsStatus (request, response) {
    const companyId = request.param('company', 'all')

    let company
    let products
    if (companyId !== 'all') {
      company = yield Company.query().with('products').where('id', companyId).first()
      if (company) {
        company = company.toJSON()
        products = company.products
      } else if (!company && companyId != 'all') {
        return response.notFound('ERROR')
      }
    } else {
      products = yield Product.all()
      products = products.toJSON()
    }

    let dataFinal = []
    let i = 0
    for (let j=0; j<products.length; j++) {
      const model = products[j].table
      let productInfo
      if (companyId !== 'all') {
        productInfo = yield Database.table(model).select(Database.raw('status, count(' + model + '.id) as total, dispositions.color, dispositions.order')).innerJoin('leads', model + '.id', 'leads.id').innerJoin('dispositions', model + '.status', 'dispositions.name').where('leads.company_id', companyId).groupBy('status').orderBy('dispositions.order', 'asc')
      } else {
        productInfo = yield Database.table(model).select(Database.raw('status, count(' + model + '.id) as total, dispositions.color, dispositions.order')).innerJoin('dispositions', model + '.status', 'dispositions.name').groupBy('status').orderBy('dispositions.order', 'asc')
      }
      dataFinal[i] = { model: products[j].model, name: products[j].name, data: productInfo }
      i++
    }

    let leadInfo
    if (companyId !== 'all') {
      leadInfo = yield Database.table('leads').select(Database.raw('count(leads.id)as total')).leftJoin('lead_fsl', 'leads.id', 'lead_fsl.id').leftJoin('lead_psl', 'leads.id', 'lead_psl.id').leftJoin('lead_cr', 'leads.id', 'lead_cr.id').leftJoin('lead_ref', 'leads.id', 'lead_ref.id').where('leads.company_id', companyId).whereNull('lead_fsl.id').whereNull('lead_psl.id').whereNull('lead_cr.id').whereNull('lead_ref.id')
    } else {
      leadInfo = yield Database.table('leads').select(Database.raw('count(leads.id)as total')).leftJoin('lead_fsl', 'leads.id', 'lead_fsl.id').leftJoin('lead_psl', 'leads.id', 'lead_psl.id').leftJoin('lead_cr', 'leads.id', 'lead_cr.id').leftJoin('lead_ref', 'leads.id', 'lead_ref.id').whereNull('lead_fsl.id').whereNull('lead_psl.id').whereNull('lead_cr.id').whereNull('lead_ref.id')
    }
    dataFinal[i] = { model: 'Lead', name: 'No Program', data: leadInfo }
    return response.ok(dataFinal)
  }

}

module.exports = LeadController

