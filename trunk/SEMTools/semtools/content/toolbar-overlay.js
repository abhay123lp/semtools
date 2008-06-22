
//Set the two images for on and off for the adcounter
var adCounterOnImage = "chrome://adhighlighter/content/resources/adcounter_status_on.gif";
var adCounterOffImage = "chrome://adhighlighter/content/resources/adcounter_status_off.gif";

//Set the two images for on and off for the adhighlighter
var adHighlighterOnImage = "chrome://adhighlighter/content/resources/adhighlighter_status_on.gif";
var adHighlighterOffImage = "chrome://adhighlighter/content/resources/adhighlighter_status_off.gif";

//Set the two images for on and off for urldecoder
var decodeURLOnImage = "chrome://adhighlighter/content/resources/decodeurl_status_on.gif";
var decodeURLRunImage = "chrome://global/skin/throbber/Throbber-small.gif";
//var decodeURLRunImage = "chrome://adhighlighter/content/resources/loading-image.gif";
var decodeURLOffImage = "chrome://adhighlighter/content/resources/decodeurl_status_off.gif";

//Set the two images for on and off for intselinks
var intSELinksOnImage = "chrome://adhighlighter/content/resources/intselinks_status_on.gif";
var intSELinksOffImage = "chrome://adhighlighter/content/resources/intselinks_status_off.gif";


function examplePageLoad(event)
{
  if (event.originalTarget instanceof HTMLDocument) {
    var doc = event.originalTarget;
    if (event.originalTarget.defaultView.frameElement) {
      // Frame within a tab was loaded. doc should be the root document of
      // the frameset. If you don't want do anything when frames/iframes
      // are loaded in this web page, uncomment the following line:
      // return;
      // Find the root document:
      while (doc.defaultView.frameElement) {
        doc=doc.defaultView.frameElement.ownerDocument;
      }
    }
    loadSEMTools ();
  }
}

// do not try to add a callback until the browser window has
// been initialised. We add a callback to the tabbed browser
// when the browser's window gets loaded.
window.addEventListener(
  "load",
  function () {
    // Add a callback to be run every time a document loads.
    // note that this includes frames/iframes within the document
    gBrowser.addEventListener("load", examplePageLoad, true);
  },
  false
);



//window.addEventListener("load", loadSEMTools, true);

function loadSEMTools () {
	loadStatusBar ();
	injectScripts ();
}

function loadStatusBar () {
	var showAdCounterImage = document.getElementById("adcounter-status-image");
	var showAdHighlighterImage = document.getElementById("adhighlighter-status-image");
	var showIntSELinksImage = document.getElementById("intselinks-status-image");
	var decodeURLImage = document.getElementById("decodeurl-status-image");
	var editorTabOpen = document.getElementById("editortab-open");
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
	if (getDecodeURLStatus()){
		decodeURLImage.image = decodeURLOffImage;
		//content.document.defaultView.alert ("match");
		decodeURLImage.disabled = false;
	}
	else if (!getDecodeURLStatus()){
		decodeURLImage.image = decodeURLOffImage;
		//alert ("No Match");
		decodeURLImage.disabled = true;
	}
	if (getIntSELinksStatus()){
		showIntSELinksImage.image = intSELinksOnImage;
	}
	else if (!getIntSELinksStatus()){
		showIntSELinksImage.image = intSELinksOffImage;
	}
	showAdCounterImage.addEventListener("click",setAdCounter,false);
	showAdHighlighterImage.addEventListener("click",setAdHighlighter,false);
	if (decodeURLImage.disabled == false){
		decodeURLImage.addEventListener("click",setDecodeURL,false);
	}
	else {
		decodeURLImage.removeEventListener("click",setDecodeURL,false);
	}
	showIntSELinksImage.addEventListener("click",setIntSELinks,false);
	editorTabOpen.addEventListener("click",openEditorTab,false);
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
	var pref = new semtools_PrefManager();
	adCounterStatus = pref.getValue("adhighlighter.showAdCounter");
	return adCounterStatus;
}

function setAdCounterStatus(status){
	var pref = new semtools_PrefManager();
	adCounterStatus = pref.setValue("adhighlighter.showAdCounter", status);
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
  var pref = new semtools_PrefManager();
	adHighlighterStatus = pref.getValue("adhighlighter.enableAdHighlighter");
	return adHighlighterStatus;
}

function setAdHighlighterStatus(status){
	var pref = new semtools_PrefManager();
	adHighlighterStatus = pref.setValue("adhighlighter.enableAdHighlighter", status);
	adHighlighterStatus = status;
	if (status){
		var adProvider = loadAdCompanyPrefs1 ();	
		adHighlighter (true, false, adProvider);
	}
	else {
		var adProvider = loadAdCompanyPrefs1 ();	
		adHighlighter (false, false, adProvider);	}
	}

function setDecodeURL() {
	var decodeURLImage = document.getElementById("decodeurl-status-image");
	if (decodeURLImage.image == decodeURLOffImage){
		decodeURLImage.image = decodeURLOnImage;
		setDecodeURLStatus(true);
	}
	else{
		decodeURLImage.image = decodeURLOffImage;
		setDecodeURLStatus(false);
	}	
	//setDecodeURLStatus(!getDecodeURLStatus());
}

function getDecodeURLStatus(){
	var currentPageURL = content.document.defaultView.location.href;
	var currentPageURLString = String(currentPageURL);
	//var yahooMatchString = "search.yahoo";	//Test for Yahoo US, Yahoo AU, Yahoo UK, Yahoo TW
	//var baiduMatchString = "baidu"; //Test for Baidu
	//var yahooCNMatchString = "search.cn.yahoo"; //Test for Yahoo CN
	var matchingPages = "search\.yahoo|baidu|search\.cn\.yahoo";
	var matchingPagesRegEx = new RegExp(matchingPages);
	if (currentPageURLString.match(matchingPagesRegEx)){
		var decodeURLStatus = true;
	}
	else {
		var decodeURLStatus = false;
	}
  //var pref = new semtools_PrefManager();
	//decodeURLStatus = pref.getValue("adhighlighter.enableDecodeURL");
	return decodeURLStatus;
}

function setDecodeURLStatus(status){
	//var pref = new semtools_PrefManager();
	//decodeURLStatus = pref.setValue("adhighlighter.enableDecodeURL", status);
	//decodeURLStatus = status;
	var decodeURLImage = document.getElementById("decodeurl-status-image");
	if (status){
		decodeURLImage.oldImage = decodeURLImage.image;
		decodeURLImage.image = decodeURLRunImage;
		decodeURL (true);
		//decodeURLImage.image = olddecodeURLImage
	}
	else {
		encodeURL ();
	}
}

function openEditorTab (){
	editorTabchromeURL = "chrome://adhighlighter/content/editortab.xul";
	gBrowser.selectedTab = gBrowser.addTab(editorTabchromeURL);
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
	var pref = new semtools_PrefManager();
	intSELinksStatus = pref.getValue("selinks.enableSearchEngineLinks");
	return intSELinksStatus;
}

function setIntSELinksStatus(status){
	var pref = new semtools_PrefManager();
	intSELinksStatus = pref.setValue("selinks.enableSearchEngineLinks", status);
	intSELinksStatus = status;
	if (status){
		showIntSELinks();
	}
	else {
		hideIntSELinks();
	}
}

function adCounter1 () {
	var adProvider = loadAdCompanyPrefs1 ();
	makeAdCounterOutput1 (adProvider);
	showAdCounter ();
}

function loadAdCompanyPrefs1 () {
	var pref = new semtools_PrefManager();
	var maxNumOfAdProviders = 27; //I might need to dynamically set this?
	var adProvider = [];
	for (var i = 1; i <= maxNumOfAdProviders; i++){
		var currentAdCompany = {};
		currentAdCompany.name = "adhighlighter.adcompany" + i;
		//Check if the search engine preference has been set
		if(currentAdCompany.name){
			//	currentAdCompany.companyName1 = currentAdCompany.name + '.companyName';
			currentAdCompany.companyName = pref.getValue(currentAdCompany.name + '.companyName');
			currentAdCompany.displayName = pref.getValue(currentAdCompany.name + ".displayName");
			currentAdCompany.colour = pref.getValue(currentAdCompany.name + ".colour");
			currentAdCompany.matchString = pref.getValue(currentAdCompany.name + ".matchString");
			currentAdCompany.companyURL = pref.getValue(currentAdCompany.name + ".companyURL");
			currentAdCompany.detailsArray = [currentAdCompany.companyName,currentAdCompany.displayName,currentAdCompany.colour,currentAdCompany.matchString,currentAdCompany.companyURL];
			if (currentAdCompany.detailsArray[0] != ""){
				adProvider.push(currentAdCompany.detailsArray);
			}
		}
	}
	return adProvider;
}

function makeAdCounterOutput1 (adProvider) {
	var pref = new semtools_PrefManager();
	//Produce the output for the adcounter
	var allAdsCountOutput = "";
	for (x in adProvider)
	{
		var adCountName = "adhighlighter.adCount." + adProvider[x][1];
		//if (pref.prefHasUserValue(adCountName)){
			var adCountNum = pref.getValue("adhighlighter.adCount." + adProvider[x][1],0);// || 0;
		//}
		//else{
		//	var adCountNum = 0;
		//}

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
	var pref = new semtools_PrefManager();
	var maxNumOfSearchEngines = 16; 
	var allSearchEngines = [];
	
	for (var i = 1; i <= maxNumOfSearchEngines; i++){
		var currentSearchEnginePref = {};
		currentSearchEnginePref.name = "selinks.searchengine" + i;

		//Check if the search engine preference has been set
		if(currentSearchEnginePref.name){
			currentSearchEnginePref.searchEngineName = pref.getValue(currentSearchEnginePref.name + '.searchEngineName');
			currentSearchEnginePref.displayName = pref.getValue(currentSearchEnginePref.name + ".displayName");
			currentSearchEnginePref.domainName = pref.getValue(currentSearchEnginePref.name + ".domainName");
			currentSearchEnginePref.queryParameter = pref.getValue(currentSearchEnginePref.name + ".queryParameter");
			currentSearchEnginePref.urlFormat = pref.getValue(currentSearchEnginePref.name + ".urlFormat");
			currentSearchEnginePref.spaceSeperator = pref.getValue(currentSearchEnginePref.name + ".spaceSeperator");
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


function adHighlighter ( enableAdHighlighter, enableAdCounter, adProvider ) {
	if (!adProvider){
		var adProvider = loadAdCompanyPrefs1 ();
	}
	//Get all links on the page
	var allLinks, thisLink;
	allLinks = content.document.evaluate(
   	"//a[contains(@href, '/')]",
   	content.document,
   	null,
   	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
   	null);
	//If I can make a regex that gets all ad URLS I can use it here and that
	//would make it simple to set other ads to one colour 
	//Loop through all the links
		for (var i = 0; i < allLinks.snapshotLength; i++) {
    	thisLink = allLinks.snapshotItem(i);
    	// do something with thisLink
			for (x in adProvider)
		  {
				var thisLinkString = String(thisLink);
				if (thisLinkString.match(adProvider[x][3]))
				{
					//Check if enableAdHighlighter is set to true
					if (enableAdHighlighter)
					{
						thisLink.style.color = adProvider[x][2];// + " ! important";
						//Baidu hack to override red font
						if (thisLink.firstChild.lastChild){
						thisLink.firstChild.lastChild.color = adProvider[x][2];
						}
						thisLink.title = adProvider[x][1];
						//Should the display title be the display name or proper name? Probably display name as it matches the ad counter
					}
					if ((!enableAdHighlighter) && (thisLink.name !== 'intselinks'))
					{
						thisLink.style.color = "";
						thisLink.title = "";
					}
					//Check if enableAdCounter is set to true
					if (enableAdCounter)
					{
						incrementAdCounter (adProvider[x][1]);
					}
				}
		
			}
		}
} //End of adhighlighter function


// International Search Engine Links
function intSELinks (allSearchEngines) {
	if(!allSearchEngines){
		allSearchEngines = loadSELinksPrefs1 ();
	}
	//Get the current URL  
	var href = content.window.location.href;
	//Get all the parameters of the URL
	var hrefParameters = [];
	hrefParameters = href.split(/[\&\?]/);

	//Decide what is the current search engine that the user is visiting
	var currentSearchEngine = '';
	for (var i = 0; i < allSearchEngines.length; i++)
	{
		var searchEngineURLParameter = hrefParameters[0];
		if (searchEngineURLParameter.match(allSearchEngines[i][2]))
		{
			currentSearchEngine = allSearchEngines[i];
		}
	}

	//Find the parameter that contains the query parameter name for the current search engine and return the current search term
	var currentSearchTerm = '';
	var currentQueryPara = currentSearchEngine[3];
	for (var i = 0; i < hrefParameters.length; i++)
	{
		var currentParaString = hrefParameters[i];
		var currentParaStringArray = [];
		var currentParaStringArray = currentParaString.split(/\=/);
		if (currentParaStringArray[0].match(currentQueryPara))
		{
			currentSearchTerm = currentParaStringArray[1];
		}
	}

	/*
	//Remove the space seperator for the current search engine- Do I need to remove the space seperator? Are all search engines the same?
	//Check LastFM and the Chinese search engines
	currentSearchTerm = currentSearchTerm.replace(currentSearchEngine[5], ' ');
	*/

	// Put all search engine names & display names & url formats into an array of arrays
	// var allSearchEnginesItemsToDisplay = [];
	var searchEngineHTMLTextToDisplay = [];

	for (var i = 0; i < allSearchEngines.length; i++)
	{
		var newURLAfterReplace = allSearchEngines[i][4].toString();
		newURLAfterReplace = newURLAfterReplace.replace('%QUERY%', currentSearchTerm);
		allSearchEngines[i][4] = newURLAfterReplace;
		searchEngineHTMLTextToDisplay[i] = '<a href="' + allSearchEngines[i][4] + '" title="' + allSearchEngines[i][0] + '">' + allSearchEngines[i][1] + '</a>';
	}
	//Enter the URLs into the page	
	var intSELinksDiv = content.document.createElement("div");
	intSELinksDiv.id = "intSELinksDiv";
	intSELinksDiv.innerHTML = '<div style="margin: 0 auto 0 auto; ' +
 	'border-bottom: 1px solid #000000; margin-bottom: 5px; ' +
 	'font-size: small; background-color: #ffffff; ' +
 	'color: #000000;"><p style="margin: 2px 0 1px 0;"> ' +
  searchEngineHTMLTextToDisplay.join()
  + '</p></div>';
	content.document.body.insertBefore(intSELinksDiv, content.document.body.firstChild);
} // End of IntSELinks function




function hideAdCounter(){
	var adCounterDiv = content.document.getElementById('adCounterDiv');
	if (adCounterDiv) {
		adCounterDiv.style.display = 'none';
	}
}

function showAdCounter(){
	var adCounterDiv = content.document.getElementById('adCounterDiv');
	if (adCounterDiv) {
		adCounterDiv.style.display = 'block';
	}
}

function injectScripts () {
	var pref = new semtools_PrefManager();
 	//These are all boolean check boxes
	var enableAdHighlighter = pref.getValue("adhighlighter.enableAdHighlighter",1);
	if (enableAdHighlighter){
		//Load the showAdCounter & enableAdCounter preferences
		if(testPageMatch("adhighlighter.")){
			var enableAdCounter = pref.getValue("adhighlighter.enableAdCounter",0);
			adHighlighter ( enableAdHighlighter, enableAdCounter, false );
			var showAdCounterStatus = pref.getValue("adhighlighter.showAdCounter",0);
			if(showAdCounterStatus){
				var adCounterDiv = content.document.getElementById('adCounterDiv');
				if (adCounterDiv){
					showAdCounter ();
				}
				else{
					adCounter1();
				}
			}
		}
	}
	//Load the enable Search Engine Links preferences
	//These are all boolean check boxes
	var enableSearchEngineLinks = pref.getValue("selinks.enableSearchEngineLinks",1);
	if (enableSearchEngineLinks){
  	if(testPageMatch("selinks.")){
			showIntSELinks();
		}
  }
}

function incrementAdCounter (adCompany){
	var pref = new semtools_PrefManager();
	//Increase the counter for the adProvider
	var adCount = pref.getValue("adhighlighter.adCount." + adCompany, 0);
	adCount++;
	pref.setValue("adhighlighter.adCount." + adCompany, adCount);
}

function testPageMatch (extensionPath) {
	var pref = new semtools_PrefManager();
	//Add the include exclude code for the adhighlighter here.
  var currentPageURL = content.document.defaultView.location.href;
  var includeList = pref.getValue(extensionPath + "includeList",0);
  var excludeList = pref.getValue(extensionPath + "excludeList",0);

  includeList = "(" + includeList.replace(/,/g,"|") + ")";
  excludeList = "(" + excludeList.replace(/,/g,"|") + ")";
  

  var includeListRegex = new RegExp (includeList,"i");
  var excludeListRegex = new RegExp (excludeList,"i");

  if (includeListRegex.test(currentPageURL) && !(excludeListRegex.test(currentPageURL))){
		return true;
	}
	else {
		return false;
	}
}
