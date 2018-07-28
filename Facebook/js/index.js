
var buttonState = 0;
var fontSize = 0.85;

window.onload = function() {
	var bannerContent = document.getElementsByClassName('fb-banner-content-container')[0];
	var contentContainer = document.getElementsByClassName('content-container')[0];

	bannerContent.style.width = window.outerWidth * 0.703 + "px";
	contentContainer.style.width = window.outerWidth * 0.703 + "px";
}

function toggleSearchButton(state) {
	var searchButton = document.getElementsByClassName('search-button')[0];

	if(state == 1) {
		searchButton.style.backgroundColor = "#4c81f7";
		buttonState = state;
	} else if(state == 0) {
		searchButton.style.backgroundColor = "#f7f8f9";
		buttonState = state;
	} else if(state == 2) {
		if(buttonState != 1) {
			searchButton.style.backgroundColor = "#e9ebee";
			buttonState = state;
		}
	} else if(state == 3) {
		if(buttonState != 1) {
			searchButton.style.backgroundColor = "#f7f8f9";
			buttonState = state;
		}
	}	
}

function resizeTextBox(elem) {
	elem.style.height = "1px";
	elem.style.height = 5 + elem.scrollHeight + "px";

	if(elem.value.length < 86 && elem.value.length != 0) {
		if(fontSize != 1.4) {
			fontSize = 1.4;
			elem.style.fontSize = fontSize + "em";
		} 
	} else if(elem.value.length >= 86) {
		if(fontSize != 0.85) {
			fontSize = 0.85;
			elem.style.fontSize = fontSize + "em";	
		}
	} else if(elem.value.length == 0) {
		if(fontSize != 0.85) {
			fontSize = 0.85;
			elem.style.fontSize = fontSize + "em";	
		}
	}
}

