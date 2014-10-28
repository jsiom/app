
# App

A manager for jsiom apps

## Installation

With [packin](//github.com/jkroso/packin): `packin add jsiom/app`

then in your app:

```js
var App = require('app')
```

## API

### `App(state, render, [location])`

Takes an initial `state` and a `render` function which generates a virtual DOM from this state. It will then generate a DOM node from the virtual DOM and insert it into `location`. Which can be any DOM node and if you don't provide one it will default to `window.document`

```js
var app = new App({title:'IOM'}, function(state){
  return ['h1', state.title]
})
```

### `App#requestRedraw()`

When the state of your app changes you are responsible for updating `app.state` with its new value. After doing this just call `app.requestRedraw()` and your interface will be re-rendered on the next `requestAnimationFrame` tick

### `App#on('redraw', fn::Function)`

The redraw event is fired immediatly after each render
