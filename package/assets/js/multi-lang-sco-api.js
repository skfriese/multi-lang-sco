
// Globals
var CONSOLE = new CustomConsole();
var SCORM_API;

var MultiLangScoApi = (function(){

"use strict"

  /**
   * Privates
   */
  var _ready = false;
  var _initialized = false;
  var _terminated = false;
  var _findAPITries = 0;

  // SCORM error codes
  var _NoError = 0;
  var _GeneralException = 101;
  var _ServerBusy = 102;
  var _InvalidArgumentError = 201;
  var _ElementCannotHaveChildren = 202;
  var _ElementIsNotAnArray = 203;
  var _NotInitialized = 301;
  var _NotImplementedError = 401;
  var _InvalidSetValue = 402;
  var _ElementIsReadOnly = 403;
  var _ElementIsWriteOnly = 404;
  var _IncorrectDataType = 405;

  function MultiLangScoApi()
  {
    CONSOLE.debug('Finding SCORM API...');
    this._api = this.getAPI();
    var error = false;

    if(!this._api)
    {
      _ready = false;
      if(CONF.ENABLE_ERROR_PAGE)
      {
        var error = true;
      }
    }
    else
    {
      _ready = true;
      window.API = this;
      CONSOLE.info('Found SCORM API');

      if(CONF.AUTO_INITIALIZE)
      {
        API.LMSInitialize();  
      }
    }

    var page = error ? "assets/error.html" : "assets/lang-selector.html";
    $("#sco-frame").attr("src",page);
  }

  MultiLangScoApi.prototype = {

    LMSInitialize: function()
    {
      if(!_ready){return}

      if(_initialized){return "true"}

      CONSOLE.debug('Calling LMSInitialize against SCORM API...');
      var success = this._api.LMSInitialize("");
      if(success.toString() === "true")
      {
        _initialized = true;
        CONSOLE.info('api.LMSInitialize executed successfully');
      }
      else
      {
        _initialized = false;
        CONSOLE.warn('api.LMSInitialize was not successful');
      }
      return success;
    },

    LMSGetValue: function(name)
    {
      if(!_initialized){return;}

      CONSOLE.debug('Calling LMSGetValue against SCORM API...');
      var value = this._api.LMSGetValue(name);
      var errCode = this._api.LMSGetLastError().toString();
      if (errCode != _NoError)
      {
        var errDescription = this._api.LMSGetErrorString(errCode);
        CONSOLE.warn("LMSGetValue("+name+") failed. \n"+ errDescription);
        return "";
      }
      else
      {
        if(CONF.PERSISTENCE_TYPE == "suspend_data" && name == "cmi.suspend_data")
        {
          var value = this._getSuspendDataOnly(value);
        }
        return value ? value.toString() : "";
      }
    },

    LMSSetValue: function(name, value)
    {
      if(!_initialized){return;}

      CONSOLE.debug('Calling LMSSetValue against SCORM API...');

      if(CONF.PERSISTENCE_TYPE == "suspend_data" && name == "cmi.suspend_data")
      {
        var value = this._patchSuspendData(value);
      }
      
      var result = this._api.LMSSetValue(name, value);
      if (result.toString() != "true")
      {
        var err = this.errorHandler();
      }

      return result.toString();
    },

    LMSCommit: function()
    {
      var result = this._api.LMSCommit("");
      if (result != "true")
      {
        var err = this.errorHandler();
      }

      return result.toString();
    },

    LMSFinish: function()
    {
      if(!_initialized || _terminated){return;}

      CONSOLE.debug('Calling LMSFinish against SCORM API...');
      var success = this._api.LMSFinish("");
      if(success.toString() === "true")
      {
        _initialized = false;
        _terminated = true;
        CONSOLE.info('api.LMSFinish executed successfully');
      }
      else
      {
        _terminated = false;
        CONSOLE.warn('api.LMSFinish was not successful');
      }
      return success;
    },

    LMSGetLastError: function(errorCode)
    {
      if(!_ready){return;}
      return this._api.LMSGetLastError(errorCode).toString();
    },

    LMSGetErrorString: function(errorCode)
    {
      if(!_ready){return;}
      return this._api.LMSGetErrorString(errorCode).toString();
    },

    LMSGetDiagnostic: function(errorCode)
    {
      if(!_ready){return;}
      return this._api.LMSGetDiagnostic(errorCode).toString();
    },

    errorHandler: function()
    {
      // check for errors caused by or from the LMS
      var errCode = this._api.LMSGetLastError().toString();
      if (errCode != _NoError)
      {
        // an error was encountered so display the error description
        var errDescription = this._api.LMSGetErrorString(errCode);

        errDescription += "\n";
        errDescription += this._api.LMSGetDiagnostic(null);

        CONSOLE.warn(errDescription);
      }

      return errCode;
    },

    findAPI: function(win)
    {
      while ((win.API == null) && (win.parent != null) && (win.parent != win))
      {
        _findAPITries++;
        if (_findAPITries > 7) 
        {
          CONSOLE.warn("Error finding API -- too deeply nested.");
          return null;
        }
        
        win = win.parent;
      }
      return win.API;
    },

    getAPI: function()
    {
      if(this._api){return this._api}

      var theAPI = this.findAPI(window.parent);
      if ((theAPI == null) && (window.opener != null) && (typeof(window.opener) != "undefined"))
      {
        theAPI = this.findAPI(window.opener);
      }
      if (theAPI == null)
      {
        CONSOLE.warn("Unable to find an API adapter");
      }
      return theAPI
    },

    isReady: function()
    {
      return _ready;
    },

    setSuspendDataLang: function(value)
    {
      if(!this.isReady()){return;}

      var suspendData = this._api.LMSGetValue("cmi.suspend_data");
      if(suspendData.indexOf(CONF.SUSPEND_DATA_DELIMITER)) // Previously set
      {
        var suspendDataSplit = suspendData.split(CONF.SUSPEND_DATA_DELIMITER);
        suspendDataSplit[0] = value;
        var suspendDataWithLang = suspendDataSplit.join(CONF.SUSPEND_DATA_DELIMITER);
      }
      else // Never set
      {
        var suspendDataWithLang = [value, suspendData].join(CONF.SUSPEND_DATA_DELIMITER);
      }

      CONSOLE.debug("Setting suspend_data: " + suspendDataWithLang);
      
      this._api.LMSSetValue("cmi.suspend_data", suspendDataWithLang);
    },

    getSuspendDataLang: function()
    {
      if(!this.isReady()){return "";}

      var lang = "";
      var suspendData = this._api.LMSGetValue("cmi.suspend_data");
      if(suspendData.indexOf(CONF.SUSPEND_DATA_DELIMITER)) // Previously set
      {
        var suspendDataSplit = suspendData.split(CONF.SUSPEND_DATA_DELIMITER);
        lang = suspendDataSplit[0];
      }
      CONSOLE.debug("Returning language from suspend_data: " + lang);
      return lang;
    },

    _patchSuspendData: function(value)
    {
      var suspendData = this._api.LMSGetValue("cmi.suspend_data");
      if(suspendData.indexOf(CONF.SUSPEND_DATA_DELIMITER))
      {
        var suspendDataSplit = suspendData.split(CONF.SUSPEND_DATA_DELIMITER);
        suspendDataSplit[1] = value;
        var suspendDataWithLang = suspendDataSplit.join(CONF.SUSPEND_DATA_DELIMITER);
      }
      else
      {
        var suspendDataWithLang = [value, suspendData].join(CONF.SUSPEND_DATA_DELIMITER);
      }
      return suspendDataWithLang;
    },

    _getSuspendDataOnly: function(value)
    {
      var value = "";
      var suspendData = this._api.LMSGetValue("cmi.suspend_data");
      if(suspendData.indexOf(CONF.SUSPEND_DATA_DELIMITER)) // Previously set
      {
        var suspendDataSplit = suspendData.split(CONF.SUSPEND_DATA_DELIMITER);
        value = suspendDataSplit[1];
      }
      CONSOLE.debug("Returning value from suspend_data: " + value);
      return value;
    },

    toString: function()
    {
      return "MultiLangScoApi Instance";
    }

  };

  return MultiLangScoApi;

})();

$(document).on("ready", function(){
  SCORM_API = new MultiLangScoApi();
});

$(window).on("unload", function(){
  if(CONF.AUTO_TERMINATE)
  {
    SCORM_API.LMSFinish();
  }
});