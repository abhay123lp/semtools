window.addEventListener("load", loadAllTabs, true);

function loadAllTabs () {
	loadKeywordCreator ()
	loadKeywordReplacer ()
	loadKeywordGrouper ()
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