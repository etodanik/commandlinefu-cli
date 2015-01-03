var blessed = require('blessed');
var Box = blessed.widget.box;

var lastIndex = 0;
var viewPortTop = 0;
var viewPortBottom = 0;

var CommandList = function(){
	blessed.widget.list.apply(this,arguments);
    viewPortBottom = this.screen.height - 3;
    viewPortTop = 0;
};

CommandList.prototype = blessed.widget.list.prototype;

CommandList.prototype.select = function(index) {
  var viewPortOffset = 0;
  if (!this.items.length) {
    this.selected = 0;
    this.value = '';
    this.scrollTo(0);
    return;
  }

  if (typeof index === 'object') {
    index = this.items.indexOf(index);
  }

  if (index < 0) index = 0;
  else if (index >= this.items.length) index = this.items.length - 1;

  if (this.selected === index && this._listInitialized) return;
  this._listInitialized = true;

  this.selected = index;
  this.value = this.ritems[this.selected];

  if (index * 3 > viewPortBottom && index > lastIndex) {
    viewPortOffset += 3;
  } else if (index * 3 < viewPortTop){
    viewPortOffset -= 3;
    if (this.childBase <= 0) {
      viewPortOffset = 0;
    }
  }
  viewPortBottom += viewPortOffset;
  viewPortTop += viewPortOffset;
  this.childBase += viewPortOffset;
  lastIndex = index;

  this.screen.clearRegion(0, this.cols, 0, this.rows);
  this.screen.render();
};

CommandList.prototype.add =
CommandList.prototype.addItem =
CommandList.prototype.appendItem = function(item) {
  var self = this;

  this.ritems.push(item.summary + ' ' + item.command);

  // Note: Could potentially use Button here.
  var options = {
    screen: this.screen,
    content: '{bold}' + item.command + '{/bold}' + '\n' + '{#777777-fg}' + item.summary + '{/#777777-fg}',
    border: {
        type: 'line',
        fg: '#222222'
    },
    align: this.align || 'left',
    top: this.itop + this.items.length * 3,
    left: this.ileft + 1,
    right: this.iright + 1,
    padding: {
    	left: 1,
    	right: 1,
    	top: 0,
    	bottom: 0
    },
    tags: this.parseTags,
    height: 4,
    hoverEffects: this.mouse ? this.style.item.hover : null,
    focusEffects: this.mouse ? this.style.item.focus : null,
    autoFocus: false,
    tags: true
  };

  if (this.screen.autoPadding) {
    options.top = this.items.length;
    options.left = 1;
    options.right = 1;
  }

  ['bg', 'fg', 'bold', 'underline',
   'blink', 'inverse', 'invisible'].forEach(function(name) {
    options[name] = function() {
      var attr = self.items[self.selected] === item
        ? self.style.selected[name]
        : self.style.item[name];
      if (typeof attr === 'function') attr = attr(item);
      return attr;
    };
  });

  /* if(self.items[self.selected] && self.items[self.selected].summary != item.summary){
    if(self.items.length + 1 % 2 === 0){
  		options.bg = '#333333';
    }
  } */

  var item = new Box(options);

  this.items.push(item);
  this.append(item);

  if (this.items.length === 1) {
    this.select(0);
  }

  if (this.mouse) {
    item.on('click', function(data) {
      if (self.items[self.selected] === item) {
        self.emit('action', item, self.selected);
        self.emit('select', item, self.selected);
        return;
      }
      self.select(item);
      self.screen.render();
    });
  }
};

module.exports = CommandList;
