"use strict";
// ? ------------------------------------------------------------------------------------------------------
let baseUrl = 'http://localhost:3000';

//  this.error404 = false;

//       this.errorList = [];


//       // * check if used logged in Or NOT   ---> INITIALLY its false (AS we are NOT USING SESSIONS)
//       this.buyer_loged_in = false; //? to check the user loged in : is BUYER or DEALER
//       this.dealer_loged_in = false;

// ? ------------------------------------------------------------------------------------------------------

var appModule = angular.module("appathon-frontend", ["ngRoute"]);

appModule.config(['$routeProvider', function ($routeProvider) {
      $routeProvider
            .when('/', {
                  title: 'MyKaarma.com',
                  controller: 'main_ctrl',
                  templateUrl: './views/root.html',
            })
            .when('/home', {
                  title: 'Home',
                  // controller: 'buyer_home_ctrl',
                  templateUrl: './views/user_pages/buyer_home.html',
            })
            .when('/dashboard', {
                  title: 'Dashboard',
                  // controller: 'dealer_home_ctrl',
                  templateUrl: './views/user_pages/dealer_home.html',
            })
            .when('/admins/login', {
                  title: 'Admin-login',
                  templateUrl: "./views/admin_pages/admin_login.html",
                  controller: '_______',
            })
            .when('/admins/signup', {
                  title: 'Admin-signup',
                  templateUrl: "./views/admin_pages/admin_signup.html",
                  controller: '_______',
            })
            .when('/users/login', { // depends the user is a BUYER or  DEALER
                  title: 'Login',
                  templateUrl: "./views/user_pages/user_login.html",
                  controller: 'user_login',
            })
            .when('/users/signup', { // depends the user is a BUYER or  DEALER
                  title: 'Signup',
                  templateUrl: "./views/user_pages/user_signup.html",
                  controller: 'user_signup',
            })
            // .when('', {})
            .otherwise({
                  title: 'ERROR',
                  // templateUrl: "./views/page404.html",
                  // templateUrl: "/",
                  // controller: 'error_404_ctrl',
                  redirectTo: "/"
            });
}]);

// ! ========================================================

appModule.controller("main_ctrl", function ($window) { // NOT doing $scope injection   --> this refers to $scope
      this.error404 = false;

      this.errorList = [];

      console.log(this.buyer_loged_in);

      // * check if used logged in Or NOT   ---> INITIALLY its false (AS we are NOT USING SESSIONS)
      this.buyer_loged_in = false; //? to check the user loged in : is BUYER or DEALER
      this.dealer_loged_in = false;

      console.log(this.buyer_loged_in);



      // ? if the user is loged in don't show the car LOGO to him
      if (this.buyer_loged_in) {
            $window.location.href = '/home';
      } else if (this.dealer_loged_in) {
            $window.location.href = '/dashboard';
      }


      this.something = "++++++++++";

      this.logout = function () {
            // console.log(" link clicked");
            this.buyer_loged_in = false;
            this.dealer_loged_in = false;
      };
});



appModule.controller('user_login', function ($scope, $http, $window) {
      // $http.get("http://localhost:3000/buyer/hello")
      //       .then(function (response) {
      //             $scope = response.data;
      //             console.log($scope);
      //       });

      // ! accessing the parent scope
      console.log($scope.main.something);
      $scope.main.something = "&&&&&";
      console.log($scope.main.something);
      //! ------------------------------



      this.send_data = function (usermail, password, role) {

            let validationErrors = validate_login_credentials(usermail, password, role);
            console.log(validationErrors);
            // console.log(usermail, password, role);

            if (validationErrors.length === 0) { //? ie if no errors do a post request to login backend
                  let url;

                  if (role === "buyer") {
                        url = baseUrl + "/buyer/login";
                  } else {
                        url = baseUrl + "/dealer/login";
                  }


                  let data = {
                        email: usermail,
                        password: password
                  };


                  var config = {
                        dataType: 'json',
                        "Content-Type": "application/json"
                  };

                  // console.log(url);
                  $http.post(url, data, config)
                        .then(function (response) {
                              console.log(response); //?do something witht the response

                              if (response.data.status === 200) {
                                    allow_user_to_log_in(role); //? show success message to user
                              } else {
                                    // todo : show erros to the user
                              }

                        }, function (reject) {
                              console.log(reject); // ?show the exception
                        });

            }
      };

      function allow_user_to_log_in(role) {
            // ! accessing the parent scope

            // ? main --> is the alias for the main_controller which is parent of ueser_login controller
            if (role === "buyer") {
                  $scope.main.buyer_loged_in = true;
            } else {
                  $scope.main.dealer_loged_in = true;
            }

            console.log(`Allowed :  ${role} to log in!`);
            alert();
            $window.location.href = "/";

      }


      function validate_login_credentials(usermail, password, role) {
            let ve = [];

            console.log(usermail);

            // ? simple validation
            if (usermail === "" || usermail === undefined) { // can't be empty
                  ve.push("UserMail is required");
            } else if (usermail.length < 4) {
                  ve.push("UserMail must be min 5 character long");
            }

            if (password === "" || password === undefined) {
                  ve.push("password is required");
            } else if (password.length < 4) {
                  ve.push("password must be min 5 character long");
            }
            if (role === undefined) {
                  ve.push("select a role");
            }

            return ve;
      }

});



appModule.controller("user_signup", function ($http, $window) {



      this.send_data = function (username, email, password, password_2, address, role) {
            let validationErrors = validate_signup_credentials(username, email, password, password_2, address, role);

            // console.log(validationErrors);

            if (validationErrors.length === 0) { //? ie if no errors do a post request to login backend
                  let url;

                  if (role === "buyer") {
                        url = baseUrl + "/buyer/signup";
                  } else {
                        url = baseUrl + "/dealer/signup";
                  }

                  let data = {
                        username: username,
                        email: email,
                        password: password,
                        address: address, // Todo : at this point use geocoding to get the lat long of user
                  };


                  var config = {
                        dataType: 'json',
                        "Content-Type": "application/json"
                  };

                  // console.log(url);
                  $http.post(url, data, config)
                        .then(function (response) {
                              console.log(response);
                              if (response.data.status === 200) { //? user is registered ---> REDIRECT
                                    $window.location.href = '#!/users/login';
                              } else {
                                    // TODO : show errors to the user
                              }

                        }, function (reject) {
                              console.log(reject);
                        });

            }


      };


      function validate_signup_credentials(username, email, password, password_2, address, role) {
            let ve = [];

            // ? simple validation
            if (username === undefined || username === "") { // can't be empty
                  ve.push("Username is required");
            } else if (username.length < 4 || username.length > 15) {
                  ve.push("Username can be min:5 and max:15 character long");
            }

            if (email === undefined || email === "") {
                  ve.push("Email is required");
            }

            if (address === undefined || address === "") {
                  ve.push("Address is required");
            } else if (address.length < 10) {
                  ve.push("Address must be min 10 character long");
            }

            if (password === "" || password === undefined) {
                  ve.push("Password is required");
            } else if (password.length < 4) {
                  ve.push("Password must be min 5 character long");
            }

            if (password_2 === "" || password_2 === undefined) {
                  ve.push("Confirm your password");
            } else if (password !== password_2) {
                  ve.push("Passwords do not match");
            }

            if (role === undefined) {
                  ve.push("Select a role");
            }


            return ve;
      }

});


appModule.factory("isBuyerLogedIn", function () {


});

appModule.factory("isDealerLogedIn", function () {

});













// ! ========================================================


// ? chang page title
appModule.run(['$rootScope', '$route', function ($rootScope, $route) {
      $rootScope.$on('$routeChangeSuccess', function () {
            document.title = $route.current.title;
      });
}]);