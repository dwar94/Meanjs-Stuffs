'use strict';

// Interndbs controller
angular.module('interndbs').controller('InterndbsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Interndbs',
	function($scope, $stateParams, $location, Authentication, Interndbs) {
		$scope.authentication = Authentication;
        $scope.internarray = [];
        $scope.searchflag = false;
        $scope.startIndex = 0;
        $scope.endIndex = 13;
        $scope.hasLimitReached = false;
		// Create new Interndb
		$scope.create = function() {
			// Create new Interndb object
			var interndb = new Interndbs ({
				name: this.name,
				college: this.college,
				degree: this.degree
			});
			//$scope.ids = [];
			//$scope.internarray.push(interndb);

			// Redirect after save
			interndb.$save(function(response) {
				$location.path('interndbs/' + response._id);
                 //$scope.ids.push(response._id);
				// Clear form fields
				$scope.name = '';
				$scope.college = '';
				$scope.degree = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Interndb
		$scope.remove = function(interndb) {
			if ( interndb ) { 
				interndb.$remove();

				for (var i in $scope.interndbs) {
					if ($scope.interndbs [i] === interndb) {
						$scope.interndbs.splice(i, 1);
					}
				}
			} else {
				$scope.interndb.$remove(function() {
					$location.path('interndbs');
				});
			}
		};

		// Update existing Interndb
		$scope.update = function() {
			var interndb = $scope.interndb;

			interndb.$update(function() {
				$location.path('interndbs/' + interndb._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Interndbs
		$scope.find = function() {
             $scope.interndbs = Interndbs.query({'to': $scope.endIndex, 'from': $scope.startIndex});
             
			/*Interndbs.query({'to': $scope.endIndex, 'from': $scope.startIndex},
				function(interndblist){
					for(var i=0 ;i<interndblist.length;i++){
						$scope.interndbs.push(interndblist[i]);
                     }
				});*/
					
			/*$scope.lazydata = Interndbs.query();
			if($scope.lazydata.length > 10)
                  $scope.lazydata.slice(0,10);
            console.log($scope.interndbs.length);*/  
		};

		// Find existing Interndb
		$scope.findOne = function() {
		$scope.interndb = Interndbs.get({ 
				interndbId: $stateParams.interndbId	
			});
		};
		// for searching in the view
		$scope.search = function(){
			$scope.searchflag = true;
			console.log($scope.searchterm);
			$scope.searchstartIndex = 1;
			$scope.searchendIndex = 10;
			$scope.arr = Interndbs.query({'term': $scope.searchterm, 'to':$scope.searchendIndex, 'from':$scope.searchstartIndex});
            console.log($scope.arr.length);
            if($scope.arr.length <= 0)
            	$scope.hasLimitReached = true;
			/*console.log($scope.interndbs.length);
			//console.log($scope.searchterm.length;
			for(var i=0; i < $scope.interndbs.length;i++){
				for(var j = 0;j < $scope.searchterm.length; j++){
					
					console.log("retrieved name:"+$scope.interndbs[i].name);
					console.log("searchterm:"+$scope.searchterm);
					if($scope.interndbs[i].name[j].toUpperCase() === $scope.searchterm[j].toUpperCase())
						continue;
					else
						break;
				}
				if(j === $scope.searchterm.length){
					console.log("Pushing one element");
					$scope.arr.push($scope.interndbs[i]);
				}
                       
					
			}*/
			if($scope.searchterm.length === 0)
			 $scope.searchflag = false; 

		};
		$scope.addmore = function(){
			
			if(!$scope.hasLimitReached){
				console.log("inside addmore");
				$scope.endIndex  +=  1;
				//$scope.find();
                Interndbs.query({'to': $scope.endIndex, 'from': $scope.startIndex},function(extras){
                	if(extras.length <= 0)
                		$scope.hasLimitReached = true;
                	else{
                		console.log("I got response");
                		$scope.interndbs = extras;
                	}
                });
                //$scope.interndbs.push($scope.extra);
			}
		};
		$scope.searchmore = function(){
			
				console.log("inside search more");
				$scope.searchendIndex  += 1;
				Interndbs.query({'term': $scope.searchterm, 'to':$scope.searchendIndex, 'from':$scope.searchstartIndex},function(extras){
                	if(extras.length <= 0)
                		$scope.hasLimitReached = true;
                	else{
                		console.log("I got response");
                		$scope.arr = extras;
                	}
                });
			
		}
	  /*$('#listview').scroll(function() {
            if(!$scope.hasLimitReached && 
               $('#listview').scrollTop() > 0)
            {
            	console.log("In scroll fun");
                $scope.startIndex = $scope.interndbs.length;
                $scope.endIndex = $scope.interndbs.length+1;
                $scope.find();
            }
        });*/	
	}
]);