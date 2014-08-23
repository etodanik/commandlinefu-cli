var blessed = require('blessed');
var _ = require('lodash');
var CommandLineFuQuery = require('./api.js');
var debounce = require('debounce');
var CommandList = require('./list.js');

// Create a screen object.
var screen = blessed.screen();
var program = blessed.program();

// Create a child box perfectly centered horizontally and vertically.
var list = new CommandList({
  parent: screen,
  top: 'center',
  left: -1,
  right: -1,
  width: '100%',
  top: 0,
  bottom: 1,
  fg: 'white',
  selectedBg: 'green',
  selectedFg: 'black',
  mouse: true,
  scrollbar: {
    bg: 'blue'
  },
  items: [
    {
      command: 'testsdf',
      summary: 'b3fa'
    },
    {
      command: 'ba123aa',
      summary: 'baaa'
    },
    {
      command: 'baappppo',
      summary: 'baaa'
    },
  ]
});

var textbox = blessed.textbox({
  parent: screen,
  left: 0,
  right: 0,
  bottom: 0,
  shrink: true,
  style: {
    bg: 'green',
    fg: 'black'
  },
  padding: {
    left: 1,
    right: 0,
    top: 0,
    bottom: 0
  }
});

// If box is focused, handle `enter` and give us some more content.
list.key('enter', function() {
  // textbox.setValue('test');
});

var searchCommand = debounce(function(){
  var query = new CommandLineFuQuery();
  query.matching(textbox.value).exec(function(err, response, body){
    if(!err && response.statusCode === 200){
      list.clearItems();
      _.each(body, function(item){
        list.add(item);
      });
      list.select(0);
      screen.render();
    }
  });
}, 350);



program.on('keypress', function(ch, key) {
  if(key.ch === '/'){
    return screen.render();
  }

  if(key.name === 'up'){
    list.up();
    return screen.render();
  }

  if(key.name === 'down'){
    list.down();
    return screen.render();
  }

  if(key.name === 'space'){
    textbox.setValue(textbox.value + ' ');
    searchCommand();
    return screen.render();
  }

  if(key.name === 'backspace'){
    if(textbox.value.length === 0) return;
    textbox.setValue(textbox.value.substring(0, textbox.value.length -1));
    searchCommand();
    return screen.render();
  }

  if(key.name.match(/[a-z]/i) && key.name.length === 1){
    textbox.setValue(textbox.value + key.name);
    searchCommand();
    return screen.render();
  }
});

// Quit on Escape, q, or Control-C.
program.key(['escape', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Focus our element.
list.focus();

// Render the screen.
screen.render();