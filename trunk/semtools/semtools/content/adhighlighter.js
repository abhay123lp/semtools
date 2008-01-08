
//Should the true be a false
window.addEventListener('load',injectScripts,true);

function injectScripts () {
 	//These are all boolean check boxes
	var enableAdHighlighter = GM_getValue("adhighlighter.enableAdHighlighter",1);
	if (enableAdHighlighter){
		//Load the showAdCounter & enableAdCounter preferences
		if(testPageMatch("adhighlighter.")){
			var enableAdCounter = GM_getValue("adhighlighter.enableAdCounter",0);
			adHighlighter ( enableAdHighlighter, enableAdCounter, false );
			var showAdCounter = GM_getValue("adhighlighter.showAdCounter",0);
			if(showAdCounter){
				adCounter();
			}
		}
	}
	//Load the enable Search Engine Links preferences
	//These are all boolean check boxes
	var enableSearchEngineLinks = GM_getValue("selinks.enableSearchEngineLinks",1);
	if (enableSearchEngineLinks){
  	if(testPageMatch("selinks.")){
			intSELinks();
		}
  }
}
//Do I need these?
var divContents, adCounterDiv;

function adHighlighter ( enableAdHighlighter, enableAdCounter, adProvider ) {
	if (!adProvider){
		var adProvider = loadAdCompanyPrefs ();
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
						thisLink.style.color = adProvider[x][2];
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

function loadAdCompanyPrefs () {
	//Load all the preference variables from the options menu
	//Preference Names (These are all under the "extensions.semtools." branch)
	//adhighlighter.adcompany1.companyName -->Company Name
	//adhighlighter.adcompany1.displayName -->Display Name
	//adhighlighter.adcompany1.colour -->Color
	//adhighlighter.adcompany1.matchString -->Match String
	//adhighlighter.adcompany1.companyURL -->companyURL


	//Load the adcompany variables
	//Format: adProvider = ["Company Name", "Display Name", "Colour", "Match String", "Company URL"]
	var maxNumOfAdProviders = 27; //I might need to dynamically set this?
	var adProvider = [];
	for (var i = 1; i <= maxNumOfAdProviders; i++){
		var currentAdCompany = {};
		currentAdCompany.name = "adhighlighter.adcompany" + i;
		//Check if the search engine preference has been set
		if(currentAdCompany.name){
			//	currentAdCompany.companyName1 = currentAdCompany.name + '.companyName';
			currentAdCompany.companyName = GM_getValue(currentAdCompany.name + '.companyName',0);
			currentAdCompany.displayName = GM_getValue(currentAdCompany.name + ".displayName",0);
			currentAdCompany.colour = GM_getValue(currentAdCompany.name + ".colour",0);
			currentAdCompany.matchString = GM_getValue(currentAdCompany.name + ".matchString",0);
			currentAdCompany.companyURL = GM_getValue(currentAdCompany.name + ".companyURL",0);
			currentAdCompany.detailsArray = [currentAdCompany.companyName,currentAdCompany.displayName,currentAdCompany.colour,currentAdCompany.matchString,currentAdCompany.companyURL];
			if (currentAdCompany.detailsArray[0] != ""){
				adProvider.push(currentAdCompany.detailsArray);
			}
		}
	}
	return adProvider;
}

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

function adCounter () {
	var adProvider = loadAdCompanyPrefs ();
	makeAdCounterOutput (adProvider);
	showAdCounter ();
}

function incrementAdCounter (adCompany){
	//Increase the counter for the adProvider
	var adCount = GM_getValue("adhighlighter.adCount." + adCompany, 0);
	adCount++;
	GM_setValue("adhighlighter.adCount." + adCompany, adCount);
}

function makeAdCounterOutput (adProvider) {
	//Produce the output for the adcounter
	var allAdsCountOutput = "";
	for (x in adProvider)
	{
		var thisAdProvider = '<a href="' + adProvider[x][4] + '" name="intselinks"  title="' + adProvider[x][0] + '" style="color:' + adProvider[x][2] + '">' + adProvider[x][1] + '</a>:' + GM_getValue("adhighlighter.adCount." + adProvider[x][1],0) + ', ';
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
	adCounterDiv = document.createElement("div");
	adCounterDiv.id = "adCounterDiv";
	if (divContents){adCounterDiv.innerHTML = divContents;}
	adCounterDiv.style.display = 'none';
	document.body.insertBefore(adCounterDiv, document.body.firstChild);
}

// International Search Engine Links
function intSELinks (allSearchEngines) {
	if(!allSearchEngines){
		allSearchEngines = loadSELinksPrefs ();
	}
	//Get the current URL  
	var href = window.location.href;

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

function loadSELinksPrefs () {
  //Load all the preference variables from the options menu
	//Preference Names (These are all under the "extensions.semtools." branch)
	//selinks.searchengine1.searchEngineName -->Search Engine Name
	//selinks.searchengine1.displayName -->Display Name
	//selinks.searchengine1.domainName -->Domain Name
	//selinks.searchengine1.queryParameter -->Query Parameter
	//selinks.searchengine1.urlFormat -->URL Format
	//selinks.searchengine1.spaceSeperator -->Space Seperator

	//Load the search engine variables
	//Format: allSearchEngines = ["Search Engine Name", "Display Name", "Domain Name", "Query Parameter", "URL Format", "Space Seperator"]
	var maxNumOfSearchEngines = 16; //I might need to dynamically set this?
	var allSearchEngines = [];
	
	for (var i = 1; i <= maxNumOfSearchEngines; i++){
		var currentSearchEnginePref = {};
		currentSearchEnginePref.name = "selinks.searchengine" + i;

		//Check if the search engine preference has been set
		if(currentSearchEnginePref.name){
			currentSearchEnginePref.searchEngineName = GM_getValue(currentSearchEnginePref.name + '.searchEngineName',0);
			currentSearchEnginePref.displayName = GM_getValue(currentSearchEnginePref.name + ".displayName",1);
			currentSearchEnginePref.domainName = GM_getValue(currentSearchEnginePref.name + ".domainName",0);
			currentSearchEnginePref.queryParameter = GM_getValue(currentSearchEnginePref.name + ".queryParameter",0);
			currentSearchEnginePref.urlFormat = GM_getValue(currentSearchEnginePref.name + ".urlFormat",0);
			currentSearchEnginePref.spaceSeperator = GM_getValue(currentSearchEnginePref.name + ".spaceSeperator",0);
			currentSearchEnginePref.detailsArray = [currentSearchEnginePref.searchEngineName,currentSearchEnginePref.displayName,currentSearchEnginePref.domainName,currentSearchEnginePref.queryParameter,currentSearchEnginePref.urlFormat,currentSearchEnginePref.spaceSeperator];
			if (currentSearchEnginePref.detailsArray[0] != ""){
				allSearchEngines.push(currentSearchEnginePref.detailsArray);
			}
		}
	}
	return allSearchEngines;
}

function testPageMatch (extensionPath) {
	//Add the include exclude code for the adhighlighter here.
  var currentPageURL = window.location.href;
  var includeList = GM_getValue (extensionPath + "includeList",0);
  var excludeList = GM_getValue (extensionPath + "excludeList",0);

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

