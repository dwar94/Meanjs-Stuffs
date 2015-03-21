'use strict';

angular.module('interndbs').directive('infiniteScroll', function() {
	 return {
            restrict: "A",
            link: function(scope, element, attrs) {
                var visibleHeight = $(element).height();
                var threshold = 20;
                console.log("calling directive");
                $(element).scroll(function() {
                    var scrollableHeight = $(element).prop('scrollHeight');
                    var hiddenContentHeight = scrollableHeight - visibleHeight;

                    if (hiddenContentHeight - $(element).scrollTop() <= threshold) {
                        // Scroll is almost at the bottom. Loading more rows
                        scope.$apply(attrs.infiniteScroll);
                    }
		})
	}
};
});