'use strict';

// Configuring the Articles module
angular.module('interndbs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Interndbs', 'interndbs', 'dropdown', '/interndbs(/create)?');
		Menus.addSubMenuItem('topbar', 'interndbs', 'List Interndbs', 'interndbs');
		Menus.addSubMenuItem('topbar', 'interndbs', 'New Interndb', 'interndbs/create');
	}
]);