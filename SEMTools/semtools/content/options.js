
var cardCount = 1;

//maybe the labels can be seperated and put in a stack below the others
document.addEventListener('paneload', loadAdPreferences, false);

function loadAdPreferences (){
	var adHighlighterList = document.getElementById('adhighlighter-listbox');
	var list = adHighlighterList.getElementsByTagName('listitem');
	if (list.length < 1){
		var adHighlighterDeck = document.getElementById('adhighlighter-deck');
		var adHighlighterPrefs = document.getElementById('adhighlighter-preferences');
		var numOfCards = getPrefCount("adhighlighter.", 5, 17);
		cardCount = 1;
		for(cardCount; cardCount <= numOfCards; cardCount++){
			createPreference(adHighlighterPrefs, cardCount, ".companyName", ".displayName", ".colour", ".matchString", ".companyURL");
			var listitem = document.createElement("listitem");
			var prefName = "adcompany" + cardCount
			var companyprefName = prefName + ".companyName"
			listitem.setAttribute("preference", companyprefName);
			listitem.index = cardCount-1;
			adHighlighterList.appendChild(listitem);
			var adDeckBox = document.createElement("vbox");
			adDeckBox.id = "adcompany" + cardCount;
			adDeckBox.index = cardCount;
			adHighlighterDeck.appendChild(adDeckBox);
			createTextBoxes(adDeckBox, cardCount, ".companyName", ".displayName", ".matchString", ".companyURL");
			var colorPicker = document.createElement("colorpicker");
			var colorprefName = prefName + ".colour"
			colorPicker.setAttribute("preference", colorprefName);
			colorPicker.setAttribute("type", "button");
			adDeckBox.appendChild(colorPicker);
			//adHighlighterList.selectedIndex=0;
		}
	}
	adHighlighterList.selectedIndex = "0";
	adHighlighterList.focus();
	changeIndex();
	adHighlighterList.addEventListener('select', function (){changeIndex();},false);
}



function createPreference(adHighlighterPrefs, cardCount){
	for (var i = 2; i < arguments.length; i++){
		var preference = document.createElement("preference");
		preference.setAttribute("id", "adcompany" + cardCount + arguments[i]);
		preference.setAttribute("name", "extensions.semtools.adhighlighter.adcompany" + cardCount + arguments[i]);
		preference.setAttribute("type", "string");
		adHighlighterPrefs.appendChild(preference);
	}
}

function createTextBoxes(adDeckBox, cardCount){
	for (var i = 2; i < arguments.length; i++){
		//put labels here if necessary
		var textbox = document.createElement("textbox");
		textbox.setAttribute("preference", "adcompany" + cardCount + arguments[i]);
		adDeckBox.appendChild(textbox);
	}
}

document.addEventListener('DOMContentLoaded', setListNames, false);

function setListNames (){
	var adHighlighterList = document.getElementById('adhighlighter-listbox');
	var list = adHighlighterList.getElementsByTagName('listitem');
	for (var i = 0; i < list.length; i++){
		var thisValue = list[i].getAttribute("checked");
		list[i].setAttribute("label", thisValue);
	}
}

function changeIndex(){
		var adHighlighterList = document.getElementById('adhighlighter-listbox');
		var index = adHighlighterList.selectedIndex;
		var adHighlighterDeck = document.getElementById('adhighlighter-deck');
		adHighlighterDeck.selectedIndex = index;
}

function getPrefCount(branch, divisor, extras){
	//need to move the preferences for selinks and adcompanies down one level into their own branch.
	var extensionPath = "extensions.semtools.";
	var startPoint = extensionPath + branch
	var prefBranch = Components.classes["@mozilla.org/preferences-service;1"].
														 getService(Components.interfaces.nsIPrefService).
														 getBranch(startPoint);
	var children = prefBranch.getChildList("", {});
	//If I put a variable or a number instead of {} do I get the count?
	var prefCount = (children.length - extras) / divisor;
	prefCount = Math.floor(prefCount);
	return prefCount;
}


function myDump(aMessage) {
  var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
                                 .getService(Components.interfaces.nsIConsoleService);
  consoleService.logStringMessage("My component: " + aMessage);
}

//Int SE Links
document.addEventListener('paneload', loadIntSEPreferences, false);

function loadIntSEPreferences (){
	var intSELinksList = document.getElementById('selinks-listbox');
	var list = intSELinksList.getElementsByTagName('listitem');
	if (list.length < 1){
		var intSELinksDeck = document.getElementById('intselinks-deck');
		var intSELinksPrefs = document.getElementById('intselinks-preferences');
		var numOfCards = getPrefCount("selinks.", 6, 3);
		cardCount = 1;
		for(cardCount; cardCount <= numOfCards; cardCount++){
			createSEPreference(intSELinksPrefs, cardCount, ".searchEngineName", ".displayName", ".domainName", ".queryParameter", ".urlFormat", ".spaceSeperator");
			var listitem = document.createElement("listitem");
			var prefName = "selinks.searchengine" + cardCount
			var companyprefName = prefName + ".searchEngineName"
			listitem.setAttribute("preference", companyprefName);
			listitem.index = cardCount-1;
			intSELinksList.appendChild(listitem);
			var intSELinksDeckBox = document.createElement("vbox");
			intSELinksDeckBox.id = "searchengine" + cardCount;
			intSELinksDeckBox.index = cardCount;
			intSELinksDeck.appendChild(intSELinksDeckBox);
			createSETextBoxes(intSELinksDeckBox, cardCount, ".searchEngineName", ".displayName", ".domainName", ".queryParameter", ".urlFormat", ".spaceSeperator");
		}
	}
	intSELinksList.selectedIndex = 0;
	intSELinksList.focus();
	changeSEIndex(0);
	intSELinksList.addEventListener('select', function (){changeSEIndex();},false);
}

function createSEPreference(intSELinksPrefs, cardCount){
	for (var i = 2; i < arguments.length; i++){
		var preference = document.createElement("preference");
		preference.setAttribute("id", "selinks.searchengine" + cardCount + arguments[i]);
		preference.setAttribute("name", "extensions.semtools.selinks.searchengine" + cardCount + arguments[i]);
		preference.setAttribute("type", "string");
		intSELinksPrefs.appendChild(preference);
	}
}

function createSETextBoxes(intSELinksDeckBox, cardCount){
	for (var i = 2; i < arguments.length; i++){
		//put labels here if necessary
		var textbox = document.createElement("textbox");
		textbox.setAttribute("preference", "selinks.searchengine" + cardCount + arguments[i]);
		intSELinksDeckBox.appendChild(textbox);
	}
}

document.addEventListener('DOMContentLoaded', setSEListNames, false);

function setSEListNames (){
	var intSELinksList = document.getElementById('selinks-listbox');
	var list = intSELinksList.getElementsByTagName('listitem');
	for (var i = 0; i < list.length; i++){
		var thisValue = list[i].getAttribute("checked");
		list[i].setAttribute("label", thisValue);
	}
}

function changeSEIndex(){
	var intSELinksList = document.getElementById('selinks-listbox');
		var index = intSELinksList.getSelectedItem(0).index;
		var intSELinksDeck = document.getElementById('intselinks-deck');
		intSELinksDeck.selectedIndex = index;
}

document.addEventListener('DOMContentLoaded', addDeleteButtonMessage, false);

function addDeleteButtonMessage (){
var addDeleteMessage = "Sorry, the Add and Delete buttons do not work in this version of SEM Tools. There are some blank preferences that you can use to add new items.";

var adHighlighterAddButton = document.getElementById('adhighlighter-add-button');
var adHighlighterDeleteButton = document.getElementById('adhighlighter-delete-button');
adHighlighterAddButton.addEventListener('click', adHighlighterAdd, false);
adHighlighterDeleteButton.addEventListener('click', adHighlighterDelete, false);

function adHighlighterAdd () {
alert (addDeleteMessage)
}

function adHighlighterDelete () {
alert (addDeleteMessage)
}

var inSELinksAddButton = document.getElementById('selinks-add-button');
var inSELinksDeleteButton = document.getElementById('selinks-delete-button');
inSELinksAddButton.addEventListener('click', inSELinksAdd, false);
inSELinksDeleteButton.addEventListener('click', inSELinksDelete, false);

function inSELinksAdd () {
alert (addDeleteMessage)
}

function inSELinksDelete () {
alert (addDeleteMessage)
}
}