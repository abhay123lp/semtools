window.addEventListener("load", loadKeywordCreator, true);

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
	clearFieldsButton.addEventListener("click", clearAllFields, false);
	textBoxOne.select();
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
	var textBoxOne = document.getElementById("textbox-one");
	var textBoxTwo = document.getElementById("textbox-two");
	var resultsTextbox = document.getElementById("results-textbox");
	textBoxOne.value = "";
	textBoxTwo.value = "";
	resultsTextbox.value = "";
}

function LOG(msg) {
  var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
                                 .getService(Components.interfaces.nsIConsoleService);
  consoleService.logStringMessage(msg);
}

String.prototype.trim = function() {
   return this.replace(/^\s+|\s+$/g, "");
 }