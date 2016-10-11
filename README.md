# SCORM 1.2 Multi-Lang SCO Wrapper

A configurable SCORM 1.2 package for supporting multiple SCO's in different languages.

## Usage

 1. Clone or download this repo to a new folder. The included _package_ folder is what you're most interested in, as this will form the basis of your multi-language SCO.
 2. Add all extracted SCO packages into the "package/scos" folder.
 3. Update the configuration.
 4. Update the root IMS manifest in the _package_ folder.
 5. Zip the _package_ folder from its root and import it into a SCORM 1.2 conformant LMS.

## Configuration

All of the configuration exists in a single file, and must be updated before the wrapper will function as expected. This file contains several comments, all of which are included below as well. 

Many of the options will only need to be updated when first introducing this wrapper into your LMS environment. From then on, you will more than likely use those same settings.
```
  "/conf/conf.js"
```

### Course ID
In order to keep language data separate between SCOs, set a unique identifier for this package. You may use the same value as found in the manifest its root "identifier" attribue. However, some may find the manifest's identifier is still not unique across disparate manifests. If this is the case for you, use some other convention.
```
  COURSE_ID: "MANIFEST_001",
```

### SCO Root Folder
Each SCO should be named simiarly with the same prefix, followed by a "_[LANGUAGE]" suffix, denoting the language of the SCO. This will be used when launching the SCO, in conjunction with the "lang" values included in the "SCOS" list for each language.
```
  SCO_ROOT_FOLDER: "My Awesome Training Module",
```

### Supported Languages
Configuration for the SCOs existing in this package. For each language, a folder should exist, containing the SCO for that language. Both the foldername and language should be specified for each. All SCOs must reside inside the root "scos" folder. English is stored automatically as the default to speed up UX. Note: The foldername must not include the preceding "scos/".

```
  SCOS: [
    { lang: "English", label: "English" },
    { lang: "Dutch", label: "Netherlands (Dutch)" },
    { lang: "French", label: "Français (French)" },
    { lang: "German", label: "Deutsch (German)" },
    { lang: "Spanish", label: "Español (Spanish)" },
    { lang: "Chinese", label: "简体中文 (Simplified Chinese)" }
  ],  
```

### Course Title
The title of the course to display at the top of the selector.
```
  COURSE_TITLE: "Multi-Language SCO Title",
```

### Directions
Directions text to display, prompting the learner to make a selection before they may proceed.
```
  DIRECTIONS: "Please select the language in which you would like to view the course.",
```

### Selection Text
Text to display once a language selection has been made. The placeholder "%s" will be replaced with the language string.
```
  SELECTED_TEXT: "%s language has been selected.",
```

### Launch Course
Text to display in the button a learner will use to launch/view the course in the selected language.
```
  LAUNCH_COURSE_TEXT: "Launch Course",
```

### SCO Launch File
Within each of the SCOs, there should be a HTML file that will be used to launch the SCO upon language selection. Because it is assumed that all of these SCOs have been developed using the same content creation tool, this should be the same across all SCOs.
```
  SCO_LAUNCH_FILE: "index_lms_html5.html",
```

### Default Language
For first-time viewing by an end-user. This will be the default selected language within the UI when no previous language has been selected during a previous session.
```
  DEFAULT_LANGUAGE: "English",
```

### Auto Initialize
Because it can take time for the user to select their language, they may hit the 20-second timeout threshold allowed by the SCORM specification.
```
  AUTO_INITIALIZE: true,
```

### Auto Terminate
If, for some reason, the selected SCO does not call LMSFinish before this window closes, automatically attempt to call LMSFinish. This call will not be made if the SCO has already been terminated.
```
  AUTO_TERMINATE: true,
```

### Persistence Type
The wrapper supports persisting language selection in either the learner's SCORM data record (via cmi.suspend_data), or the learner's client-side/browser storage (via localStorage). If the ```"suspend_data"``` option causes issues within an LMS environment, or with specific SCOs, use ```"local_storage"```.

**Note:** If ```"local_storage"``` is used, a learner's language selection will not carry over to sessions on different machines or within different browsers.

**Options:** "suspend_data" or "local_storage"
```
  PERSISTENCE_TYPE: "suspend_data",
```

### Suspend Data Delimeter
If the Persistence Type (above) has been set to ```"suspend_data"```, you can set the delimeter, which separates the language string from the "real" suspend_data value, which the SCO utilizes. If the tool uses the default value of ```"~~"```, then change this to something else. 
```
  SUSPEND_DATA_DELIMITER: "~~",
```

### Enable Console
For controlling all debugging to the browser console.
```
  ENABLE_CONSOLE: true,
```

### Enable Error Page
Show error page when SCORM API cannot be found.
```  
  ENABLE_ERROR_PAGE: false
```

## IMS Manifest

By default, a basic IMS manifest (```imsmanifest.xml```) is provided, and must be either updated or replaced by one of the manifests in the SCOs being used with the wrapper. The IMS manifest must exist in the root of the wrapper package, and must be representative of every SCO included.

It is recommended that the manifest located in the default language's SCO folder be used. For instance, if the default language is "English", copy the manifest file from the ```"/scos/[SCO_ROOT_FOLDER]_English"``` folder.

## Create the package

Just as in every other SCORM PIF (package), you must ensure the ```imsmanifest.xml``` is at the root of the wrapper, along with its controlling *.xsd* files. The contents of the root folder must be zipped to create an importable package.

*Note:* Some LMS environments attempt to import multiple manifests located in any subfolders within the package. Should your LMS fail on import due to this, simply remove the ```imsmanifest.xml``` from each of the SCOs within the "/scos" folder and re-zip the package.

## Credits
Sean K. Friese - https://github.com/skfriese
