var adhighlighter = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
    this.strings = document.getElementById("adhighlighter-strings");
    document.getElementById("contentAreaContextMenu")
            .addEventListener("popupshowing", function(e) { this.showContextMenu(e); }, false);
  },

  showContextMenu: function(event) {
    // show or hide the menuitem based on what the context menu is on
    // see http://kb.mozillazine.org/Adding_items_to_menus
    document.getElementById("context-adhighlighter").hidden = gContextMenu.onImage;
  },
  onMenuItemCommand: function(e) {
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                  .getService(Components.interfaces.nsIPromptService);
    promptService.alert(window, this.strings.getString("helloMessageTitle"),
                                this.strings.getString("helloMessage"));
  },

};
window.addEventListener("load", function(e) { adhighlighter.onLoad(e);} , false);


//Set the two images for on and off for the adcounter
var adCounterOnImage = "chrome://adhighlighter/content/adcounter_status_on.gif";
var adCounterOffImage = "chrome://adhighlighter/content/adcounter_status_off.gif";

//Set the two images for on and off for the adhighlighter
var adHighlighterOnImage = "chrome://adhighlighter/content/adhighlighter_status_on.gif";
var adHighlighterOffImage = "chrome://adhighlighter/content/adhighlighter_status_off.gif";

//Set the two images for on and off for intselinks
var intSELinksOnImage = "chrome://adhighlighter/content/intselinks_status_on.gif";
var intSELinksOffImage = "chrome://adhighlighter/content/intselinks_status_off.gif";

window.addEventListener("load", loadSEMTools, true);

function loadSEMTools () {
	loadStatusBar ();
	injectScripts ();
}

function loadStatusBar () {
	var showAdCounterImage = document.getElementById("adcounter-status-image");
	var showAdHighlighterImage = document.getElementById("adhighlighter-status-image");
	var showIntSELinksImage = document.getElementById("intselinks-status-image");

	//var statusbar = document.getElementById("status-bar");
	if (getAdCounterStatus()){
		showAdCounterImage.image = adCounterOnImage;
	}
	else if (!getAdCounterStatus()){
		showAdCounterImage.image = adCounterOffImage;
	}
	if (getAdHighlighterStatus()){
		showAdHighlighterImage.image = adHighlighterOnImage;
	}
	else if (!getAdHighlighterStatus()){
		showAdHighlighterImage.image = adHighlighterOffImage;
	}
	if (getIntSELinksStatus()){
		showIntSELinksImage.image = intSELinksOnImage;
	}
	else if (!getIntSELinksStatus()){
		showIntSELinksImage.image = intSELinksOffImage;
	}
	showAdCounterImage.addEventListener("click",setAdCounter,false);
	showAdHighlighterImage.addEventListener("click",setAdHighlighter,false);
	showIntSELinksImage.addEventListener("click",setIntSELinks,false);
}

function setAdCounter() {
	var showAdCounterImage = document.getElementById("adcounter-status-image");
	if (!getAdCounterStatus()){
		showAdCounterImage.image = adCounterOnImage;
	}
	else{
		showAdCounterImage.image = adCounterOffImage;
	}	
	setAdCounterStatus(!getAdCounterStatus());
}

function getAdCounterStatus(){
	var pref = semPref();
	adCounterStatus = pref.getBoolPref("adhighlighter.showAdCounter");
	return adCounterStatus;
}

function setAdCounterStatus(status){
	var pref = semPref();
	adCounterStatus = pref.setBoolPref("adhighlighter.showAdCounter", status);
	adCounterStatus = status;
	if (status){
		var adCounterDiv = content.document.getElementById('adCounterDiv');
		if (adCounterDiv){
			showAdCounter ();
		}
		else{
			adCounter1();
		}
	}
	else {
		hideAdCounter();
	}
}

function setAdHighlighter() {
	var showAdHighlighterImage = document.getElementById("adhighlighter-status-image");
	if (!getAdHighlighterStatus()){
		showAdHighlighterImage.image = adHighlighterOnImage;
	}
	else{
		showAdHighlighterImage.image = adHighlighterOffImage;
	}	
	setAdHighlighterStatus(!getAdHighlighterStatus());
}

function getAdHighlighterStatus(){
  var pref = semPref();
	adHighlighterStatus = pref.getBoolPref("adhighlighter.enableAdHighlighter");
	return adHighlighterStatus;
}

function setAdHighlighterStatus(status){
	var pref = semPref();
	adHighlighterStatus = pref.setBoolPref("adhighlighter.enableAdHighlighter", status);
	adHighlighterStatus = status;
	if (status){
		var adProvider = loadAdCompanyPrefs1 ();	
		adHighlighter (true, false, adProvider);
	}
	else {
		var adProvider = loadAdCompanyPrefs1 ();	
		adHighlighter (false, false, adProvider);	}
	}

function setIntSELinks() {
	var showIntSELinksImage = document.getElementById("intselinks-status-image");
	if (!getIntSELinksStatus()){
		showIntSELinksImage.image = intSELinksOnImage;
	}
	else{
		showIntSELinksImage.image = intSELinksOffImage;
	}	
	setIntSELinksStatus(!getIntSELinksStatus());
}

function getIntSELinksStatus(){
	var pref = semPref();
	intSELinksStatus = pref.getBoolPref("selinks.enableSearchEngineLinks");
	return intSELinksStatus;
}

function setIntSELinksStatus(status){
	var pref = semPref();
	intSELinksStatus = pref.setBoolPref("selinks.enableSearchEngineLinks", status);
	intSELinksStatus = status;
	if (status){
		showIntSELinks();
	}
	else {
		hideIntSELinks();
	}
}

function semPref () {
	var startPoint = "extensions.semtools.";
	var prefBranch = Components.classes["@mozilla.org/preferences-service;1"].
	getService(Components.interfaces.nsIPrefService).
	getBranch(startPoint);
	return prefBranch;
}


function adCounter1 () {
	var adProvider = loadAdCompanyPrefs1 ();
	makeAdCounterOutput1 (adProvider);
	showAdCounter ();
}

function loadAdCompanyPrefs1 () {
	var pref = semPref();
	var maxNumOfAdProviders = 27; //I might need to dynamically set this?
	var adProvider = [];
	for (var i = 1; i <= maxNumOfAdProviders; i++){
		var currentAdCompany = {};
		currentAdCompany.name = "adhighlighter.adcompany" + i;
		//Check if the search engine preference has been set
		if(currentAdCompany.name){
			//	currentAdCompany.companyName1 = currentAdCompany.name + '.companyName';
			currentAdCompany.companyName = pref.getCharPref(currentAdCompany.name + '.companyName');
			currentAdCompany.displayName = pref.getCharPref(currentAdCompany.name + ".displayName");
			currentAdCompany.colour = pref.getCharPref(currentAdCompany.name + ".colour");
			currentAdCompany.matchString = pref.getCharPref(currentAdCompany.name + ".matchString");
			currentAdCompany.companyURL = pref.getCharPref(currentAdCompany.name + ".companyURL");
			currentAdCompany.detailsArray = [currentAdCompany.companyName,currentAdCompany.displayName,currentAdCompany.colour,currentAdCompany.matchString,currentAdCompany.companyURL];
			if (currentAdCompany.detailsArray[0] != ""){
				adProvider.push(currentAdCompany.detailsArray);
			}
		}
	}
	return adProvider;
}

function makeAdCounterOutput1 (adProvider) {
	var pref = semPref();
	//Produce the output for the adcounter
	var allAdsCountOutput = "";
	for (x in adProvider)
	{
		var adCountName = "adhighlighter.adCount." + adProvider[x][1];
		if (pref.prefHasUserValue(adCountName)){
			var adCountNum = pref.getIntPref("adhighlighter.adCount." + adProvider[x][1],0) || 0;
		}
		else{
			var adCountNum = 0;
		}

		var thisAdProvider = '<a href="' + adProvider[x][4] + '" name="intselinks" title="' + adProvider[x][0] + '" style="color:' + adProvider[x][2] + '">' + adProvider[x][1] + '</a>:' + adCountNum + ', ';
		//Split into multiple lines if too many companies
		allAdsCountOutput = allAdsCountOutput + thisAdProvider;
		if (x==9)
		{
			allAdsCountOutput = allAdsCountOutput + "</br>";
		}
	}
	//Add the div contents to display to a variable
	divContents = '<div style="margin: 0 auto 0 auto; ' +
 	'border-bottom: 1px solid #000000; margin-bottom: 5px; ' +
 	'font-size: small; background-color: #ffffff; ' +
 	'color: #000000;"><p style="margin: 2px 0 1px 0;"> ' + allAdsCountOutput + '</p></div>';
	//adCounter (allAdsCountOutput);

	//Create an empty div
	adCounterDiv = content.document.createElement("div");
	adCounterDiv.id = "adCounterDiv";
	if (divContents){adCounterDiv.innerHTML = divContents;}
	adCounterDiv.style.display = 'none';
	content.document.body.insertBefore(adCounterDiv, content.document.body.firstChild);
}

function loadSELinksPrefs1 () {
	var pref = semPref();
	var maxNumOfSearchEngines = 16; 
	var allSearchEngines = [];
	
	for (var i = 1; i <= maxNumOfSearchEngines; i++){
		var currentSearchEnginePref = {};
		currentSearchEnginePref.name = "selinks.searchengine" + i;

		//Check if the search engine preference has been set
		if(currentSearchEnginePref.name){
			currentSearchEnginePref.searchEngineName = pref.getCharPref(currentSearchEnginePref.name + '.searchEngineName');
			currentSearchEnginePref.displayName = pref.getCharPref(currentSearchEnginePref.name + ".displayName");
			currentSearchEnginePref.domainName = pref.getCharPref(currentSearchEnginePref.name + ".domainName");
			currentSearchEnginePref.queryParameter = pref.getCharPref(currentSearchEnginePref.name + ".queryParameter");
			currentSearchEnginePref.urlFormat = pref.getCharPref(currentSearchEnginePref.name + ".urlFormat");
			currentSearchEnginePref.spaceSeperator = pref.getCharPref(currentSearchEnginePref.name + ".spaceSeperator");
			currentSearchEnginePref.detailsArray = [currentSearchEnginePref.searchEngineName,currentSearchEnginePref.displayName,currentSearchEnginePref.domainName,currentSearchEnginePref.queryParameter,currentSearchEnginePref.urlFormat,currentSearchEnginePref.spaceSeperator];
			if (currentSearchEnginePref.detailsArray[0] != ""){
				allSearchEngines.push(currentSearchEnginePref.detailsArray);
			}
		}
	}
	return allSearchEngines;
}

function hideIntSELinks () {
	var intSELinksDiv = content.document.getElementById('intSELinksDiv');
	if (intSELinksDiv){
		intSELinksDiv.style.display = 'none';
	}
}

function showIntSELinks () {
	var intSELinksDiv = content.document.getElementById('intSELinksDiv');
	if (intSELinksDiv){
		intSELinksDiv.style.display = 'block';
	}
	else {
	var allSearchEngines = loadSELinksPrefs1();
	intSELinks (allSearchEngines);
	}
}

function showSEMToolsSettings() {
	var features;
	var optionsURL = "chrome://adhighlighter/content/options.xul";
  try {
  	var instantApply = gPref.getBoolPref("browser.preferences.instantApply");
    features = "chrome,titlebar,toolbar,centerscreen" + (instantApply ? ",dialog=no" : ",modal");
  }
  catch (e) {
  	features = "chrome,titlebar,toolbar,centerscreen,modal";
  }
  openDialog(optionsURL, "", features);
}