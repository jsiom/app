var dispatchEvents = require('event-dispatcher')
var domready = require('domready')
var Emitter = require('emitter')
var assert = require('assert')
var update = require('update')
var create = require('create')
var Cursor = require('cursor')
var Atom = require('cell')

/**
 * Initialize a jsiom app and insert it into the DOM
 * within `location`
 *
 * @param {Any} state
 * @param {Function} render
 * @param {DomElement} location
 */

function App(state, render, location) {
  this.isRendering = false
  this.redrawScheduled = false
  this.render = render
  this.atom = new Atom(state)
  this.state = new Cursor(this.atom)
  this.vdom = create(render(this.state))
  this.dom = update.createElement(this.vdom)

  // wait for document.body to be defined
  domready(function(){
    this.location = location || document.body
    this.location.appendChild(this.dom)
    dispatchEvents(this)
  }.bind(this))

  this.atom.addListener(function(){
    this.state = new Cursor(this.atom)
    this.requestRedraw()
  }.bind(this))

  this.redraw = function(){
    this.redrawScheduled = false
    this.isRendering = true

    var oldVDOM = this.vdom
    var newVDOM = this.vdom = create(this.render(this.state))
    var dom = update(oldVDOM, newVDOM, this.dom)
    if (this.dom !== dom) {
      this.location.replaceChild(dom, this.dom)
      this.dom = dom
    }

    this.isRendering = false
    this.emit('redraw')
  }.bind(this)
}

Emitter(App.prototype)

App.prototype.requestRedraw = function() {
  assert(!this.isRendering, 'redraw requested while rendering')
  if (this.redrawScheduled) return
  this.redrawScheduled = true
  requestAnimationFrame(this.redraw)
}

module.exports = App
