
/* 
	I put all my global variables at the top; these serve to help define the application state 
*/
var currentTabIndex = 0, currentTimeGroupIndex = 0, selectedProjectId = 0;

/* This is the type of thing you would load from a database via a RESTful API */
var projectList = [
	{
		id: 1,
		title: "Personal",
		numItems: 1,
		color: "red"
	},
	{
		id: 2,
		title: "Shopping",
		numItems: 3,
		color: "gray"
	},
	{
		id: 3,
		title: "Work",
		numItems: 0,
		color: "blue"
	},
	{
		id: 4,
		title: "Errands",
		numItems: 5,
		color: "teal"
	},
	{
		id: 5,
		title: "Movies to Watch",
		numItems: 0,
		color: "purple"
	}
]

/* 
	Put code in here that is dependent on the UI existing; 
	any sort of DOM manipulation necessitates its existence beforehand 
*/
window.onload = function() {
	/* 
		Here we want to limit the size of the main application UI width; 
		In the CSS we declared that it is to be 75% of the window, which is ok, 
		but that means it will constantly re-size and get smaller if we shrink the screen size; 
		We want it to not get any smaller than 75% of the full window;

		JavaScript allows us to perform math and concatenation in the same line! 
	*/
	document.getElementsByClassName('app-ui-container')[0].style.minWidth = (screen.width * 0.635) + "px";

	/* 
		Here you would generate the dynamic parts of your application UI; typically this involves making API requests 
		which return structured data like XML or JSON which you then use to generate your UI
	*/
	generateProjects();
}

function selectTimeGroup(idx) {
	if(currentTimeGroupIndex == idx) return;

	var timeGroups = document.getElementsByClassName('time-group');
	for(var i = 0; i < timeGroups.length; i++) {
		var timeGroup = timeGroups[i];
		var timeGroupText = timeGroup.querySelector('p');

		if(i != idx) {
			timeGroup.className = "time-group";
			timeGroupText.className = "time-group-text time-group-content";
		} else {
			timeGroup.className = "time-group time-group-selected";
			timeGroupText.className = "time-group-text time-group-content time-group-text-selected";
		}
	}

	currentTimeGroupIndex = idx;
}

function changeContextTab(idx) {
	if(currentTabIndex == idx) return;

	var contextTabs = document.getElementsByClassName('context-tab');
	var contextTabContents = document.getElementsByClassName('context-tab-content');

	for(var i = 0; i < contextTabs.length; i++) {
		if(i != idx) {
			contextTabs[i].className = "context-tab";
			contextTabContents[i].className = "context-tab-content context-tab-content-hidden";
		} else {
			contextTabs[i].className = "context-tab context-tab-selected";
			contextTabContents[i].className = "context-tab-content";
		}
	}

	currentTabIndex = idx;
}

function selectProject(id) {
	if(selectedProjectId == id) return;

	var projects = document.getElementsByClassName('project-item');

	for(var i = 0; i < projects.length; i++) {
		var project = projects[i];
		var content = project.querySelector('.project-item-content');
		var title = project.querySelector('.project-item-title');

		if(project.getAttribute("data-id") != id) {
			content.className = "project-item-content";
			title.className = "project-item-title";
		} else {
			content.className = "project-item-content project-item-content-selected";
			title.className = "project-item-title project-item-title-selected";
		}
	}

	selectedProjectId = id;
}

function generateProjects() {
	var projectsTab = document.getElementById('projects-tab');
	var addProjectContainer = document.getElementsByClassName('add-project-container')[0];

	for(var i = 0; i < projectList.length; i++) {
		var project = projectList[i];

		var projectWrapper = document.createElement('div');
		projectWrapper.setAttribute('data-id', project.id);
		projectWrapper.className = "project-item";

		/* */
		addProjectSelectListener(projectWrapper, project.id);

		var dragButton = document.createElement('img');
		dragButton.className = "drag-button";
		dragButton.src = "assets/drag-icon.png";
		projectWrapper.appendChild(dragButton);

		var projectContentWrapper = document.createElement('div');
		projectContentWrapper.className = "project-item-content" + (i == 0 ? " project-item-content-selected" : "");
		projectWrapper.appendChild(projectContentWrapper);

		var projectContentIcon = document.createElement('div');
		projectContentIcon.className = "project-item-icon";
		projectContentIcon.style.backgroundColor = "var(--project-color-" + project.color + ")";
		projectContentWrapper.appendChild(projectContentIcon);

		var projectContentTitle = document.createElement('p');
		projectContentTitle.textContent = project.title;
		projectContentTitle.className = "project-item-title" + (i == 0 ? " project-item-title-selected" : "");
		projectContentWrapper.appendChild(projectContentTitle);

		var projectContentNumber = document.createElement('p');
		projectContentNumber.textContent = (project.numItems > 0 ? (project.numItems + "") : "");
		projectContentNumber.className = "project-item-number";
		projectContentWrapper.appendChild(projectContentNumber);

		var dropDown = document.createElement('img');
		dropDown.className = "project-item-drop-down-button";
		dropDown.src = "assets/drop-down-icon.png";
		projectContentWrapper.appendChild(dropDown);

		projectsTab.insertBefore(projectWrapper, addProjectContainer);
	}
}

function addProjectSelectListener(elem, id) {
	elem.addEventListener('click', function() {
		selectProject(id);
	});
}

function toggleSearchBar(grow) {
	var searchBarContainer = document.getElementsByClassName('search-bar-container')[0];
	var searchBar = document.getElementsByClassName('search-bar')[0];

	console.log(typeof(grow));

	if(grow) {
		searchBarContainer.style.width = "660px";
		searchBarContainer.style.backgroundColor = "white";

		searchBar.style.color = "var(--heading-text-color)";
	} else {
		searchBarContainer.style.width = "260px";
		searchBarContainer.style.backgroundColor = "transparent";

		searchBar.style.color = "var(--search-bar-initial-color)";
	}
}





