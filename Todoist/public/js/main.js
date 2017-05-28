
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

		generateProjectContentPage(project);
	}
}

function generateProjectContentPage(project) {
	var todoContentContainer = document.getElementsByClassName('app-todo-list-container')[0];

	// the overall project content container 
	var contentContainer = document.createElement('div');
	contentContainer.className = "todo-list-content-container";
	contentContainer.setAttribute('data-content-for', project.id);
	todoContentContainer.appendChild(contentContainer);

	// container for the project title and icons 
	var titleIconsContainer = document.createElement('div');
	titleIconsContainer.className = "todo-title-icons-container";
	contentContainer.appendChild(titleIconsContainer);

	// todo title and action button 
	var todoTitle = document.createElement('p');
	todoTitle.textContent = project.title;
	todoTitle.className = "todo-title";
	titleIconsContainer.appendChild(todoTitle);

	var actionButton = document.createElement('img');
	actionButton.className = "todo-content-button";
	actionButton.src = "assets/actions.png";
	actionButton.id = "projectAction" + project.id;
	titleIconsContainer.appendChild(actionButton);

	// popover 
	var actionButtonPopover = document.createElement('div');
	actionButtonPopover.className = "popover-container";
	actionButtonPopover.setAttribute('data-popover-for', 'projectAction' + project.id);
	titleIconsContainer.appendChild(actionButtonPopover);

	var actionPopoverTriangle = document.createElement('div');
	actionPopoverTriangle.className = "popover-triangle";
	actionButtonPopover.appendChild(actionPopoverTriangle);

	var popoverActionContent = document.createElement('div');
	popoverActionContent.className = "popover-content";
	actionButtonPopover.appendChild(popoverActionContent);

	var popoverActionTitle = document.createElement('p');
	popoverActionTitle.className = "popover-title";
	popoverActionTitle.textContent = "Project actions";
	popoverActionContent.appendChild(popoverActionTitle);

	// share button 
	var shareButton = document.createElement('img');
	shareButton.className = "todo-content-button share-options-button";
	shareButton.src = "assets/add-user.png";
	shareButton.id = "projectShare" + project.id;
	titleIconsContainer.appendChild(shareButton);

	// popover 
	var shareButtonPopover = document.createElement('div');
	shareButtonPopover.className = "popover-container";
	shareButtonPopover.setAttribute('data-popover-for', 'projectShare' + project.id);
	titleIconsContainer.appendChild(shareButtonPopover);

	var sharePopoverTriangle = document.createElement('div');
	sharePopoverTriangle.className = "popover-triangle";
	shareButtonPopover.appendChild(sharePopoverTriangle);

	var popoverShareContent = document.createElement('div');
	popoverShareContent.className = "popover-content";
	shareButtonPopover.appendChild(popoverShareContent);

	var popoverShareTitle = document.createElement('p');
	popoverShareTitle.className = "popover-title";
	popoverShareTitle.textContent = "Share options";
	popoverShareContent.appendChild(popoverShareTitle); 

	// comments button 
	var commentsButton = document.createElement('img');
	commentsButton.className = "todo-content-button project-comments-button";
	commentsButton.src = "assets/speech.png";
	commentsButton.id = "projectComment" + project.id;
	titleIconsContainer.appendChild(commentsButton);

	// popover 
	var commentButtonPopover = document.createElement('div');
	commentButtonPopover.className = "popover-container";
	commentButtonPopover.setAttribute('data-popover-for', 'projectComment' + project.id);
	titleIconsContainer.appendChild(commentButtonPopover);

	var commentPopoverTriangle = document.createElement('div');
	commentPopoverTriangle.className = "popover-triangle";
	commentButtonPopover.appendChild(commentPopoverTriangle);

	var popoverCommentContent = document.createElement('div');
	popoverCommentContent.className = "popover-content";
	commentButtonPopover.appendChild(popoverCommentContent);

	var popoverCommentTitle = document.createElement('p');
	popoverCommentTitle.className = "popover-title";
	popoverCommentTitle.textContent = "Project comments";
	popoverCommentContent.appendChild(popoverCommentTitle); 

	// the container for the to-do section of the content 
	var addTodoContainer = document.createElement('div');
	addTodoContainer.className = "add-todo-container";
	contentContainer.appendChild(addTodoContainer);

	var addTodoButton = document.createElement('div');
	addTodoButton.className = "add-todo-button";
	addTodoContainer.appendChild(addTodoButton);

	var addTodoIcon = document.createElement('img');
	addTodoIcon.src = "assets/plus.png"; 
	addTodoIcon.className = "add-todo-icon";
	addTodoButton.appendChild(addTodoIcon);

	var addTodoText = document.createElement('p');
	addTodoText.className = "add-todo-text";
	addTodoText.textContent = "Add Task";
	addTodoButton.appendChild(addTodoText);

	// the show archived tasks button 
	var archivedButton = document.createElement('img');
	archivedButton.className = "show-archived-button";
	archivedButton.id = "archived" + project.id;
	archivedButton.src = "assets/refresh.png";
	addTodoContainer.appendChild(archivedButton);

	// popover 
	var archivedButtonPopover = document.createElement('div');
	archivedButtonPopover.className = "popover-container";
	archivedButtonPopover.setAttribute('data-popover-for', 'archived' + project.id);
	addTodoContainer.appendChild(archivedButtonPopover);

	var archivedPopoverTriangle = document.createElement('div');
	archivedPopoverTriangle.className = "popover-triangle";
	archivedButtonPopover.appendChild(archivedPopoverTriangle);

	var popoverArchivedContent = document.createElement('div');
	popoverArchivedContent.className = "popover-content";
	archivedButtonPopover.appendChild(popoverArchivedContent);

	var popoverArchivedTitle = document.createElement('p');
	popoverArchivedTitle.className = "popover-title";
	popoverArchivedTitle.textContent = "Show archived tasks";
	popoverArchivedContent.appendChild(popoverArchivedTitle); 
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




