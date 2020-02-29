'use strict'

const User = use('App/Model/User')

class UserController {

  * index(request, response) {
    //
  }

  * create(request, response) {
    //
  }

  * store(request, response) {
    //
  }

  * show(request, response) {
    //
  }

  * edit(request, response) {
    //
  }

  * update(request, response) {
    //
  }

  * destroy(request, response) {
    //
  }

  * login (request, response) {
    const user = yield User.find(6)
    if (user) {
      const token = yield request.auth.generate(user)
      if (token) {
        return response.ok({token: token.token})
      }
    }
    return response.status(401).send('unauthorized')
  }

  * profile (request, response) {
    const isLoggedIn = yield request.auth.check()
    if (isLoggedIn) {
      return response.ok(request.authUser)
    }
    return response.status(401).send('unauthorized')
  }

}

module.exports = UserController
