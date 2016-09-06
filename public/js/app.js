angular.module("usersApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller: "ListController",
                resolve: {
                    users: function(Users) {
                        return Users.getUsers();
                    }
                }
            })
            .when("/new/user", {
                controller: "NewUserController",
                templateUrl: "user-form.html"
            })
            .when("/user/:userId", {
                controller: "EditUserController",
                templateUrl: "user.html"
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("Users", function($http) {
        this.getUsers = function() {
            return $http.get("/users").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding users.");
                });
        }
        this.createUser = function(user) {
            return $http.post("/users", user).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error creating user.");
                });
        }
        this.getUser = function(userId) {
            var url = "/users/" + userId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this user.");
                });
        }
        this.editUser = function(user) {
            var url = "/users/" + user._id;
            console.log(user._id);
            return $http.put(url, user).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error editing this user.");
                    console.log(response);
                });
        }
        this.deleteUser = function(userId) {
            var url = "/users/" + userId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error deleting this user.");
                    console.log(response);
                });
        }
    })
    .controller("ListController", function(users, $scope) {
        $scope.users = users.data;
    })
    .controller("NewUserController", function($scope, $location, Users) {
        $scope.back = function() {
            $location.path("#/");
        }

        $scope.saveUser = function(user) {
            Users.createUser(user).then(function(doc) {
                var userUrl = "/user/" + doc.data._id;
                $location.path(userUrl);
            }, function(response) {
                alert(response);
            });
        }
    })
    .controller("EditUserController", function($scope, $routeParams, Users) {
        Users.getUser($routeParams.userId).then(function(doc) {
            $scope.user = doc.data;
        }, function(response) {
            alert(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.userFormUrl = "user-form.html";
        }

        $scope.back = function() {
            $scope.editMode = false;
            $scope.userFormUrl = "";
        }

        $scope.saveUser = function(user) {
            users.editUser(user);
            $scope.editMode = false;
            $scope.userFormUrl = "";
        }

        $scope.deleteUser = function(userId) {
            Users.deleteUser(userId);
        }
    });