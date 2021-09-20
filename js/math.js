function getResolution(width, height) {
	return width / height;
}

function getDefaultResolution() {
	return getDefaultHeight() / getDefaultWidth();
}

function getWidthByHeightAndResolution(height, resolution) {
	return height / resolution;
}

function getHeightByWidthAndResolution(width, resolution) {
	return width * resolution;
}

function calculateWidth(configuredWidth, maxWidth) {
	return (configuredWidth / getDefaultWidth()) * maxWidth;
}

function calculateHeight(configuredHeight, maxHeight) {
	return (configuredHeight / getDefaultHeight()) * maxHeight;
}

function getDefaultWidth() {
	return 1000;
}

function getDefaultHeight() {
	return 750;
}
