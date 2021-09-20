//#region variables
let _currentGame = null;
var _currentPlace = null;
var _foundItemNames = new Array();
var _actionMode = "default";
var _levelOfDifficulty = "beginner";
var _countOfExperiencePoints = 0;
var _openedPlaceNames = new Array();
var _openedItemNames = new Array();
var _openedObjectNames = new Array();
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

function getCountOfExperiencePoints() {
	return _countOfExperiencePoints;
}

function initCountOfExperiencePoints() {
	setCountOfExperiencePoints(0);
}

function setCountOfExperiencePoints(countOfExperiencePoints) {
	_countOfExperiencePoints = countOfExperiencePoints;
	updateLabelCountOfExperiencePoints(_countOfExperiencePoints);
}

function addCountOfExperiencePoints(countOfExperiencePoints, args) {
	animateAdditionalCountOfExperiencePoints(countOfExperiencePoints, args);
	_countOfExperiencePoints += countOfExperiencePoints;
	updateLabelCountOfExperiencePoints(_countOfExperiencePoints);
}

function addOpenedPlaceName(placeName) {
	_openedPlaceNames.push(placeName);
}

function initOpenedPlaceNames() {
	_openedPlaceNames = new Array();
}

function containsOpenedPlaceName(placeName) {
	return _openedPlaceNames.includes(placeName);
}

function addOpenedItemName(itemName) {
	_openedItemNames.push(itemName);
}

function initOpenedItemNames() {
	_openedItemNames = new Array();
}

function containsOpenedItemName(itemName) {
	return _openedItemNames.includes(itemName);
}

function addOpenedObjectName(objectName) {
	_openedObjectNames.push(objectName);
}

function initOpenedObjectNames() {
	_openedObjectNames = new Array();
}

function containsOpenedObjectName(objectName) {
	return _openedObjectNames.includes(objectName);
}
//#endregion

$(document).ready(function() {
	resizeView();

	$("#button-go-forward").click(function(e) { goToDirection("forward", { pageX : e.originalEvent.pageX, pageY : e.originalEvent.pageY }); });
	$("#button-go-left").click(function(e) { goToDirection("left", { pageX : e.originalEvent.pageX, pageY : e.originalEvent.pageY }); });
	$("#button-go-right").click(function(e) { goToDirection("right", { pageX : e.originalEvent.pageX, pageY : e.originalEvent.pageY }); });
	$("#button-go-back").click(function(e) { goToDirection("back", { pageX : e.originalEvent.pageX, pageY : e.originalEvent.pageY }); });

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

	$("#button-close-item-info").click(function() { $("#modal-item-info").hide(); });
	$("#button-close-object-info").click(function() { $("#modal-object-info").hide(); });
	$("#button-close-congratulation").click(function() { $("#modal-congratulation").hide(); });

	initFirstGame();
});

function resizeView() {
	let maxHeight = $(window).height() -
		$("#container-bottom").outerHeight(true) -
		$("#container-scene-description").outerHeight(true);
	
	let maxWidth = $(window).width();
	
	if (getResolution(maxWidth, maxHeight) <= getDefaultResolution()) {
		if (getWidthByHeightAndResolution(maxHeight, getDefaultResolution()) >= maxWidth) {
			$("#view").width(maxWidth);
			$("#view").height(getHeightByWidthAndResolution(maxWidth, getDefaultResolution()));
		}
		else {
			$("#view").width(getWidthByHeightAndResolution(maxHeight, getDefaultResolution()));
			$("#view").height(maxHeight);
		}
	}
	else if (getResolution(maxWidth, maxHeight) > getDefaultResolution()) {
		if (getHeightByWidthAndResolution(maxWidth, getDefaultResolution()) >= maxHeight) {
			$("#view").width(getWidthByHeightAndResolution(maxHeight, getDefaultResolution()));
			$("#view").height(maxHeight);
		}
		else {
			$("#view").width(maxWidth);
			$("#view").height(getHeightByWidthAndResolution(maxWidth, getDefaultResolution()));
		}
	}
}

function updateLabelCountOfExperiencePoints(countOfExperiencePoints) {
	$("#experience-points--value").html(countOfExperiencePoints);
}

function updateLabelCountOfFoundItems() {
	$("#found-items--value").html(getFoundItemName().length + "/" + _currentGame.items.length);
}

function animateAdditionalCountOfExperiencePoints(countOfExperiencePoints, args) {
	let additionalExperiencePointsPopup = $("<div></div>");
	$("body").append(additionalExperiencePointsPopup);

	additionalExperiencePointsPopup.html("+ " + countOfExperiencePoints);
	additionalExperiencePointsPopup.addClass("popupPoints");
	
	let top = typeof(args) === "undefined" ? 0 : args.pageY;
	let left = typeof(args) === "undefined" ? 0 : args.pageX;
	
	additionalExperiencePointsPopup.css("top", (top + 10) + "px");
	additionalExperiencePointsPopup.css("left", left + "px");

	$(".popupPoints").fadeIn("fast", function() {
	    $(".popupPoints").fadeOut((4 * 1000), function() {
    	    $(".popupPoints").remove();
	    });
	});
}

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
		$(".viewable.item").click(function(e) { openItemInfo($(this).attr("item-name"), { pageX : e.originalEvent.pageX, pageY : e.originalEvent.pageY }); });
		$(".viewable.object").click(function(e) { openObjectInfo($(this).attr("object-name"), { pageX : e.originalEvent.pageX, pageY : e.originalEvent.pageY }); });
		setActionMode("view");
	}
	else if (newActionMode == "take") {
		$("#button-take").addClass("action-button__active");
		$("#view").addClass("mode__take");
		$(".takable").click(function(e) { takeItem($(this).attr("item-name"), { pageX : e.originalEvent.pageX, pageY : e.originalEvent.pageY }); });
		setActionMode("take");
	}
	else {
		$("#view").addClass("mode__default");
		$(".viewable.item").click(function(e) { openItemInfo($(this).attr("item-name"), { pageX : e.originalEvent.pageX, pageY : e.originalEvent.pageY }); });
		$(".viewable.object").click(function(e) { openObjectInfo($(this).attr("object-name"), { pageX : e.originalEvent.pageX, pageY : e.originalEvent.pageY }); });
		getActionMode("default");
	}
}

function initFirstGame() {
	_currentGame = new Object();
	$.extend(true, _currentGame, _config);
	initFoundItemName();
	initOpenedPlaceNames();
	initOpenedItemNames();
	initOpenedObjectNames();
	initCountOfExperiencePoints();
	updateLabelCountOfFoundItems();

	initItemInventory();
	openMap();
	$("#modal-help").show();
}

function startNewGame() {
	_currentGame = new Object();
	$.extend(true, _currentGame, _config);
	initFoundItemName();
	initOpenedPlaceNames();
	initOpenedItemNames();
	initOpenedObjectNames();
	initCountOfExperiencePoints();
	updateLabelCountOfFoundItems();

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
			div.addClass("w3-amber");
			div.addClass("w3-border-amber");
			div.addClass("item");
			div.addClass("viewable");
			div.attr({
				"style": "background-image: url('images/" + item.name + ".png');",
				"item-name": item.name
			});
		}
		else {
			div.addClass("w3-border-white");
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
			let marker = $("<div></div>");
			marker.addClass("w3-display-topleft");
			marker.addClass("w3-circle");
			marker.addClass("map--marker");
			marker.css({
				"margin-top": ((place.position.top / getDefaultHeight()) * $("#view").height()) - radius,
				"margin-left": ((place.position.left / getDefaultWidth()) * $("#view").width()) - radius,
				"width": (2 * radius) + "px",
				"height": (2 * radius) + "px"
			});
			marker.attr("title", place.title);
			marker.click(function() { show(place.name); });
			$("#markers").append(marker);
			
			let tooltip = $("<div></div>");
			tooltip.addClass("w3-display-topleft");
			tooltip.addClass("w3-round");
			tooltip.addClass("map--marker-tooltip");
			tooltip.css({
				"margin-top": ((place.position.top / getDefaultHeight()) * $("#view").height()) + radius + 5,
				"margin-left": ((place.position.left / getDefaultWidth()) * $("#view").width()) - radius
			});
			tooltip.attr("title", place.title);
			tooltip.html(place.title);
			tooltip.click(function() { show(place.name); });
			$("#markers").append(tooltip);
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
			questImage.addClass("w3-amber");
			questImage.addClass("w3-border-amber");
		}
		else {
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

function openItemInfo(itemName, args) {
	openItemInfoDialogue(findItemByName(itemName), args);
	
	if (!containsOpenedItemName(itemName)) {
		addCountOfExperiencePoints(10, args);
		addOpenedItemName(itemName);
	}
	
	$("#button-take-item").hide();
	$("#button-take-item").off("click");

	if (!containsFoundItemByName(itemName)) {
		$("#button-take-item").show();
		$("#button-take-item").click( function(e) {
			takeItem(itemName, { pageX : e.originalEvent.pageX, pageY : e.originalEvent.pageY });
			$("#modal-item-info").hide();
		});
	}
}

function openObjectInfo(objectName, args) {
	openObjectInfoDialogue(findObjectByName(objectName), args);

	if (!containsOpenedObjectName(objectName)) {
		addCountOfExperiencePoints(10, args);
		addOpenedObjectName(objectName);
	}
}

function openItemInfoDialogue(entity) {
	$("#modal-item-info__image-column").hide();
	$("#modal-item-info__image").attr("src", "");

	$("#modal-item-info__description").html(entity.description);

	if (typeof(entity.descriptionImage) !== "undefined") {
		$("#modal-item-info__image").attr("src", "images/" + entity.descriptionImage);
		$("#modal-item-info__image-column").show();
	}

	$("#modal-item-info").show();
}

function openObjectInfoDialogue(entity) {
	$("#modal-object-info__image-column").hide();
	$("#modal-object-info__image").attr("src", "");

	$("#modal-object-info__description").html(entity.description);

	if (typeof(entity.descriptionImage) !== "undefined") {
		$("#modal-object-info__image").attr("src", "images/" + entity.descriptionImage);
		$("#modal-object-info__image-column").show();
	}

	$("#modal-object-info").show();
}

function takeItem(itemName, args) {
	addFoundItemName(itemName);
	updateLabelCountOfFoundItems();
	$("#item" + itemName).remove();
	initItemInventory();
	switchActionMode("default");
	addCountOfExperiencePoints(20, args);

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
	
	if (getFoundItemName().length == _currentGame.items.length) {
		$("#modal-congratulation__title").html(_currentGame.congratulation.title);
		$("#modal-congratulation__image").attr("src", "images/" + _currentGame.congratulation.image);
		$("#modal-congratulation__description").html(_currentGame.congratulation.text);
		$("#modal-congratulation").show();
	}
}

function show(placeName, args) {
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
	
	resizeView();

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

	if (!containsOpenedPlaceName(placeName)) {
		addCountOfExperiencePoints(5, args);
		addOpenedPlaceName(placeName);
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
		"margin-top": ((item.top / getDefaultHeight()) * $("#view").height()) - height / 2,
		"margin-left": ((item.left / getDefaultWidth()) * $("#view").width()) - width / 2,
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
		"margin-top": ((object.top / getDefaultHeight()) * $("#view").height()) - height / 2,
		"margin-left": ((object.left / getDefaultWidth()) * $("#view").width()) - width / 2,
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

function goToDirection(direction, args) {
	show(findPlaceByName(_currentPlace)[direction], args);
}

function dig() {
	let currentPlace = findPlaceByName(_currentPlace);

	replacePlaceNameInConfig(currentPlace.name, currentPlace.dig);
	show(currentPlace.dig);
}
