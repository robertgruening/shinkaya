let _currentGame = null;
var _currentPlace = null;
var _foundItemNames = new Array();
var _viewMode = "default";

$(document).ready(function() {

	$("#button-open-about").click(function() { $("#modal-about").show(); });
	$("#button-close-about").click(function() { $("#modal-about").hide(); });
	$("#button-start").click(startNewGame);

	$("#button-close-map").click(function() { show(_currentPlace); });

	$("#button-open-quests").click(openQuests);
	$("#button-close-quests").click(function() { $("#modal-quests").hide(); });
	$("#button-ok-quests").click(function() { $("#modal-quests").hide(); });

	$("#button-view").click(function() { switchMode("view"); });
	$("#button-take").click(function() { switchMode("take"); });

	$("#button-close-item-info").click(function() { $("#modal-item-info").hide(); });
	$("#button-ok-item-info").click(function() { $("#modal-item-info").hide(); });

	$("#button-close-object-info").click(function() { $("#modal-object-info").hide(); });
	$("#button-ok-object-info").click(function() { $("#modal-object-info").hide(); });

	_foundItemNames = new Array();
	_currentGame = _config;

	initItemInventory();
	$("#modal-about").hide();
	openMap();
	$("#modal-about").show();
});

function switchMode(newMode) {
	// reset view
	$("#view").removeClass("mode__default");
	$("#view").removeClass("mode__view");
	$("#view").removeClass("mode__take");

	// reset event 'click'
	$(".viewable").off("click");
	$(".takable").off("click");

	// reset button view
	$("#button-view").removeClass("w3-indigo");
	$("#button-view").addClass("w3-pale-blue");
	$("#button-view").addClass("w3-hover-indigo");

	// reset button take
	$("#button-take").removeClass("w3-indigo");
	$("#button-take").addClass("w3-pale-blue");
	$("#button-take").addClass("w3-hover-indigo");

	if (newMode == "view" &&
		_viewMode != "view") {
		$("#button-view").removeClass("w3-pale-blue");
		$("#button-view").addClass("w3-indigo");
		$("#view").addClass("mode__view");
		$(".viewable.item").click(function() { openItemInfo($(this).attr("item-name")); });
		$(".viewable.object").click(function() { openObjectInfo($(this).attr("object-name")); });
		_viewMode = "view";
	}
	else if (newMode == "take" &&
			_viewMode != "take") {
		$("#button-take").removeClass("w3-pale-blue");
		$("#button-take").addClass("w3-indigo");
		$("#view").addClass("mode__take");
		$(".takable").click(function() { takeItem($(this).attr("item-name")); });
		_viewMode = "take";
	}
	else {
		$("#view").addClass("mode__default");
		$(".viewable.item").click(function() { openItemInfo($(this).attr("item-name")); });
		$(".viewable.object").click(function() { openObjectInfo($(this).attr("object-name")); });
		_viewMode = "default";
	}
}

function startNewGame() {
	_foundItemNames = new Array();
	_currentGame = _config;

	initItemInventory();
	$("#modal-about").hide();
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

function containsFoundItemByName(name) {
	var itemNames = _foundItemNames.filter(function(itemName, index) {
		return itemName == name;
	});

	return itemNames.length >= 1;
}

function openMap() {
	$("#button-go-forward").hide();
	$("#button-go-right").hide();
	$("#button-go-left").hide();
	$("#button-go-back").hide();
	$("#img-view").attr("src", "images/map.jpg");

	disableButtonOpenMap();

	$("#markers").empty();
	$("#objects").empty();
	$("#items").empty();

	_currentGame.places.forEach(function(place, index) {
		if (typeof place.position !== "undefined") {
			let radius = 8;
			let div = $("<div></div>");
			div.addClass("w3-display-topleft");
			div.addClass("w3-circle");
			div.addClass("w3-pale-blue");
			div.addClass("w3-hover-indigo");
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
	$("#modal-item-info").show();
	var item = findItemByName(itemName);

	$("#item-image").attr("src", "images/" + item.name + ".jpg");
	$("#item-description").html(item.description);
}

function openObjectInfo(objectName) {
	$("#modal-object-info").show();
	var object = findObjectByName(objectName);

	$("#object-description").html(object.description);
}

function takeItem(itemName) {
	_foundItemNames.push(itemName);
	$("#item" + itemName).remove();
	initItemInventory();
	switchMode("default");
}

function show(placeName) {
	$("#markers").empty();
	$("#objects").empty();
	$("#items").empty();
	$("#button-go-forward").show();
	$("#button-go-right").show();
	$("#button-go-left").show();
	$("#button-go-back").show();

	disableButtonGoForward();
	disableButtonGoRight();
	disableButtonGoLeft();
	disableButtonGoBack();

	var place = findPlaceByName(placeName);
	_currentPlace = place.name;
	$("#img-view").attr("src", "images/" + place.name + ".jpg");


	if (typeof place.forward !== "undefined") {
		enableButtonGoForward();
	}

	if (typeof place.right !== "undefined") {
		enableButtonGoRight();
	}

	if (typeof place.left !== "undefined") {
		enableButtonGoLeft();
	}

	if (typeof place.back !== "undefined") {
		enableButtonGoBack();
	}

	if (typeof place.items !== "undefined") {
		createItems(place.items);
	}

	if (typeof place.objects !== "undefined") {
		createObjects(place.objects);
	}

	enableButtonOpenMap();
	switchMode("default");
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

	$("#button-close-map").hide();
}

function disableButtonOpenMap() {
	$("#button-open-map").off("click");
	$("#button-open-map").addClass("disabled");
	$("#button-open-map").prop("disabled", true);

	if (_currentPlace != null) {
		$("#button-close-map").show();
	}
}

function setEnabledButtonCss(button) {
	button.removeClass("disabled");
	button.prop("disabled", false);
	button.removeClass("w3-gray");
	button.removeClass("w3-hover-gray");
	button.removeClass("w3-text-gray");
	button.removeClass("w3-hover-text-gray");
	button.addClass("w3-pale-blue");
	button.addClass("w3-hover-indigo");
	button.addClass("w3-text-black");
	button.addClass("w3-hover-text-white");
}

function disableButton(button) {
	button.off("click");
	button.addClass("disabled");
	button.prop("disabled", true);
	button.removeClass("w3-pale-blue");
	button.removeClass("w3-hover-indigo");
	button.removeClass("w3-text-black");
	button.removeClass("w3-hover-text-white");
	button.addClass("w3-gray");
	button.addClass("w3-hover-gray");
	button.addClass("w3-text-gray");
	button.addClass("w3-hover-text-gray");
}

function disableButtonGoForward() {
	disableButton($("#button-go-forward"));
}

function enableButtonGoForward() {
	$("#button-go-forward").off("click");
	$("#button-go-forward").click(function() { goToDirection("forward"); });
	setEnabledButtonCss($("#button-go-forward"));
}

function disableButtonGoForward() {
	disableButton($("#button-go-forward"));
}

function enableButtonGoLeft() {
	$("#button-go-left").off("click");
	$("#button-go-left").click(function() { goToDirection("left"); });
	setEnabledButtonCss($("#button-go-left"));
}

function disableButtonGoLeft() {
	disableButton($("#button-go-left"));
}

function enableButtonGoRight() {
	$("#button-go-right").off("click");
	$("#button-go-right").click(function() { goToDirection("right"); });
	setEnabledButtonCss($("#button-go-right"));
}

function disableButtonGoRight() {
	disableButton($("#button-go-right"));
}

function enableButtonGoBack() {
	$("#button-go-back").off("click");
	$("#button-go-back").click(function() { goToDirection("back"); });
	setEnabledButtonCss($("#button-go-back"));
}

function disableButtonGoBack() {
	disableButton($("#button-go-back"));
}

function goToDirection(direction) {
	show(findPlaceByName(_currentPlace)[direction]);
}
