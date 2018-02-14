
const {join} = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const expressSession = require('express-session')
const passport = require('passport')
const morgan = require('morgan')
const fallback = require('express-history-api-fallback')

const Middleware = require('../base/middleware')
const Response = require('../base/response')
const errors = require('./errors')
const config = require('../config/')

const root = join(__dirname, '..', 'public')

module.exports = class extends Middleware {
  get config () {
    return config
  }

  firstmiddleware () {}

  premiddleware () {
    this.router.use(methodOverride('_method'))
    this.router.use(bodyParser.urlencoded({extended: false}))
    this.router.use(bodyParser.json())
    this.router.use(cookieParser())
    this.router.use(expressSession(config.expressSession))
    this.router.use(passport.initialize())
    this.router.use(passport.session())
    super.use('morgan', morgan('dev'))
    this.router.use(express.static(root))
  }

  postmiddleware () {
    this.router.use(fallback('index.html', { root }))
  }

  lastmiddleware () {
    this.router.use(errors(Response))
  }
}
