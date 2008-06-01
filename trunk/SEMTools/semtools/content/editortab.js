window.addEventListener("load", loadAllTabs, true);

function loadAllTabs () {
	loadKeywordCreator ()
	loadKeywordReplacer ()
	loadKeywordGrouper ()
	loadKeywordCleaner ()
	loadListListeners ()
	window.removeEventListener("load", loadAllTabs, true);
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
		actionSettings.push(["remove-long-phrases-checkbox",document.getElementById("remove-long-phrases-checkbox").checked]);
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
	KWCreator.maxWordsPerPhrase = document.getElementById("max-words-per-phrase").value;
	var keywordSeperator = "\t";
	var keywordHasHeader = document.getElementById("keywordHasHeader").checked;
	var badKeywords = document.getElementById("bad-words-textbox").value;
	var badPhrases;
	var duplicates;
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
			duplicates = resultSet[2];
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
	if (duplicates != ""){
		var finalDuplicatesResult = duplicates.join("\n");
		var duplicatesListTextbox = document.getElementById("cleaner-duplicates-textbox");
		duplicatesListTextbox.value = finalDuplicatesResult;
	}
	cleanListTextbox.value = finalResult;
	cleanListTextbox.select();
}

function cleanKeywordsActions (keywords, action, keywordColumnIndex, badWords, duplicates) {
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
				var regEx = new RegExp("\\W", "gi");//replace all non-word characters with spaces
				//need to have something for HTML Codes eg. %2B etc.
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
		case "remove-long-phrases-checkbox":
			for (var i=0; i<keywords.length; i++){
				//do somethings to keywords[i][keywordColumnIndex]
				var regexStringBase = "\\w\\s";
				var regexString = "";
				for (var j=0; j<KWCreator.maxWordsPerPhrase; j++){
					regexString += regexStringBase;
				}
				var regEx = new RegExp(regexString, "i");
				if ((keywords[i][keywordColumnIndex].search(regEx)) >= 0){
					var badPhrases = [];
					badPhrases.push(keywords.splice(i,1));
				}
			}
			break;
		case "remove-duplicate-words":
			alert ("remove-duplicate-words");
			var dedupedResult = removeDuplicates (keywords, keywordColumnIndex, false, false)
			keywords = dedupedResult[0];
			duplicates = dedupedResult[1];
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
	return [keywords,badPhrases,duplicates];
}

function removeDuplicates (keywords, keywordColumnIndex, ignoreCase, removeAll){
	//alert (keywords.length);
	var uniqueKeywords = [];
	var duplicateKeywords = [];
	for (var i=0; i<keywords.length; i++){
		var firstKeyword = keywords[i][keywordColumnIndex];
		//alert (uniqueKeywords.length);
		if (uniqueKeywords.length > 0){
			for (var j=0; j<uniqueKeywords.length; j++){
				alert (uniqueKeywords[j]);
				var secondKeyword = uniqueKeywords[j][keywordColumnIndex];
				if (ignoreCase){
					firstKeyword = firstKeyword.toLowerCase();
					secondKeyword = secondKeyword.toLowerCase();
				}
				//alert (firstKeyword + secondKeyword);
				if (firstKeyword == secondKeyword){
						duplicateKeywords.push(keywords[i]);
					if (removeAll){
						duplicateKeywords.push(uniqueKeywords.slice(j,1));
					}
				}
				if (j == (uniqueKeywords.length - 1)){
					uniqueKeywords.push(keywords[i]);
				}
			}
		}
		if (uniqueKeywords.length == 0){
			//alert ("Length 0");
			uniqueKeywords.push(keywords[i]);
		}
	}
	return [uniqueKeywords, duplicateKeywords];
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
	var groupsToDisable = ["bad-words-group-radiogroup", "bad-words-run-group", "max-words-per-phrase-group", "remove-long-phrases-group"];
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
			var regEx = new RegExp(secondWord[1], regExOptions);
			var group = secondWord[0];
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

function changeListOrder (topId, target){
	//alert (target);
	if(!topId){
		var topChild = target.parentNode;
	}
	else {
		var topChild = getThisBranchChildBelowTop (topId, target);
	}
	var whereTo = target.whereTo;
	var parent = topChild.parentNode;
	switch (whereTo){
		case "up":
			if (parent.firstChild != topChild){
				parent.insertBefore(topChild, topChild.previousSibling);
			}
			break;
		case "down":
			if (parent.lastChild != topChild){
				parent.insertBefore(topChild, topChild.nextSibling.nextSibling);
			}
			break;
		case "top":
			if (parent.firstChild != topChild){
				parent.insertBefore(topChild, parent.firstChild);
			}
			break;
		case "bottom":
			if (parent.lastChild != topChild){
				parent.insertBefore(topChild, parent.lastChild.nextSibling);
			}
			break;
		case "remove":
				parent.removeChild(topChild);
			break;
	}
}

function getThisBranchChildBelowTop (topId, thisElement){
	var topElement = document.getElementById(topId);
	var topChild;
	while (thisElement.parentNode != topElement){
		thisElement = thisElement.parentNode;
	}
	topChild = thisElement;
	return topChild;
}

function appendToList (listTopId){
	//alert (listTopId);
	var xmlToAppend;
	switch (listTopId){
		case "grouper-rule-list":
			//alert ("grouper");
			var xmlElementToAppend = document.createElement("hbox");
			var description1 = document.createElement("description");
			description1.setAttribute("value","Group Name");
			xmlElementToAppend.appendChild(description1);
			var textbox1 = document.createElement("textbox");
			xmlElementToAppend.appendChild(textbox1);
			var description2 = document.createElement("description");
			description2.setAttribute("value","Match");
			xmlElementToAppend.appendChild(description2);
			var textbox2 = document.createElement("textbox");
			xmlElementToAppend.appendChild(textbox2);
			var button1 = document.createElement("button");
			button1.setAttribute("label","Edit");
			xmlElementToAppend.appendChild(button1);
			var button2 = document.createElement("button");
			button2.setAttribute("label","X");
			button2.setAttribute("class","whereTo");
			button2.setAttribute("whereTo","remove");
			xmlElementToAppend.appendChild(button2);
			var button3 = document.createElement("button");
			button3.setAttribute("label","^");
			button3.setAttribute("class","whereTo");
			button3.setAttribute("whereTo","up");
			xmlElementToAppend.appendChild(button3);
			var button4 = document.createElement("button");
			button4.setAttribute("label","T");
			button4.setAttribute("class","whereTo");
			button4.setAttribute("whereTo","top");
			xmlElementToAppend.appendChild(button4);
			var button5 = document.createElement("button");
			button5.setAttribute("label","D");
			button5.setAttribute("class","whereTo");
			button5.setAttribute("whereTo","down");
			xmlElementToAppend.appendChild(button5);
			var button6 = document.createElement("button");
			button6.setAttribute("label","B");
			button6.setAttribute("class","whereTo");
			button6.setAttribute("whereTo","bottom");
			xmlElementToAppend.appendChild(button6);
			/*
			var xmlStringToAppend = '<hbox>' +
				'<textbox label="Group Name"/>' +
				'<textbox label="Match"/>' +
				'<button label="Edit"/>' +
				'<button label="X" class="whereTo" whereTo="remove"/>' +
				'<button label="^" class="whereTo" whereTo="up"/>' +
				'<button label="T" class="whereTo" whereTo="top"/>' +
				'<button label="D" class="whereTo" whereTo="down"/>' +
				'<button label="B" class="whereTo" whereTo="bottom"/>' +
			'</hbox>';
			var parser = new DOMParser ();
			xmlToAppend = parser.parseFromString(xmlStringToAppend, "application/xml");
			*/
			xmlToAppend = xmlElementToAppend;
			break;
		case "replacer-rule-list":
			var xmlElementToAppend = document.createElement("hbox");
			var description1 = document.createElement("description");
			description1.setAttribute("value","Replace");
			xmlElementToAppend.appendChild(description1);
			var textbox1 = document.createElement("textbox");
			xmlElementToAppend.appendChild(textbox1);
			var description2 = document.createElement("description");
			description2.setAttribute("value","with");
			xmlElementToAppend.appendChild(description2);
			var textbox2 = document.createElement("textbox");
			xmlElementToAppend.appendChild(textbox2);
			var button1 = document.createElement("button");
			button1.setAttribute("label","Edit");
			xmlElementToAppend.appendChild(button1);
			var button2 = document.createElement("button");
			button2.setAttribute("label","X");
			button2.setAttribute("class","whereTo");
			button2.setAttribute("whereTo","remove");
			xmlElementToAppend.appendChild(button2);
			var button3 = document.createElement("button");
			button3.setAttribute("label","^");
			button3.setAttribute("class","whereTo");
			button3.setAttribute("whereTo","up");
			xmlElementToAppend.appendChild(button3);
			var button4 = document.createElement("button");
			button4.setAttribute("label","T");
			button4.setAttribute("class","whereTo");
			button4.setAttribute("whereTo","top");
			xmlElementToAppend.appendChild(button4);
			var button5 = document.createElement("button");
			button5.setAttribute("label","D");
			button5.setAttribute("class","whereTo");
			button5.setAttribute("whereTo","down");
			xmlElementToAppend.appendChild(button5);
			var button6 = document.createElement("button");
			button6.setAttribute("label","B");
			button6.setAttribute("class","whereTo");
			button6.setAttribute("whereTo","bottom");
			xmlElementToAppend.appendChild(button6);
			/*
			var xmlStringToAppend = '<hbox>' +
				'<textbox label="Replace"/>' +
				'<textbox label="with"/>' +
				'<button label="Edit"/>' +
				'<button label="X" class="whereTo" whereTo="remove"/>' +
				'<button label="^" class="whereTo" whereTo="up"/>' +
				'<button label="T" class="whereTo" whereTo="top"/>' +
				'<button label="D" class="whereTo" whereTo="down"/>' +
				'<button label="B" class="whereTo" whereTo="bottom"/>' +
			'</hbox>';
			var parser = new DOMParser ();
			xmlToAppend = parser.parseFromString(xmlStringToAppend, "application/xml");
			*/
			xmlToAppend = xmlElementToAppend;
			break;
	}
	var currentList = document.getElementById(listTopId);
	currentList.appendChild(xmlToAppend);
	//currentList.lastChild.getElementsByTagName("textbox")[0].select();
	return currentList.lastChild;
}

function getArrayFromList(listTopId){
	var ruleListArray = [];
	var thisList = document.getElementById(listTopId);
	for (var i=0; i<thisList.childNodes.length; i++){
		var thisChild = thisList.childNodes[i];
		theseTextboxes = thisChild.getElementsByTagName("textbox");
		//alert ();
		var groupName = theseTextboxes[0].value;
		var groupMatch = theseTextboxes[1].value;
		ruleListArray.push([groupName, groupMatch]);
	}
	//alert (ruleListArray);
	return ruleListArray;
}

function fillListFromArray (listTopId, ruleListArray){
	var thisList = document.getElementById(listTopId);
	//Remove all current lists
	for (var i=0; i<thisList.childNodes.length; i++){
		thisList.removeChild(thisList.childNodes[i]);
	}
	//Add new list and fill in values
	for (var i=0; i<ruleListArray.length; i++){
		var lastChild = appendToList(listTopId);
		lastChild.getElementsByTagName("textbox")[0].value = ruleListArray[i][0];
		lastChild.getElementsByTagName("textbox")[1].value = ruleListArray[i][1];
	}
	//thisList.lastChild.getElementsByTagName("textbox")[0].select();
}

function importRules (importRulesTextboxId, listTopId){
	var importRulesText = document.getElementById (importRulesTextboxId).value;
	var lineSeperator = "\n";
	var tabSeperator = "\t";
	var ruleList = importRulesText.split(lineSeperator);
	var ruleListArray = [];
	for (var i=0; i<ruleList.length; i++){
		ruleListArray.push(ruleList[i].split(tabSeperator));
	}
	fillListFromArray (listTopId, ruleListArray);
}

function exportRules (exportRulesTextboxId, listTopId){
	var exportRulesArray = getArrayFromList(listTopId);
	var lineSeperator = "\n";
	var tabSeperator = "\t";
	for (var i=0; i<exportRulesArray.length; i++){
		exportRulesArray[i].join(tabSeperator);
	}
	var exportRulesText = exportRulesArray.join(lineSeperator);
	var exportRulesTextbox = document.getElementById(exportRulesTextboxId);
	//alert (exportRulesTextbox);
	exportRulesTextbox.value = exportRulesText;
	exportRulesTextbox.hidden = false;
	exportRulesTextbox.select();
}

function loadListListeners (){
	var grouperScopeElementId = "grouper-rule-list";
	var grouperAddToListButton = document.getElementById("grouper-add-to-list-button");
	grouperAddToListButton.addEventListener("click", function (){appendToList("grouper-rule-list");},false);
	var grouperExportButton = document.getElementById("grouper-export-rules-button");
	grouperExportButton.addEventListener("click", function (){exportRules("grouper-export-rules-textbox", grouperScopeElementId);},false);
	var grouperImportButton = document.getElementById("grouper-import-rules-button");
	grouperImportButton.addEventListener("click", function (){importRules("grouper-import-rules-textbox", grouperScopeElementId);},false);
	var grouperShowImportButton = document.getElementById("grouper-show-import-button");
	grouperShowImportButton.addEventListener("click",function (){unhideElement(grouperShowImportButton.nextSibling);},false);

	var replacerScopeElementId = "replacer-rule-list";
	var replacerAddToListButton = document.getElementById("replacer-add-to-list-button");
	replacerAddToListButton.addEventListener("click", function (){appendToList("replacer-rule-list");},false);
	var replacerExportButton = document.getElementById("replacer-export-rules-button");
	replacerExportButton.addEventListener("click", function (){exportRules("replacer-export-rules-textbox", replacerScopeElementId);},false);
	var replacerImportButton = document.getElementById("replacer-import-rules-button");
	replacerImportButton.addEventListener("click", function (){importRules("replacer-import-rules-textbox", replacerScopeElementId);},false);
	var replacerShowImportButton = document.getElementById("replacer-show-import-button");
	replacerShowImportButton.addEventListener("click",function (){unhideElement(replacerShowImportButton.nextSibling);},false);

	var orderableListIds = [["grouper-rule-list", "grouper-add-to-list-button", "grouper-import-rules-textbox", "grouper-import-rules-button", "grouper-export-rules-textbox", "grouper-export-rules-button", "grouper-show-import-button"], 
													["replacer-rule-list", "replacer-add-to-list-button", "replacer-import-rules-textbox", "replacer-import-rules-button", "replacer-export-rules-textbox", "replacer-export-rules-button", "replacer-show-import-button"]];
	for (var i=0; i<orderableListIds.length; i++){
		var scopeElementId = orderableListIds[i][0];
		var allWhereToElements = getElementsByClass("whereTo", scopeElementId);
		for (var j=0; j<allWhereToElements.length; j++){
			var currentElement = allWhereToElements[j];
			currentElement.addEventListener("click", function (event){changeListOrder(scopeElementId,event.currentTarget);},false);
		}
		/*
		var currentButton = document.getElementById(orderableListIds[i][1]);
		//alert ();
		var thisList = orderableListIds[i][0] + "";
		//alert (thisList);
		var thisExportTextbox = orderableListIds[i][4];
		var thisImportTextbox = orderableListIds[i][6];
		currentButton.addEventListener("click", function (){appendToList(thisList);},false);
		var exportButton = document.getElementById(orderableListIds[i][5]);
		exportButton.addEventListener("click", function (){exportRules(thisExportTextbox, scopeElementId);},false);
		var importButton = document.getElementById(orderableListIds[i][3]);
		importButton.addEventListener("click", function (){importRules(thisImportTextbox, scopeElementId);},false);
		var showImportButton = document.getElementById(orderableListIds[i][6]);
		showImportButton.addEventListener("click",function (){unhideElement(showImportButton.nextSibling);},false);
		*/
	}
}

function getElementsByClass (whereTo, scopeElementId){
	var scopeElement = document.getElementById(scopeElementId);
	//var classXPath = '//*[@class="' + whereTo + '"]';
	//replace string below with classXPath
	var allElementsofClassArray = [];
	var allElementsofClass, thisElement;
	allElementsofClass = document.evaluate(
    '//*[@class="whereTo"]',
    scopeElement,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
	for (var i = 0; i < allElementsofClass.snapshotLength; i++) {
    thisElement = allElementsofClass.snapshotItem(i);
    allElementsofClassArray.push(thisElement);
	}
	return allElementsofClassArray;
}

function unhideElement (element){
	element.hidden = false;
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