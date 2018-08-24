/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.login-history' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';

  angular.module('frontend.websites')
    .controller('WebsitesController', [
      '$scope', '$rootScope', '$log', '$state', 'ApiService', '$uibModal', 'DialogService', 'UserService',
      'MessageService', 'SettingsService', '$http', 'Upload', 'Semver', '$timeout', 'WebsiteModel', 'ListConfig',
      function controller($scope, $rootScope, $log, $state, ApiService, $uibModal, DialogService, UserService,
                          MessageService, SettingsService, $http, Upload, Semver, $timeout, WebsiteModel, ListConfig) {


        WebsiteModel.setScope($scope, false, 'items', 'itemCount');
        $scope = angular.extend($scope, angular.copy(ListConfig.getConfig('website', WebsiteModel)));
        $scope.user = UserService.user();


        $scope.openAddWebsiteModal = function (website) {
          var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/app/websites/add-websites-modal.html',
            controller: function ($scope, $uibModal, $uibModalInstance, DialogService, _website) {
              $scope.update = _website
              $scope.data = _website || {}
              $scope.close = function () {
                return $uibModalInstance.dismiss()
              }


              $scope.submit = function () {
                var data = angular.copy($scope.data);
                console.log(data)
                WebsiteModel.create(data)
                  .then(function (resp) {
                    console.log('Success', resp.data);
                    $uibModalInstance.dismiss({
                      data: resp
                    })
                  }).catch(function (err) {
                  console.error('Error', err);
                  handleErrors(err)
                })

              }


              function handleErrors(err) {
                $scope.errors = {}

                if (err.data) {
                  if (err.data.customMessage) {

                    for (var key in err.data.customMessage) {
                      $scope.errors[key] = err.data.customMessage[key]
                    }
                  }

                  if (err.data.message) {
                    $scope.errorMessage = err.data.message
                  }
                } else {
                  $scope.errorMessage = "An unknown error has occured"
                }


                //console.log("SCOPE ERRORS",$scope.errors)
              }

            },
            controllerAs: '$ctrl',
            resolve: {
              _website: function () {
                return website
              }
            }
            //size: 'lg',
          });

          modalInstance.result.then(function () {

          }, function (data) {
            if (data && data.data) _fetchData()
          });
        }


        function _fetchData() {
          $scope.loading = true;
          WebsiteModel.load({
            size: $scope.itemsFetchSize
          }).then(function (response) {
            console.log(response)
            $scope.items = response;
            $scope.loading = false;

            if (response.data && Object.keys(response.data).length) {
              $scope.websites = Semver.cmp($rootScope.Gateway.version, "0.10.1") > 0 ? response.data.data : response.data
            } else {
              $scope.websites = []
            }
          })
        }

        _fetchData()


        $scope.$on('user.node.updated', function (node) {
          $timeout(function () {
            _fetchData()
          })

        })

      }
    ])
  ;
}());
