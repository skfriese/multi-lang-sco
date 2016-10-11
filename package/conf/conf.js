
var CONF = CONF || {

  /**
   * In order to keep language data separate between SCOs, set a
   * unique identifier for this package. You may use the same value
   * as found in the manifest its root "identifier" attribue.
   * However, some may find the manifest's identifier is still not
   * unique across disparate manifests. If this is the case for you,
   * use some other convention.
   * @type {String}
   */
  COURSE_ID: "MANIFEST01",  

  /**
   * Each SCO should be named simiarly with the same prefix, followed
   * by a "_[LANGUAGE]" suffix, denoting the language of the SCO.
   * This will be used when launching the SCO, in conjunction with the
   * "lang" values included in the "SCOS" list for each language.
   * @type {String}
   */
  SCO_ROOT_FOLDER: "Introduction_to_Contracts",

  /**
   * Configuration for the SCOs existing in this package. For each
   * language, a folder should exist, containing the SCO for that
   * language. Both the foldername and language should be specified
   * for each. All SCOs must reside inside the root "scos" folder.
   * English is stored automatically as the default to speed up UX.
   * Note: The foldername must not include the preceding "scos/".
   * @type {Array}
   */
  SCOS: [

    { lang: "English", label: "English" },
    { lang: "Dutch", label: "Netherlands (Dutch)" },
    { lang: "French", label: "Français (French)" },
    { lang: "German", label: "Deutsch (German)" },
    { lang: "Spanish", label: "Español (Spanish)" },
    { lang: "Chinese", label: "简体中文 (Simplified Chinese)" }

  ],  

  /**
   * The title of the course to display at the top of the selector.
   * @type {String}
   */
  COURSE_TITLE: "Multi-Language SCO Title",

  /**
   * Directions text to display, prompting the learner to make a 
   * selection before they may proceed.
   * @type {String}
   */
  DIRECTIONS: "Please select the language in which you would like to view the course.",

  /**
   * Text to display once a language selection has been made.
   * The placeholder "%s" will be replaced with the language string.
   * @type {String}
   */
  SELECTED_TEXT: "%s language has been selected.",

  /**
   * Text to display in the button a learner will use to launch/view
   * the course in the selected language.
   * @type {String}
   */
  LAUNCH_COURSE_TEXT: "Launch Course",

  /**
   * Within each of the SCOs, there should be a HTML file that
   * will be used to launch the SCO upon language selection.
   * Because it is assumed that all of these SCOs have been
   * developed using the same content creation tool, this should
   * be the same across all SCOs. 
   * @type {String}
   */   
  SCO_LAUNCH_FILE: "index_lms_html5.html",

  /**
   * For first-time viewing by an end-user. This will be the default
   * selected language within the UI when no previous language has
   * been selected during a previous session. 
   * @type {String}
   */   
  DEFAULT_LANGUAGE: "English",

  /**
   * Because it can take time for the user to select their language,
   * they may hit the 20-second timeout threshold allowed by the
   * SCORM specification. 
   * @type {Boolean}
   */
  AUTO_INITIALIZE: true,

  /**
   * If, for some reason, the selected SCO does not call LMSFinish
   * before this window closes, automatically attempt to call
   * LMSFinish. This call will not be made if the SCO has already
   * been terminated. 
   * @type {Boolean}
   */
  AUTO_TERMINATE: true,

  /**
   * The wrapper supports persisting language selection in either 
   * the learner's SCORM data record (via cmi.suspend_data), or the
   * learner's client-side/browser storage (via localStorage). 
   * If the "suspend_data" option causes issues within an LMS 
   * environment, or with specific SCOs, use "local_storage".
   *
   * Note: If "local_storage" is used, a learner's language selection 
   * will not carry over to sessions on different machines or within 
   * different browsers.
   * 
   * Options: "suspend_data" or "local_storage" 
   * @type {String}
   */   
  PERSISTENCE_TYPE: "suspend_data",

  /**
   * If the Persistence Type (above) has been set to "suspend_data", 
   * you can set the delimeter, which separates the language string 
   * from the "real" suspend_data value, which the SCO utilizes. 
   * If the tool uses the default value of "~~", then change this 
   * to something else. 
   * @type {String}
   */
  SUSPEND_DATA_DELIMITER: "~~",

  /**
   * For controlling all debugging to the browser console. 
   * @type {Boolean}
   */
  ENABLE_CONSOLE: true,

  /**
   * Show error page when SCORM API cannot be found.
   * @type {Boolean}
   */
  ENABLE_ERROR_PAGE: false

};

