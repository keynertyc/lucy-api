'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route.on('/').render('welcome')

//Route.post('login', 'UserController.login')
//Route.get('/user/profile', 'UserController.profile').middleware('auth:api')

Route.get('/leads', 'LeadController.index').middleware('auth:api')
Route.get('/companies/:id', 'CompanyController.show').middleware('auth:api')
Route.put('/leads/:id/product-status', 'LeadController.updateProductStatus').middleware('auth:api')
Route.get('/sent-to-process/:company', 'LeadController.sentToProcess')
Route.post('/sent-to-process', 'LeadController.sentToProcess')
Route.get('/leads-products-status/:company?', 'LeadController.productsStatus')
