angular.module('shm_services_select', [
])
.directive('servicesList', [ 'shm_request', function( shm_request ) {
    return {
        restrict: 'E',
        scope: {
            data: '=?data',
            id: '=?id',
        },
        link: function ($scope, $element, $attrs) {
            $scope.readonly = 'readonly' in $attrs;

            var request = 'admin/services.cgi';
            var key_field = 'service_id';

            $scope.$watch('data', function(newValue, oldValue){
                if (!newValue) return;
                $scope.id = newValue[key_field];
            });

            if ( $scope.readonly ) {
                request = request + '?' + key_field + '=' + $scope.id;
            }

            shm_request('GET', request).then(function(data) {
                if (!data) return;
                $scope.items = data;

                if ( $scope.id ) {
                    data.forEach(function(item) {
                        if ( $scope.id == item[key_field] ) {
                            $scope.data = item;
                        }
                    });
                } else $scope.data = data[0];
            });
        },
        templateUrl: "views/shm/modules/services-list/select.html"
    }
}])
;