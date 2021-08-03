//#region variables
let _currentGame = null;
var _currentPlace = null;
var _foundItemNames = new Array();
var _actionMode = "default";
var _levelOfDifficulty = "beginner";
//#endregion

//#region properties
function initFoundItemName() {
	_foundItemNames = new Array();
}

function addFoundItemName(itemName) {
	_foundItemNames.push(itemName);
}

function containsFoundItemByName(name) {
	var itemNames = _foundItemNames.filter(function(itemName, index) {
		return itemName == name;
	});

	return itemNames.length >= 1;
}

function getFoundItemName() {
	return _foundItemNames;
}

function setActionMode(actionMode) {
	_actionMode = actionMode;
}

/**
 * Returns the action mode.
 * @returns "default"|"view"|"take"
 */
function getActionMode() {
	return _actionMode;
}

function setlevelOfDifficulty(levelOfDifficulty) {
	_levelOfDifficulty = levelOfDifficulty;
}

/**
 * Returns the level of difficulty.
 * @returns "beginner"|"expert"
 */
function getLevelOfDifficulty() {
	return _levelOfDifficulty;
}
//#endregion

$(document).ready(function() {
	$("#button-go-forward").click(function() { goToDirection("forward"); });
	$("#button-go-left").click(function() { goToDirection("left"); });
	$("#button-go-right").click(function() { goToDirection("right"); });
	$("#button-go-back").click(function() { goToDirection("back"); });

	$("#button-open-menu").click(function() { $("#modal-menu").show(); });
	$("#button-close-menu").click(function() { $("#modal-menu").hide(); });

	$("#button-open-about").click(function() {
		$("#modal-menu").hide();
		$("#contributors").empty();

		_currentGame.contributors.forEach(function(item) {
			var li = $("<li></li>");
			li.html(item);
			$("#contributors").append(li);
		});

		$("#modal-about").show();		
	});
	$("#button-close-about").click(function() { $("#modal-about").hide(); });

	$("#button-open-help").click(function() {
		$("#modal-menu").hide();
		$("#modal-help").show();
	});
	$("#button-close-help").click(function() { $("#modal-help").hide(); });
	$("#button-new-game").click(function() {
		$("#modal-menu").hide();
		startNewGame();
	});

	$("#button-open-quests").click(openQuests);
	$("#button-close-quests").click(function() { $("#modal-quests").hide(); });

	$("#button-view").click(function() { switchActionMode(getActionMode() == "view" ? "default" : "view"); });
	$("#button-take").click(function() { switchActionMode(getActionMode() == "take" ? "default" : "take"); });
	$("#button-dig").click(function() { dig(); });

	$("#button-close-info").click(function() { $("#modal-info").hide(); });

	initFirstGame();
});

function switchActionMode(newActionMode) {
	// reset view
	$("#view").removeClass("mode__default");
	$("#view").removeClass("mode__view");
	$("#view").removeClass("mode__take");

	// reset event 'click'
	$(".viewable").off("click");
	$(".takable").off("click");

	// reset active button
	$("#button-view").removeClass("action-button__active");
	$("#button-take").removeClass("action-button__active");

	if (newActionMode == "view" ||
		(newActionMode == "default" &&
		 getLevelOfDifficulty() == "beginner")) {
			 
		$("#button-view").addClass("action-button__active");
		$("#view").addClass("mode__view");
		$(".viewable.item").click(function() { openItemInfo($(this).attr("item-name")); });
		$(".viewable.object").click(function() { openObjectInfo($(this).attr("object-name")); });
		setActionMode("view");
	}
	else if (newActionMode == "take") {
		$("#button-take").addClass("action-button__active");
		$("#view").addClass("mode__take");
		$(".takable").click(function() { takeItem($(this).attr("item-name")); });
		setActionMode("take");
	}
	else {
		$("#view").addClass("mode__default");
		$(".viewable.item").click(function() { openItemInfo($(this).attr("item-name")); });
		$(".viewable.object").click(function() { openObjectInfo($(this).attr("object-name")); });
		getActionMode("default");
	}
}

function initFirstGame() {
	initFoundItemName();
	_currentGame = _config;

	initItemInventory();
	openMap();
	$("#modal-help").show();
}

function startNewGame() {
	initFoundItemName();
	_currentGame = _config;

	initItemInventory();
	openMap();
	openQuests();
}

function initItemInventory() {
	$("#item-inventory").empty();

	_currentGame.items.forEach(function(item, index) {
		let div = $("<div></div>");
		div.addClass("w3-round");
		div.addClass("item-inventory-placeholder");

		if (containsFoundItemByName(item.name)) {
			div.addClass("w3-pale-blue");
			div.addClass("w3-border-indigo");
			div.addClass("item");
			div.addClass("viewable");
			div.attr({
				"style": "background-image: url('images/" + item.name + ".png');",
				"item-name": item.name
			});
		}
		else {
			div.addClass("w3-border-pale-blue");
		}

		let li = $("<li></li>");
		li.append(div);

		$("#item-inventory").append(li);
	});
}

function replacePlaceNameInConfig(placeNameToBeReplaced, newPlaceName) {
	_currentGame.places.forEach((place) => {
		if (typeof(place.forward) !== "undefined" &&
			place.forward == placeNameToBeReplaced) {
			place.forward = newPlaceName;
		}
		
		if (typeof(place.back) !== "undefined" &&
			place.back == placeNameToBeReplaced) {
			place.back = newPlaceName;
		}
		
		if (typeof(place.left) !== "undefined" &&
			place.left == placeNameToBeReplaced) {
			place.left = newPlaceName;
		}
		
		if (typeof(place.right) !== "undefined" &&
			place.right == placeNameToBeReplaced) {
			place.right = newPlaceName;
		}
	});
}

function findPlaceByName(name) {
	var places = _currentGame.places.filter(function(place, index) {
		return place.name == name;
	});

	if (places.length == 0) {
		console.error("No place '" + name + "' found!");
		return null;
	}

	return places[0];
}

function findItemByName(name) {
	var items = _currentGame.items.filter(function(item, index) {
		return item.name == name;
	});

	if (items.length == 0) {
		console.error("No item '" + name + "' found!");
		return null;
	}

	return items[0];
}

function findObjectByName(name) {
	var objects = _currentGame.objects.filter(function(object, index) {
		return object.name == name;
	});

	if (objects.length == 0) {
		console.error("No object '" + name + "' found!");
		return null;
	}

	return objects[0];
}

function openMap() {
	$("#button-go-forward").hide();
	$("#button-go-right").hide();
	$("#button-go-left").hide();
	$("#button-go-back").hide();
	disableButtonOpenMap();
	$("#button-view").hide();
	$("#button-take").hide();
	$("#button-dig").hide();
	$("#img-view").attr("src", "images/map.jpg");

	$("#markers").empty();
	$("#objects").empty();
	$("#items").empty();

	_currentGame.places.forEach(function(place, index) {
		if (typeof place.position !== "undefined") {
			let radius = 15;
			let div = $("<div></div>");
			div.addClass("w3-display-topleft");
			div.addClass("w3-circle");
			div.addClass("map--marker");
			div.css({
				"margin-top": place.position.top - radius,
				"margin-left": place.position.left - radius,
				"width": (2 * radius) + "px",
				"height": (2 * radius) + "px"
			});
			div.attr("title", place.title);
			div.click(function() { show(place.name); });
			$("#markers").append(div);
		}
	});
}

function closeMap() {
	enableButtonOpenMap();
}

function openQuests() {
	$("#modal-quests").show();
	$("#quests").empty();
	
	_currentGame.items.forEach(function(item, index) {

		var questImage = $("<img></img>");
		questImage.addClass("w3-round");
		questImage.addClass("quest-image");

		if (containsFoundItemByName(item.name)) {
			questImage.attr("src", "images/" + item.name + ".png");
			questImage.addClass("w3-border-indigo");
		}
		else {
			questImage.attr("src", "images/open-quest.png");
			questImage.addClass("w3-border-white");
		}

		var questText = $("<span></span>");
		questText.addClass("quest-text");
		questText.html(item.quest);

		var questItem = $("<li></li>");
		questItem.append(questImage);
		questItem.append(questText);

		$("#quests").append(questItem);
	});
}

function openItemInfo(itemName) {
	openInfoDialogue(findItemByName(itemName));
}

function openObjectInfo(objectName) {
	openInfoDialogue(findObjectByName(objectName));
}

function openInfoDialogue(entity) {
	$("#modal-info__image-column").hide();
	$("#modal-info__image").attr("src", "");

	$("#modal-info__description").html(entity.description);

	if (typeof(entity.descriptionImage) !== "undefined") {
		$("#modal-info__image").attr("src", "images/" + entity.descriptionImage);
		$("#modal-info__image-column").show();
	}

	$("#modal-info").show();
}

function takeItem(itemName) {
	addFoundItemName(itemName);
	$("#item" + itemName).remove();
	initItemInventory();
	switchActionMode("default");

	let currentPlace = findPlaceByName(_currentPlace);
	currentPlace.items.splice(currentPlace.items.indexOf(itemName), 1);

	if (typeof currentPlace.dig !== "undefined" &&
		currentPlace.items.length == 0) {
		$("#button-dig").show();
	}

	if (currentPlace.items.length == 0) {
		$("#button-take").hide();
	}
	else {
		$("#button-take").show();
	}
}

function show(placeName) {
	$("#markers").empty();
	$("#objects").empty();
	$("#items").empty();
	$("#button-go-forward").hide();
	$("#button-go-right").hide();
	$("#button-go-left").hide();
	$("#button-go-back").hide();
	
	enableButtonOpenMap();
	$("#button-view").hide();
	$("#button-take").hide();
	$("#button-dig").hide();

	var place = findPlaceByName(placeName);
	_currentPlace = place.name;
	
	if (typeof place.description === "undefined") {
		$("#scene-description").html("");
	}
	else {
		$("#scene-description").html(place.description);
	}

	$("#img-view").attr("src", "images/" + place.name + ".jpg");


	if (typeof place.forward !== "undefined") {
		$("#button-go-forward").show();
	}

	if (typeof place.right !== "undefined") {
		$("#button-go-right").show();
	}

	if (typeof place.left !== "undefined") {
		$("#button-go-left").show();
	}

	if (typeof place.back !== "undefined") {
		$("#button-go-back").show();
	}

	if (typeof place.items !== "undefined" &&
		place.items.length >= 1) {
		createItems(place.items);
		$("#button-take").show();
		$("#button-view").show();
	}

	if (typeof place.objects !== "undefined" &&
		place.objects.length >= 1) {
		createObjects(place.objects);
		$("#button-view").show();
	}

	if (typeof place.dig !== "undefined" &&
		(typeof place.items === "undefined" ||
		 place.items.length == 0)) {
		$("#button-dig").show();
	}

	enableButtonOpenMap();
	switchActionMode("default");
}

function createItems(itemNames) {
	itemNames.forEach((itemName, index) => {
		if (!containsFoundItemByName(itemName)) {
			createItem(itemName);
		}
	});
}

function createItem(itemName) {
	var item = findItemByName(itemName);
	
	let width = 100;
	let height = 100;
	
	let img = $("<img></img>");
	img.attr("id", "item" + item.name);
	img.attr("item-name", item.name);
	img.attr("src", "images/" + item.name + ".png");
	img.addClass("w3-display-topleft");
	img.addClass("w3-round");
	img.addClass("item");
	img.addClass("viewable");
	img.addClass("takable");
	img.css({
		"margin-top": item.top - height / 2,
		"margin-left": item.left - width / 2,
		"width": width,
		"height": height
	});
	$("#items").append(img);
}

function createObjects(objectNames) {
	objectNames.forEach((objectName, index) => {
		createObject(objectName);
	});
}

function createObject(objectName) {
	var object = findObjectByName(objectName);
	
	let width = 100;
	let height = 100;
	
	let div = $("<div></div>");
	div.attr("object-name", object.name);
	div.addClass("w3-display-topleft");
	div.addClass("w3-round");
	div.addClass("object");
	div.addClass("viewable");
	div.css({
		"margin-top": object.top - height / 2,
		"margin-left": object.left - width / 2,
		"width": width,
		"height": height
	});
	div.attr("title", object.description);
	$("#objects").append(div);
}

function enableButtonOpenMap() {
	$("#button-open-map").off("click");
	$("#button-open-map").click(openMap);
	$("#button-open-map").removeClass("disabled");
	$("#button-open-map").prop("disabled", false);
}

function disableButtonOpenMap() {
	$("#button-open-map").off("click");
	$("#button-open-map").addClass("disabled");
	$("#button-open-map").prop("disabled", true);
}

function disableButton(button) {
	button.off("click");
	button.addClass("disabled");
	button.addClass("w3-disabled");
	button.prop("disabled", true);
}

function goToDirection(direction) {
	show(findPlaceByName(_currentPlace)[direction]);
}

function dig() {
	let currentPlace = findPlaceByName(_currentPlace);

	replacePlaceNameInConfig(currentPlace.name, currentPlace.dig);
	show(currentPlace.dig);
}