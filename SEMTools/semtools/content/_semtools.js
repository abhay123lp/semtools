
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


// International Search Engine Links
function intSELinks (allSearchEngines) {
	if(!allSearchEngines){
		allSearchEngines = loadSELinksPrefs ();
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

