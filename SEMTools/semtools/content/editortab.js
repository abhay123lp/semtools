window.addEventListener("load", loadAllTabs, true);

function loadAllTabs () {
	loadKeywordCreator ()
	loadKeywordReplacer ()
	loadKeywordGrouper ()
	loadKeywordCleaner ()
}

function loadKeywordCreator (){
	var joinKeywordsButton = document.getElementById("join-keywords-button");
	var textBoxOne = document.getElementById("textbox-one");
	var textBoxTwo = document.getElementById("textbox-two");
	var joinType = document.getElementById("join-type-selection");
	var resultsTextbox = document.getElementById("results-textbox");
	var clearFieldsButton = document.getElementById("clear-fields-button");
	var negativeCheckBox = document.getElementById("negative-checkbox");
	var seperator = " ";
	joinKeywordsButton.addEventListener("click", function () {joinKeywords(textBoxOne.value, textBoxTwo.value, joinType.selectedItem.value, seperator, negativeCheckBox);}, false);
	clearFieldsButton.addEventListener("click", function () {clearAllFields("textbox-one", "textbox-two", "results-textbox");}, false);
	textBoxOne.select();
}

function loadKeywordReplacer () {
	var replaceKeywordsButton = document.getElementById("replace-button");
	var textBoxOne = document.getElementById("replace-textbox-one");
	var textBoxTwo = document.getElementById("replace-textbox-two");
	var resultsTextbox = document.getElementById("replacer-results-textbox");
	var clearFieldsButton = document.getElementById("clear-replacer-fields-button");
	replaceKeywordsButton.addEventListener("click", function () {replaceKeywords(textBoxOne.value, textBoxTwo.value);}, false);
	clearFieldsButton.addEventListener("click", function () {clearAllFields("replace-textbox-one", "replace-textbox-two", "replacer-results-textbox");}, false);
}

function loadKeywordGrouper () {
	var groupKeywordsButton = document.getElementById("group-button");
	var textBoxOne = document.getElementById("group-textbox-one");
	var textBoxTwo = document.getElementById("group-textbox-two");
	var resultsTextbox = document.getElementById("grouper-results-textbox");
	var clearFieldsButton = document.getElementById("clear-grouper-fields-button");
	groupKeywordsButton.addEventListener("click", function () {groupKeywords(textBoxOne.value, textBoxTwo.value);}, false);
	clearFieldsButton.addEventListener("click", function () {clearAllFields("group-textbox-one", "group-textbox-two", "grouper-results-textbox");}, false);
}

var KWCreator = {};

function loadKeywordCleaner () {
	var cleanKeywordsButton = document.getElementById("clean-button");
	var keywordsToClean = document.getElementById("keywords-to-clean-textbox");
	var badWordsGroupCheckBox = document.getElementById("bad-words-group-checkbox");
	var duplicateGroupCheckBox = document.getElementById("duplicate-group-checkbox");
	var sortGroupCheckBox = document.getElementById("sort-group-checkbox");
	var clearFieldsButton = document.getElementById("clear-cleaner-fields-button");
	badWordsGroupCheckBox.addEventListener("click", function () {disableBadWordsGroup(badWordsGroupCheckBox);},false);
	duplicateGroupCheckBox.addEventListener("click", function () {disableDuplicateGroup(duplicateGroupCheckBox);},false);
	sortGroupCheckBox.addEventListener("click", function () {disableSortGroup(sortGroupCheckBox);},false);
	cleanKeywordsButton.addEventListener("click", function () {cleanKeywords(keywordsToClean.value);}, false);
	clearFieldsButton.addEventListener("click", function () {clearAllFields("keywords-to-clean-textbox", "bad-words-textbox", "cleaner-cleaned-list-textbox", "cleaner-duplicates-textbox", "cleaner-bad-phrases-textbox");}, false);

}

function getActionSettings (){
	var actionSettings = [];
	var actionsGroup = document.getElementById("actions-groupbox");
	var allActionItems, thisAction;
	allActionItems = document.evaluate(
    '//*[@id="basic-actions-groupbox"]//*[@id]',
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
	for (var i = 0; i < allActionItems.snapshotLength; i++) {
    thisAction = allActionItems.snapshotItem(i);
    if (thisAction.nodeName == "checkbox"){
    	actionSettings.push([thisAction.id,thisAction.checked]);
		}
	}
	if (document.getElementById("bad-words-group-checkbox").checked){
		if (document.getElementById("bad-words-run-first-checkbox").checked){
			actionSettings.unshift([document.getElementById("bad-words-group-radiogroup").selectedItem.id,true]);
		}
		if (document.getElementById("bad-words-run-last-checkbox").checked){
			actionSettings.push([document.getElementById("bad-words-group-radiogroup").selectedItem.id,true]);
		}
	}
	if (document.getElementById("duplicate-group-checkbox").checked){
		if (document.getElementById("remove-all-duplicate-copies").checked){
			actionSettings.push([document.getElementById("duplicate-group-radiogroup").selectedItem.id + "-remove-copies",true]);
		}
		if (!document.getElementById("remove-all-duplicate-copies").checked){
			actionSettings.push([document.getElementById("duplicate-group-radiogroup").selectedItem.id,true]);
		}
	}
	if (document.getElementById("sort-group-checkbox").checked){
		if (document.getElementById("ignore-case-for-sort").checked){
			actionSettings.push([document.getElementById("sort-group-radiogroup").selectedItem.id + "-ignore-case",true]);
		}
		if (!document.getElementById("ignore-case-for-sort").checked){
			actionSettings.push([document.getElementById("sort-group-radiogroup").selectedItem.id,true]);
		}
	}
	return actionSettings;
}

function cleanKeywords (keywords, badKeywords){
	var keywordColumnIndex = (document.getElementById("keywordColumnNumber").value) - 1;
	KWCreator.keywordColumnIndex = keywordColumnIndex;
	var keywordSeperator = "\t";
	var keywordHasHeader = document.getElementById("keywordHasHeader").checked;
	var badKeywords = document.getElementById("bad-words-textbox").value;
	var badPhrases;
	badKeywords = badKeywords.split("\n");
	for (var i=0; i<badKeywords.length; i++){
		if (badKeywords[i] == ""){
			badKeywords.slice(i,i);
		}
	}
	//LOG (badKeywords);
	var actionSettings = getActionSettings ();
	keywords = keywords.split(/\n/g);
	if (keywordHasHeader){
		var header = keywords.shift();
	}
	for (var i=0; i<keywords.length; i++){
		keywords[i] = keywords[i].split(/\t/g);
	}
	for (var i=0; i<actionSettings.length; i++){
		if (actionSettings[i][1] == true){
			var resultSet = cleanKeywordsActions (keywords, actionSettings[i][0], keywordColumnIndex, badKeywords);
			keywords = resultSet[0];
			badPhrases = resultSet[1];
		}
	}
	for (var i=0; i<keywords.length; i++){
		keywords[i] = keywords[i].join("\t");
	}
	if (badPhrases != ""){
		for (var i=0; i<badPhrases.length; i++){
			badPhrases[i] = badPhrases[i].join("\t");
		}
	}
	if (keywordHasHeader){
		keywords.unshift(header);
		if (badPhrases != ""){
			badPhrases.unshift(header);
		}
	}
	//alert (badPhrases);
	var finalResult = keywords.join("\n");
	var cleanListTextbox = document.getElementById("cleaner-cleaned-list-textbox");
	if (badPhrases != ""){
		var finalBadKeywordsResult = badPhrases.join("\n");
		var badPhrasesListTextbox = document.getElementById("cleaner-bad-phrases-textbox");
		badPhrasesListTextbox.value = finalBadKeywordsResult;
	}
	cleanListTextbox.value = finalResult;
	cleanListTextbox.select();
}

function cleanKeywordsActions (keywords, action, keywordColumnIndex, badWords) {
	switch (action) {
		case "to-lower-case":
			for (var i=0; i<keywords.length; i++){
				//do somethings to keywords[i][keywordColumnIndex]
				if((keywords[i][keywordColumnIndex])){
					keywords[i][keywordColumnIndex] = keywords[i][keywordColumnIndex].toLowerCase();
				}
			}
			break;
		case "remove-numerals":
			for (var i=0; i<keywords.length; i++){
				//do somethings to keywords[i][keywordColumnIndex]
				var regEx = new RegExp("[0-9]", "gi");
				var replacer = "";
				if((keywords[i][keywordColumnIndex])){
					keywords[i][keywordColumnIndex] = keywords[i][keywordColumnIndex].replace(regEx, replacer);
				}
			}
			break;
		case "remove-end-spaces":
			for (var i=0; i<keywords.length; i++){
				//do somethings to keywords[i][keywordColumnIndex]
				var regEx = new RegExp("^\\s+|\\s+$", "gi");
				var replacer = "";
				if((keywords[i][keywordColumnIndex])){
					keywords[i][keywordColumnIndex] = keywords[i][keywordColumnIndex].replace(regEx, replacer);
				}
			}			
			break;
		case "remove-double-spaces":
			for (var i=0; i<keywords.length; i++){
				//do somethings to keywords[i][keywordColumnIndex]
				var regEx = new RegExp("\\s{2,}", "gi");
				var replacer = " ";
				if((keywords[i][keywordColumnIndex])){
					keywords[i][keywordColumnIndex] = keywords[i][keywordColumnIndex].replace(regEx, replacer);
				}
			}			
			break;
		case "remove-bad-characters":
			for (var i=0; i<keywords.length; i++){
				//do somethings to keywords[i][keywordColumnIndex]
				var regEx = new RegExp("\!|\"|\#", "gi");//Need to get this regex from Perl script
				var replacer = " ";
				if((keywords[i][keywordColumnIndex])){
					keywords[i][keywordColumnIndex] = keywords[i][keywordColumnIndex].replace(regEx, replacer);
				}
			}			
			break;
		case "remove-bad-words":
			for (var i=0; i<keywords.length; i++){
				//do somethings to keywords[i][keywordColumnIndex]
				for (var j=0; j<badWords.length; j++){
					if((keywords[i][keywordColumnIndex])){
						if (keywords[i][keywordColumnIndex].match(badWords[j])){
							var regex = new RegExp(badWords[j], "g");
							keywords[i][keywordColumnIndex] = keywords[i][keywordColumnIndex].replace(regex,"");
						}
					}
				}
			}			
			break;
		case "remove-bad-phrases":
			var badPhraseIndexes = [];
			for (var i=0; i<keywords.length; i++){
				//do somethings to keywords[i][keywordColumnIndex]
				for (var j=0; j<badWords.length; j++){
					if((keywords[i][keywordColumnIndex])){
						if (keywords[i][keywordColumnIndex].match(badWords[j])){
							badPhraseIndexes.push(i);
						}
					}
				}
			}
			var badPhrases = [];
			for (var i=0; i<badPhraseIndexes.length; i++){
				var badPhrase = keywords[badPhraseIndexes[i]];
				keywords.splice(badPhraseIndexes[i],1);
				badPhrases.push(badPhrase);
			}
			break;
		case "remove-duplicate-words":
			alert ("remove-duplicate-words");
			for (var i=0; i<keywords.length; i++){
				//do somethings to keywords[i][keywordColumnIndex]
				
			}
			break;
		case "remove-duplicate-words-ignore-case":
			alert ("remove-duplicate-words-ignore-case");
			for (var i=0; i<keywords.length; i++){
				//do somethings to keywords[i][keywordColumnIndex]
				
			}
			break;
		case "remove-duplicate-words-remove-copies":
			alert ("remove-duplicate-words-remove-copies");
			for (var i=0; i<keywords.length; i++){
				//do somethings to keywords[i][keywordColumnIndex]
				
			}
			break;
		case "remove-duplicate-words-ignore-case-remove-copies":
			alert ("remove-duplicate-words-ignore-case-remove-copies");
			for (var i=0; i<keywords.length; i++){
				//do somethings to keywords[i][keywordColumnIndex]
				
			}
			break;
		case "sort-ascending":
			keywords.sort(sortAscending);
			break;
		case "sort-descending":
			keywords.sort(sortAscending);
			keywords.reverse();
			break;
		case "sort-ascending-ignore-case":
			keywords.sort(sortAscendingIgnoreCase);
			break;
		case "sort-descending-ignore-case":
			keywords.sort(sortAscendingIgnoreCase);
			keywords.reverse();
			break;
	}
	if (!badPhrases){
		badPhrases = "";
	}
	return [keywords,badPhrases];
}

function sortAscendingIgnoreCase (a,b) {
	var firstWord = String(a[KWCreator.keywordColumnIndex]).toLowerCase();
  var secondWord = String(b[KWCreator.keywordColumnIndex]).toLowerCase();
  if (firstWord > secondWord){
    return 1;
  } 
  if (firstWord < secondWord){
    return -1;
  } 
  return 0; 
}

function sortAscending (a,b) {
	var firstWord = String(a[KWCreator.keywordColumnIndex]);
  var secondWord = String(b[KWCreator.keywordColumnIndex]);
  if (firstWord > secondWord){
    return 1;
  } 
  if (firstWord < secondWord){
    return -1;
  } 
  return 0; 
}

function disableBadWordsGroup(checkBox){
	var groupsToDisable = ["bad-words-group-radiogroup", "bad-words-run-group"];
	for (var i=0; i<groupsToDisable.length; i++){
		badWordsGroup = document.getElementById(groupsToDisable[i]);
		for (var j=0; j<badWordsGroup.childNodes.length; j++){
			badWordsGroup.childNodes[j].disabled = !(checkBox.checked);
		}
	}
}

function disableDuplicateGroup(checkBox){
	radioGroup = document.getElementById("duplicate-group-radiogroup");
	for (var i=0; i<radioGroup.childNodes.length; i++){
		radioGroup.childNodes[i].disabled = !(checkBox.checked);
	}
}

function disableSortGroup(checkBox){
	radioGroup = document.getElementById("sort-group-radiogroup");
	for (var i=0; i<radioGroup.childNodes.length; i++){
		radioGroup.childNodes[i].disabled = !(checkBox.checked);
	}
}

function groupKeywords (firstSet, secondSet) {
	var arrays = [firstSet, secondSet];
	for (var i = 0; i < arrays.length; i++){
		var thisArray = arrays[i].replace(/\n\n/g, "\n");
		while (thisArray.match(/\n\n/g)){
			thisArray = thisArray.replace(/\n\n/g, "\n");
		}
		var returnArray = [];
		returnArray = thisArray.split(/\n/g);
		returnArray.reverse();
		for (var j = 0; j < returnArray.length; j++){
			returnArray[j] = returnArray[j].trim();
			if (returnArray[j].match(/^$/)){
				returnArray.splice(j,1);
			}
		}
		returnArray.reverse();
		thisArray = returnArray;
		arrays[i] = thisArray;
	}
	var result = groupArrays (arrays[0], arrays[1]);
	var finalResult = result[0];
	var remainingWords = result[1];
	remainingWords = remainingWords.join("\n");
	var remainderTextbox = document.getElementById("grouper-remainder-textbox");
	remainderTextbox.value = remainingWords;
	finalResult = finalResult.join("\n");
	var resultsTextbox = document.getElementById("grouper-results-textbox");
	resultsTextbox.value = finalResult;
	resultsTextbox.select();
}

function groupArrays (firstArray, secondArray){
	var regExOptions = "gi";
	var finalResult = [];
	var joiner = "\t";
	for (var i = 0; i < firstArray.length; i++){
		var firstWord = firstArray[i];
		for (var j = 0; j < secondArray.length; j++){
			secondWord = secondArray[j].split("\t")
			var regEx = new RegExp(secondWord[0], regExOptions);
			var group = secondWord[1];
			if (group == undefined){
				replacer = "";
			}
			if (firstWord.match(regEx)){
							//alert (firstWord);
			
				firstWord = group + joiner + firstWord;
				finalResult.push(firstWord);
				firstArray.splice((i),1);
				//alert (firstArray[i]);
				i = i - 1;
				break;
			}
		}
	}
	return [finalResult, firstArray];
}

function replaceKeywords (firstSet, secondSet) {
	var globalMatch = document.getElementById("global-match-checkbox");
	var ignoreCase = document.getElementById("ignore-case-checkbox");
	if (globalMatch.checked == true){
		var regExGlobal = "g";
	}
	else {
		var regExGlobal = "";
	}
	if (ignoreCase.checked == true){
		var regExCase = "i";
	}
	else {
		var regExCase = "";
	}
	var regExOptions = regExGlobal + regExCase;
	var arrays = [firstSet, secondSet];
	for (var i = 0; i < arrays.length; i++){
		var thisArray = arrays[i].replace(/\n\n/g, "\n");
		while (thisArray.match(/\n\n/g)){
			thisArray = thisArray.replace(/\n\n/g, "\n");
		}
		var returnArray = [];
		returnArray = thisArray.split(/\n/g);
		returnArray.reverse();
		for (var j = 0; j < returnArray.length; j++){
			returnArray[j] = returnArray[j].trim();
			if (returnArray[j].match(/^$/)){
				returnArray.splice(j,1);
			}
		}
		returnArray.reverse();
		thisArray = returnArray;
		arrays[i] = thisArray;
	}
	var finalResult = replaceArrays (arrays[0], arrays[1], regExOptions);
	finalResult = finalResult.join("\n");
	var resultsTextbox = document.getElementById("replacer-results-textbox");
	resultsTextbox.value = finalResult;
	resultsTextbox.select();
}

function replaceArrays (firstArray, secondArray, regExOptions) {
	var finalResult = [];
	for (var i = 0; i < firstArray.length; i++){
		var firstWord = firstArray[i];
		for (var j = 0; j < secondArray.length; j++){
			secondWord = secondArray[j].split("\t")
			var regEx = new RegExp(secondWord[0], regExOptions);
			var replacer = secondWord[1];
			if (replacer == undefined){
				replacer = "";
			}
			firstWord = firstWord.replace(regEx, replacer);
		}
		finalResult.push(firstWord);
	}
	return finalResult;
}

function joinKeywords (firstSet, secondSet, joinType, seperator, negativeCheckBox){
	var arrays = [firstSet, secondSet];
	for (var i = 0; i < arrays.length; i++){
		var thisArray = arrays[i];
		var returnArray = [];
		returnArray = thisArray.split(/\n/g);
		for (var j = 0; j < returnArray.length; j++){
			returnArray[j] = returnArray[j].trim();
		}
		thisArray = returnArray;
		arrays[i] = thisArray;
	}
	var finalResult = joinArrays (arrays[0], arrays[1], seperator);
	var modifyingSymbolFront = "";
	var modifyingSymbolBack = "";
	switch (joinType){
		case "phrase":
			modifyingSymbolFront = '"';
			modifyingSymbolBack = '"';
			break;
		case "exact":
			modifyingSymbolFront = '[';
			modifyingSymbolBack = ']';
			break;
		case "default":
			//This includes "broad"
			modifyingSymbolFront = '';
			modifyingSymbolBack = '';
			break;
	}
	var negativeCheckBox = document.getElementById("negative-checkbox");
	if (negativeCheckBox.checked == true){
		modifyingSymbolFront = "-" + modifyingSymbolFront;
	}
	for (var i = 0; i < finalResult.length; i++){
		finalResult[i] = modifyingSymbolFront + finalResult[i] + modifyingSymbolBack;
	}
	finalResult = finalResult.join("\n");
	var resultsTextbox = document.getElementById("results-textbox");
	resultsTextbox.value = finalResult;
	resultsTextbox.select();
}

function joinArrays (firstArray, secondArray, seperator){
	var finalResult = [];
	for (var i = 0; i < firstArray.length; i++){
		var firstWord = firstArray[i];
		for (var j = 0; j < secondArray.length; j++){
			var secondWord = secondArray[j];
			var combinedWord = firstWord + seperator + secondWord;
			finalResult.push(combinedWord);
		}
	}
	return finalResult;
}

function clearAllFields () {
	for (var i = 0; i < arguments.length; i++){
		var thisField = document.getElementById(arguments[i]);
		thisField.value = "";
	}
}

function LOG(msg) {
  var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
                                 .getService(Components.interfaces.nsIConsoleService);
  consoleService.logStringMessage(msg);
}

String.prototype.trim = function() {
   return this.replace(/^\s+|\s+$/g, "");
 }