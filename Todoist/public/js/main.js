
/* 
	I put all my global variables at the top; these serve to help define the application state 
*/
var currentTabIndex = 0;

/* This is the type of thing you would load from a database via a RESTful API */
var projectList = [
	{
		id: "project1",
		title: "Personal",
		numItems: 1,
		color: "red"
	},
	{
		id: "project2",
		title: "Shopping",
		numItems: 3,
		color: "gray"
	},
	{
		id: "project3",
		title: "Work",
		numItems: 0,
		color: "blue"
	},
	{
		id: "project4",
		title: "Errands",
		numItems: 5,
		color: "teal"
	},
	{
		id: "project5",
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

	/* popovers need to be positioned in the page poperly which needs to be done programatically */
	initializePopovers();

	/* some to-do items have dates at different offsets from the current day, so I'll initialize their text content here */
	initializeDateTexts();

	/* the day names in the 'next 7 days' tab dynamically update based on the current date, this initializes them */
	initializeDayTexts();
}

function selectNoteCategory(id) {
	var noteCategories = document.getElementsByClassName('noteCategory');

	for(var i = 0; i < noteCategories.length; i++) {
		var content = noteCategories[i].querySelector('.project-item-content');
		var title = noteCategories[i].querySelector('.project-item-title');
		var timeGroupText = noteCategories[i].querySelector('p');

		if(noteCategories[i].getAttribute('data-id') == id) {
			if(noteCategories[i].getAttribute('data-category-type') == 'time') {
				noteCategories[i].className = "time-group time-group-selected noteCategory";
				timeGroupText.className = "time-group-text time-group-content time-group-text-selected";
			} else {
				content.className = "project-item-content project-item-content-selected";
				title.className = "project-item-title project-item-title-selected";
			}
		} else {
			if(noteCategories[i].getAttribute('data-category-type') == 'time') {
				noteCategories[i].className = "time-group noteCategory";
				timeGroupText.className = "time-group-text time-group-content";
			} else {
				content.className = "project-item-content";
				title.className = "project-item-title";
			}
		}
	}

	var noteCategoryContents = document.getElementsByClassName('todo-list-content-container');
	for(var i = 0; i < noteCategoryContents.length; i++) {
		var noteContent = noteCategoryContents[i];

		if(noteContent.getAttribute('data-content-for') == id) {
			noteContent.className = "todo-list-content-container todo-list-content-container-selected";
		} else {
			noteContent.className = "todo-list-content-container";
		}
	}
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

/* 
	todo: generate all of the project content pages for each tab; below is what the html looks like;

	all project content pages are to be appended to the 'app-todo-list-container' node 

	<div data-content-for="0" class="todo-list-content-container todo-list-content-container-selected">
		<div class="todo-title-icons-container">
			<p class="todo-title">Personal</p>
			<img id="project-actions-button4" class="todo-content-button" src="assets/actions.png" />
			<div class="popover-container" data-popover-for="project-actions-button4">
				<div class="popover-triangle"></div>
				<div class="popover-content">		
					<p class="popover-title">Project actions</p>
				</div>
			</div>

			<img id="share-options-button1" class="todo-content-button share-options-button" src="assets/add-user.png" />
			<div class="popover-container" data-popover-for="share-options-button1">
				<div class="popover-triangle"></div>
				<div class="popover-content">		
					<p class="popover-title">Share options</p>
				</div>
			</div>

			<img id="project-comments-button4" class="todo-content-button project-comments-button" src="assets/speech.png" />
			<div class="popover-container" data-popover-for="project-comments-button4">
				<div class="popover-triangle"></div>
				<div class="popover-content">		
					<p class="popover-title">Project comments</p>
				</div>
			</div>
		</div>
		<div class="add-todo-container">
			<div class="add-todo-button">
				<img class="add-todo-icon" src="assets/plus.png" />
				<p class="add-todo-text">Add Task</p>
			</div>

			<img id="show-archived-button4" class="show-archived-button" src="assets/refresh.png" />
			<div class="popover-container" data-popover-for="show-archived-button4">
				<div class="popover-triangle"></div>
				<div class="popover-content">		
					<p class="popover-title">Show archived tasks</p>
				</div>
			</div>
		</div>
	</div>
*/

function generateProjects() {
	var projectsTab = document.getElementById('projects-tab');
	var addProjectContainer = document.getElementsByClassName('add-project-container')[0];

	for(var i = 0; i < projectList.length; i++) {
		var project = projectList[i];

		var projectWrapper = document.createElement('div');
		projectWrapper.setAttribute('data-id', project.id);
		projectWrapper.setAttribute('data-category-type', 'project');
		projectWrapper.className = "project-item noteCategory";

		/* */
		addProjectSelectListener(projectWrapper, project.id);

		var dragButton = document.createElement('img');
		dragButton.className = "drag-button";
		dragButton.src = "assets/drag-icon.png";
		projectWrapper.appendChild(dragButton);

		var projectContentWrapper = document.createElement('div');
		projectContentWrapper.className = "project-item-content";
		projectWrapper.appendChild(projectContentWrapper);

		var projectContentIcon = document.createElement('div');
		projectContentIcon.className = "project-item-icon";
		projectContentIcon.style.backgroundColor = "var(--project-color-" + project.color + ")";
		projectContentWrapper.appendChild(projectContentIcon);

		var projectContentTitle = document.createElement('p');
		projectContentTitle.textContent = project.title;
		projectContentTitle.className = "project-item-title";
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
		selectNoteCategory(id);
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

function initializePopovers() {
	var popovers = document.getElementsByClassName('popover-container');

	for(var i = 0; i < popovers.length; i++) {
		var popover = popovers[i];
		var popoverTarget = document.getElementById(popover.getAttribute('data-popover-for'));

		addPopoverListeners(popoverTarget, popover);
	}
}

function addPopoverListeners(tgt, pop) {
	tgt.addEventListener('mouseenter', function() {
		pop.style.top = tgt.offsetTop + tgt.offsetHeight + 3 + "px";
		pop.style.display = "inline-block";

		if(window.outerWidth < tgt.offsetLeft + pop.offsetWidth) {
			pop.style.left = tgt.offsetLeft - pop.offsetWidth + 23 + "px";
			pop.querySelector('.popover-triangle').style.marginLeft = pop.offsetWidth - 24 + "px";
		} else {
			pop.style.left = tgt.offsetLeft - 11 + "px";
			pop.querySelector('.popover-triangle').style.marginLeft = "12px";
		}

		setTimeout(function() {
			pop.style.opacity = 1;
		}, 0);
	});

	tgt.addEventListener('mouseleave', function() {
		pop.style.opacity = 0;
		setTimeout(function() {
			pop.style.display = 'none';
		}, 250);
	});	
}

function initializeDateTexts() {
	var dateTexts = document.getElementsByClassName('date-display');

	for(var i = 0; i < dateTexts.length; i++) {
		var date = dateTexts[i];
		var offset = parseInt(date.getAttribute('data-date-offset')); // in days 

		var theDate = new Date();
		theDate.setTime(theDate.getTime() + (offset * 24 * 60 * 60 * 1000));

		date.textContent = DAYS_SHORTHAND[theDate.getDay()] + " " + MONTHS_SHORTHAND[theDate.getMonth()] + " " + theDate.getDate();
	}
}

function initializeDayTexts() {
	var dayTexts = document.getElementsByClassName('day-display');

	for(var i = 0; i < dayTexts.length; i++) {
		var day = dayTexts[i];
		var offset = parseInt(day.getAttribute('data-date-offset')); // in days 

		var theDate = new Date();
		theDate.setTime(theDate.getTime() + (offset * 24 * 60 * 60 * 1000));

		day.textContent = DAYS[theDate.getDay()];
	}
}




