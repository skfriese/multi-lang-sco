
// Requires the use of localStorage

var langSel;
var CONSOLE;
var LanguageSelector = (function($){

  "use strict"

  var _$langListEl = $("#lang-list");
  var _$langSelectionEl = $("#lang-selection");
  var _language;

  function LanguageSelector()
  {

  }

  LanguageSelector.prototype = {

    initialize: function()
    {
      CONSOLE = (parent && parent.CONSOLE) ? parent.CONSOLE : null;
      this._api = (parent && parent.SCORM_API) ? parent.SCORM_API : null;

      if(!CONSOLE || !this._api)
      {
        alert("MultiLangSCO: Cannot locate SCORM API in parent.")
      }

      this.renderList();
      this.restoreSelection();
      this.updatePhrases();

      $("#launch-course").on("click", function(){
        langSel.launchCourse();
      });

      return this;
    },

    renderList: function()
    {
      CONSOLE.debug("Rendering language list...");
      var self = this;
      $.each(CONF.SCOS, function( index, value ) {
        self.renderListItem(index,value);
      });
    },

    renderListItem: function(index,value)
    {
      var self = this;
      CONSOLE.debug(index + ": " + value.lang);

      var $li = $("<li />",{
        "data-index": index,
        "data-language": value.lang,
        "class": "list-item",
        "aria-pressed": "false",
        role: "button",
        tabindex: "0",
        html: value.label
      }).on("click",function(){
        self.select($(this));
      });

      _$langListEl.append($li);
    },

    select: function($el)
    {
      var lang = $el.data("language");
      $(".list-item").attr("aria-pressed","false");
      $el.attr("aria-pressed","true");
      _language = lang;
      this.setLang(lang);
      this.updateSelectedText();
      $("#launch-course").fadeIn("fast");
      CONSOLE.info(lang + " language selected");
    },

    restoreSelection: function()
    {
      CONSOLE.debug("Restoring previous selection...");
      var selection = this.getLang();
      if(!selection || selection == "" || selection == "undefined")
      {
        selection = CONF.DEFAULT_LANGUAGE;
        CONSOLE.debug("Previous selection not found, using default: " + selection);
      }
      else
      {
        CONSOLE.debug("Previous selection found: " + selection);
      }
      
      this.select($("[data-language="+selection+"]"));
    },

    updatePhrases: function()
    {
      $("h1").html(CONF.COURSE_TITLE);
      $(".directions").html(CONF.DIRECTIONS);
      $("#launch-course").html(CONF.LAUNCH_COURSE_TEXT);
      this.updateSelectedText();
    },

    updateSelectedText: function()
    {
      $(".selected").html(CONF.SELECTED_TEXT.replace("%s",_language));
    },

    setLang: function(value)
    {
      switch(CONF.PERSISTENCE_TYPE)
      {
        case "local_storage":
          localStorage.setItem("multilangsco_lang_"+CONF.SCO_ID, value);
          break;
        case "suspend_data":
          this._api.setSuspendDataLang(value);
          break;
      }
    },

    getLang: function()
    {
      switch(CONF.PERSISTENCE_TYPE)
      {
        case "local_storage":
          return localStorage.getItem("multilangsco_lang_"+CONF.SCO_ID);
        case "suspend_data":
          return this._api.getSuspendDataLang();
      }
    },

    getCoursePath: function()
    {
      for(var sco in CONF.SCOS)
      {
        var scoObj = CONF.SCOS[sco];
        if(scoObj.lang == _language)
        {
          var folder = CONF.SCO_ROOT_FOLDER + "_" + scoObj.lang;
          CONSOLE.debug("Launching course: " + folder);
          return "../scos/"+folder+"/"+CONF.SCO_LAUNCH_FILE;
        }
      }      
    },

    launchCourse: function()
    {
      var path = this.getCoursePath();
      document.location.replace(path);
    }
  }

  return LanguageSelector;

})(jQuery);

$(document).on("ready", function(){
  langSel = new LanguageSelector().initialize();
});
