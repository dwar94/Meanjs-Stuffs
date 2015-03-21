'use strict';

// Configuring the Articles module
angular.module('repo-modules').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Repo modules', 'repo-modules', 'dropdown', '/repo-modules(/create)?');
		Menus.addSubMenuItem('topbar', 'repo-modules', 'List Repo modules', 'repo-modules');
		Menus.addSubMenuItem('topbar', 'repo-modules', 'New Repo module', 'repo-modules/create');
	}
]);