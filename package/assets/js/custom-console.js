
var CustomConsole = (function(win){

  "use strict"

  var _stack = [];

  function CustomConsole() { }

  CustomConsole.prototype = {

    debug: function(msg)
    {
      if(!CONF.ENABLE_CONSOLE){return;}
      win.console && win.console.log(msg);
      this.add(msg,"log");
      return this;
    },

    warn: function(msg)
    {
      if(!CONF.ENABLE_CONSOLE){return;}
      win.console && win.console.warn(msg);
      this.add(msg,"warn");
      return this;
    },

    info: function(msg)
    {
      if(!CONF.ENABLE_CONSOLE){return;}
      win.console && win.console.info(msg);
      this.add(msg,"info");
      return this;
    },

    error: function(msg)
    {
      if(!CONF.ENABLE_CONSOLE){return;}
      win.console && win.console.error(msg);
      this.add(msg,"error");
      return this;
    },

    add: function(msg,type)
    {
      _stack.push({msg:msg,type:type});
    },

    dump: function()
    {
      for (var i = 0; i < _stack.length; i++)
      {
        win.console && win.console[_stack[i].type](_stack[i].msg);
      }
      return win.console && win.console.log("Dumped "+_stack.length+" items");
    },

    flush: function()
    {
      var len = _stack.length;
      _stack = [];
      return win.console && win.console.log("Flushed "+len+" items");
    },

    toString: function()
    {
      return "CustomConsole Instance";
    }
  };

  return CustomConsole;

})(window);
