function decodeURL () {
	var currentPageURL = content.document.defaultView.location.href;
	var currentPageURLString = String(currentPageURL);
	var yahooMatchString = "search.yahoo";	//Test for Yahoo US, Yahoo AU, Yahoo UK, Yahoo TW
	var baiduMatchString = "baidu"; //Test for Baidu
	var yahooCNMatchString = "search.cn.yahoo"; //Test for Yahoo CN
	//Doesn't work on Yahoo India, Sensis...
	var searchService = "";
	if (currentPageURLString.match(yahooMatchString)){
		var xPath = "//a[contains(translate(@href, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), translate('overture.com/', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'))]";
		searchService = "all";
	}
	else if (currentPageURLString.match(baiduMatchString)){
		var xPath = "//a[contains(@href, 'http://www.baidu.com/baidu.php?url=')]";
		searchService = "baidu";
	}
	else if (currentPageURLString.match(yahooCNMatchString)){
		var xPath = "//a[contains(@href, 'click.p4p.cn.yahoo.com')]";
		searchService = "yahoocn";
	}
	else {
		//Do nothing
		var xPath = "";
		//alert ("Doesn't match");
	}
	if (xPath != ""){
		var allLinks, thisLink;
		allLinks = content.document.evaluate(
	   	xPath,
	   	content.document,
	   	null,
	   	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
	   	null);
	  for (var i = 0; i < allLinks.snapshotLength; i++) {
	   	thisLink = allLinks.snapshotItem(i);
	   	var counter = 0;
	   	var resultsCounter = 0;
	   	if (thisLink){
	   		webSnifferIt(thisLink.href,  thisLink.href, counter, searchService, allLinks.snapshotLength, resultsCounter);
	   	}
	  }
	}
}

function encodeURL (){
	//alert ("Encoding URLs");
}

function webSnifferIt(targetURL, originalURL, counter, searchService, numOfResults, resultsCounter) {
	var webSnifferPre = "http://web-sniffer.net/?url=";
  var webSnifferPost = "&submit=Submit&http=1.1&rawhtml=yes&type=GET&uak=1";
  var requestURL = webSnifferPre + targetURL + webSnifferPost;
  if (searchService == "yahoocn"){
  	requestURL = targetURL;
  }
  var resultsPage = "";
  
  var regExpTestOne = 'HTTP Status Code\: HTTP\/1\.1 302 Found';
  var regExpTestTwo = 'This link is not authorized by Yahoo';
  var regExpTestThree = 'YahooCN Redirector';
  regExpTestOne = new RegExp(regExpTestOne);
  var req = new XMLHttpRequest();
	req.open('GET', requestURL, true);
	req.onreadystatechange = function (aEvt) {
  if (req.readyState == 4) {
    if(req.status == 200){
      resultsPage = req.responseText;
      if ((resultsPage.search(regExpTestOne)) > 0){
      	var webSnifferURLLocation = 'examine location target.*';
  			var webSnifferURLLocationPre = 'examine location target" href="/?url=';
  			var webSnifferURLLocationPost = '</a>';
  			var webSnifferRegExp = new RegExp(webSnifferURLLocation);
  			var matchResult = webSnifferRegExp.exec(resultsPage);
  			matchResult = matchResult.toString().replace(webSnifferURLLocationPre, "");
  			matchResult = matchResult.toString().replace(/\<\/a\>.*/, "");
  			matchResult = matchResult.toString().replace(/\&amp\;.*/, "");  			
      }
      else if ((resultsPage.search(regExpTestTwo)) > 0){
        webSnifferURLLocation = 'http\:\/\/rc12\.overture\.com.*here';
       	webSnifferRegExp = new RegExp(webSnifferURLLocation);
       	webSnifferURLLocationPre = '&gt;here';
  			var matchResult = webSnifferRegExp.exec(resultsPage);
      }
      else if ((resultsPage.search(regExpTestThree)) > 0){
       	var webSnifferURLLocationPre = 'body onload="redirect(';
  			var webSnifferURLLocationPost = ')"';
       	var webSnifferURLLocationQuotes = "'";
      	webSnifferURLLocation = 'body onload\=\"redirect.*\"';
       	webSnifferRegExp = new RegExp(webSnifferURLLocation);
  			var matchResult = webSnifferRegExp.exec(resultsPage);
  			matchResult = matchResult.toString().replace(webSnifferURLLocationPre, "");
  			matchResult = matchResult.toString().replace(webSnifferURLLocationPost, "");
  			matchResult = matchResult.toString().replace(webSnifferURLLocationQuotes, "");
  			matchResult = matchResult.toString().replace(webSnifferURLLocationQuotes, "");
  			counter = counter + 1;
      }
      else {
      	//alert ("Couldn't match");
      	//The page couldn't be scraped using the current scraper
      	//alert ("This page (" + requestURL + ")doesn't have any code written to scrape it:" + resultsPage)
      }
      if (searchService == "baidu"){
		    if (counter == 0){
		    	matchResult = "http://www.baidu.com" + matchResult;
		    }
	    }
      counter = counter + 1;
	    if (counter == 2){
	    	var targetElement = getElementByHref (originalURL);
	    	var newURL = decodeURIComponent(matchResult)
	    	newURL = newURL.replace(";&amp", "&");
	    	targetElement.href = newURL;
	    	if (resultsCounter == numOfResults){
	    		endOfProcessing();
	    	}
	    	else {
	    		resultsCounter = resultsCounter + 1;
	    	}
	    }
	    else{
				webSnifferIt(matchResult, originalURL, counter, searchService);
			}
	  }
	  else
	  	dump("Error loading page\n");
	  }
	}
	req.send(null); 
}

function getElementByHref (targetURL){
	var allLinks, thisLink;
	var xPath = "//a[contains(@href, '" + targetURL + "')]";
	allLinks = content.document.evaluate(
   	xPath,
   	content.document,
   	null,
   	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
   	null);
  for (var i = 0; i < allLinks.snapshotLength; i++) {
   	thisLink = allLinks.snapshotItem(i);
   	return thisLink;
  }
}

function endOfProcessing() {
	var decodeURLImage = document.getElementById("decodeurl-status-image");
	var adProvider = loadAdCompanyPrefs1 ();	
	adHighlighter (true, true, adProvider);
	decodeURLImage.image = decodeURLImage.oldImage;
}

function LOG(msg) {
  var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
                                 .getService(Components.interfaces.nsIConsoleService);
  consoleService.logStringMessage(msg);
}
