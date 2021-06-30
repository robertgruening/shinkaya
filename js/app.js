var _currentPlace = null;
var _foundItemNames = new Array();

$(document).ready(function() {
    initItemInventory();

    $("#button-close-map").click(function() { show(_currentPlace); });
    $("#button-open-quests").click(openQuests);
    $("#button-close-quests").click(function() { $("#modal-quests").hide(); });
    $("#button-view").click(function() {
        $(".takable").off("click");
        $(".takable").removeClass("takable");
        $(".item, .item-inventory-placeholder__in-use").addClass("viewable");
        $(".viewable").click(function() { openItemInfo($(this).attr("item-name")); });
    });
    $("#button-take").click(function() {
        $(".viewable").off("click");
        $(".viewable").removeClass("viewable");
        $(".item").addClass("takable");
        $(".takable").click(function() { takeItem($(this).attr("item-name")); });
    });
    $("#button-close-item-info").click(function() { $("#modal-item-info").hide(); });
    
    show("hq_treppe");
});

function initItemInventory() {
    $("#items").empty();

    _config.items.forEach(function(item, index) {
        let div = $("<div></div>");
        div.addClass("w3-round");
        div.addClass("item-inventory-placeholder");

        if (containsFoundItemByName(item.name)) {
            div.addClass("w3-gray");
            div.addClass("item-inventory-placeholder__in-use");
            div.attr("style", "background-image: url('images/" + item.name + ".png');");
            div.attr("item-name", item.name);
        }

        let li = $("<li></li>");
        li.append(div);

        $("#items").append(li);
    });
}

function findPlaceByName(name) {
    var places = _config.places.filter(function(place, index) {
        return place.name == name;
    });

    if (places.length == 0) {
        console.error("No place '" + name + "' found!");
        return null;
    }

    return places[0];
}

function findItemByName(name) {
    var items = _config.items.filter(function(item, index) {
        return item.name == name;
    });

    if (items.length == 0) {
        console.error("No item '" + name + "' found!");
        return null;
    }

    return items[0];
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
    $("#img-fund").hide();
    $("#img-view").attr("src", "images/map.jpg");

    disableButtonOpenMap();

    $("#markers").empty();

    _config.places.forEach(function(place, index) {
        if (typeof place.position !== "undefined") {

            let div = $("<div></div>");
            div.addClass("w3-display-topleft");
            div.addClass("w3-round");
            div.css({
                "margin-top": place.position.top,
                "margin-left": place.position.left,
                "width": "10px",
                "height": "10px",
                "background-color": "red"
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
    
    _config.items.forEach(function(item, index) {

        var questImage = $("<img></img>");
        questImage.addClass("w3-round");
        questImage.addClass("quest-image");

        if (containsFoundItemByName(item.name)) {
            questImage.attr("src", "images/" + item.name + ".png");
        }
        else {
            questImage.attr("src", "images/open-quest.png");
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

function takeItem(itemName) {
    _foundItemNames.push(itemName);
    $("#img-fund").attr("src", "");
    $("#img-fund").hide();
    initItemInventory();
}

function show(placeName) {
    $("#markers").empty();
    $("#button-go-forward").show();
    $("#button-go-right").show();
    $("#button-go-left").show();
    $("#button-go-back").show();
    $("#img-fund").hide();

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

    if (typeof place.item !== "undefined" &&
        !containsFoundItemByName(place.item)) {
        showPanelItem(place.item);
    }

    enableButtonOpenMap();
}

function showPanelItem(itemName) {
    var item = findItemByName(itemName);

    $("#img-fund").attr("src", "images/" + item.name + ".png");
    $("#img-fund").attr("item-name", item.name);
    $("#img-fund").show();
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
