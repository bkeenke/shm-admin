angular
    .module('shm_tickets', [
    ])
    .service('shm_tickets', [ '$modal', 'shm_request', '$window', function( $modal, shm_request, $window ) {
        this.edit = function(row) {
            return $modal.open({
                templateUrl: 'views/tickets_view.html',
                controller: function ($scope, $modalInstance ) {
                    $scope.title = 'Тикет';
                    $scope.data = angular.copy(row);

                    var intervalId = setInterval(function() {
                        shm_request('GET', 'v1/admin/tickets/' + $scope.data.id).then(function(response) {
                            $scope.data.messages = response.data.data[0].messages;
                            console.log(response.data.data[0].messages);
                        });
                    }, 5000);

                    function clearRequestInterval() {
                        if (intervalId) {
                            clearInterval(intervalId);
                            intervalId = null;
                        }
                    }

                    $scope.close = function() {
                        clearRequestInterval();
                        $modalInstance.close($scope.data);
                    };

                    $scope.newMessage = '';

                    $scope.sendMessage = function() {
                        if (!$scope.newMessage.trim()) return;
            
                        var reply = {
                            id: $scope.data.id,
                            message: $scope.newMessage,
                            answer: 1
                        };
            
                        $scope.data.messages.push(reply);
                        $scope.newMessage = '';
            
                        shm_request('POST', 'v1/admin/tickets', reply);
                    };
                    $scope.closeTicket = function() {
                        shm_request('POST', 'v1/admin/tickets/close', { id: $scope.data.id, user_id: $scope.data.user_id } ).then(function(response) {
                            angular.extend( $scope.data, response.data.data[0] );
                        });
                        
                        clearRequestInterval();
                        $modalInstance.close();
                    };

                    function clearRequestInterval() {
                        if (intervalId) {
                            clearInterval(intervalId);
                            intervalId = null;
                        }
                    };

                    $scope.$on('$destroy', clearRequestInterval);
                },
                size: 'lg',
            });
        };
    }])
    .controller('ShmTicketsController', ['$scope', 'shm_request', 'shm_tickets', function($scope, shm_request, shm_tickets) {
        'use strict';

        $scope.url = 'v1/admin/tickets';

        $scope.columnDefs = [
            {
                field: 'id',
                displayName: 'ID',
                width: 100,
                filter: {},
            },
            {
                field: 'user_id',
                displayName: 'UID',
                width: 200,
                filter: { term: $scope.user.user_id },
            },
            {
                field: 'status',
                filter: {},
            },
            {
                field: 'created',
            },
        ];
        $scope.row_dbl_click = function(row) {
            shm_tickets.edit(row).result.then(function(data){
                angular.extend( row, data );
            }, function(resp) {
                if ( resp === 'delete' ) {
                    $scope.gridOptions.data.splice( $scope.gridOptions.data.indexOf( row ), 1 );
                }
            });
        };

    }]);