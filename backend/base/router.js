
const {Router} = require('express')
const {wrapAsync} = require('../lib/helpers')

module.exports = class {
  constructor (router = Router()) {
    this.router = router
    this.configure()
    this.firstmiddleware()
    this.premiddleware()
    this.routes()
    this.postmiddleware()
    this.lastmiddleware()
  }

  static get mountPoint () {
    return ''
  }

  getRouter () {
    return this.router
  }

  static wrap (fn) {
    return wrapAsync(fn)
  }

  configure () {}

  firstmiddleware () {}

  premiddleware () {}

  routes () {}

  postmiddleware () {}

  lastmiddleware () {}

  mount (Router) {
    const router = new Router()
    this.router.use(Router.mountPoint, router.router)
  }
}