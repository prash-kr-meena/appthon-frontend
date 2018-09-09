"use strict";
// ? ------------------------------------------------------------------------------------------------------
var baseUrl = 'http://localhost:3000';


var rad = function (x) {
      return x * Math.PI / 180;
};

//  p1 = [lat, lng]
var getDistance = function (p1, p2) {
      var R = 6378137; // Earth’s mean radius in meter
      var dLat = rad(p2.lat - p1.lat);
      var dLong = rad(p2.lng - p1.lng);
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d / 1000; // returns the distance in meter --> now kilometed (i changed it)
};



// ? ------------------------------------------------------------------------------------------------------

var appModule = angular.module("appathon-frontend", ["ngRoute", 'ngMap'])
      .run(function ($rootScope, $window) {

            // * check if used logged in Or NOT   ---> INITIALLY its false (AS we are NOT USING SESSIONS)
            $rootScope.buyer_loged_in = false; //? to check the user loged in : is BUYER or DEALER
            $rootScope.dealer_loged_in = false;
            $window.location.href = "#!/";
      });

appModule.config(['$routeProvider', function ($routeProvider) {
      $routeProvider
            .when('/', {
                  title: 'MyKaarma.com',
                  controller: 'main_ctrl',
                  templateUrl: './views/root.html',
            })
            .when('/dealers', {
                  title: 'Dealers',
                  controller: 'buyer_show_dealers_ctrl',
                  templateUrl: './views/user_pages/buyer_show_dealers.html',
            })
            .when('/cars', {
                  title: 'Cars',
                  controller: 'buyer_car_ctrl',
                  templateUrl: './views/user_pages/buyer_cars.html',
            })
            .when('/dashboard', {
                  title: 'Dashboard',
                  controller: 'dealer_home_ctrl',
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

appModule.controller("main_ctrl", function ($window, $rootScope, $route) { // NOT doing $scope injection   --> this refers to $scope
      var $rs = $rootScope;

      this.error404 = false;

      this.errorList = [];

      console.log($rs.buyer_loged_in);
      console.log($rs.dealer_loged_in);


      // ? if the user is loged in don't show the car LOGO to him
      if ($rs.buyer_loged_in) {
            $window.location.href = '#!/cars';
      } else if ($rs.dealer_loged_in) {
            $window.location.href = '#!/dashboard';
      }


      this.re_render = function () {
            $route.reload();
      };

      this.something = "++++++++++";

      this.logout = function () {
            console.log(" link clicked");
            $rootScope.buyer_loged_in = false;
            $rootScope.dealer_loged_in = false;
      };
});



appModule.controller('user_login', function ($scope, $http, $window, $rootScope) {
      var $rs = $rootScope;

      this.usermail = "prashantkr314@gmail.com";
      this.password = "000000";
      this.role = "buyer";

      // ! accessing the parent scope
      // console.log($scope.main.something);
      // $scope.main.something = "&&&&&";
      // console.log($scope.main.something);
      // //! ------------------------------



      this.send_data = function (usermail, password, role) {

            var validationErrors = validate_login_credentials(usermail, password, role);
            console.log(validationErrors);
            // console.log(usermail, password, role);

            if (validationErrors.length === 0) { //? ie if no errors do a post request to login backend
                  var url;

                  if (role === "buyer") {
                        url = baseUrl + "/buyer/login";
                  } else {
                        url = baseUrl + "/dealer/login";
                  }


                  var data = {
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
                  console.log(`before changing : ${$rs.buyer_loged_in}`);
                  $rs.buyer_loged_in = true;
                  console.log(`AFTER changing : ${$rs.buyer_loged_in}`);
            } else {
                  $rs.dealer_loged_in = true;
            }

            console.log(`Allowed :  ${role} to log in!`);
            // alert();
            $window.location.href = "#!/";

      }


      function validate_login_credentials(usermail, password, role) {
            var ve = [];

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
            var validationErrors = validate_signup_credentials(username, email, password, password_2, address, role);

            // console.log(validationErrors);

            if (validationErrors.length === 0) { //? ie if no errors do a post request to login backend
                  var url;

                  if (role === "buyer") {
                        url = baseUrl + "/buyer/signup";
                  } else {
                        url = baseUrl + "/dealer/signup";
                  }

                  var data = {
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
            var ve = [];

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




appModule.controller('buyer_show_dealers_ctrl', function (NgMap, $scope, $http) {
      //! http request to get dealer locations


      var url = baseUrl + "/data/allDealers";
      var config = {
            dataType: 'json',
            'Cache-Control': 'no-cache',
            // "Content-Type": "application/json"
            "Content-Type": "application/x-www-form-urlencoded"
      };

      $scope.dataReady = false;
      $scope.dealerList = [];
      $scope.array_Records_Object = [];

      var dealerCount = 0;
      $http.get(url, config)
            .then(function (response) {
                  // console.log(response.data);
                  (response.data).forEach(dealerObject => {
                        dealerObject.visible = true;
                        $scope.dealerList.push(dealerObject);

                        if (dealerCount === response.data.length - 1) {
                              $scope.dataReady = true; // intitially all are visible
                              // console.log($scope.dealerList);
                        }
                        dealerCount++;
                  });
            }, function (reject) {
                  console.log("REJECTED : NO Dealer data Fetched");
                  console.log(reject);
            });



      $scope.showDealer = function (event, dealer) {
            $scope.selectedDealer = dealer;
            $scope.map.showInfoWindow('Dealer-Info', this);
      };



      // ? ==================== playing with map ====================
      // var google_maps_API_Key = "AIzaSyDSCmtZj4AhNElt0AKf7h3JboQga1qXp4k";
      var google_maps_API_Key = "AIzaSyAHnTFFFAs0xNflQxehDK--8yTiMqOOYVM"; //! enrichAi api key
      $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=" + google_maps_API_Key + "&callback=initMap";


      // <!-- Center for now is lucknow -->
      $scope.center = [25.3176, 82.9739]; // [lat, lng]
      $scope.my_latlng = [25.3176, 82.9739];


      $scope.getpos = function (event) { // function <---- to change the marker postion by clicking on map
            var lat = event.latLng.lat();
            var lng = event.latLng.lng();

            $scope.my_latlng = [lat, lng];
            $scope.limit_markers_and_redraw();
      };

      NgMap.getMap().then(function (map) {
            console.log(map.getCenter());
            console.log('markers', map.markers);
            console.log('shapes', map.shapes);
            $scope.map = map;
      });


      //? for placing marker using the --> the search box
      $scope.placeMarker = function () {
            console.log(this.getPlace());
            var loc = this.getPlace().geometry.location;
            $scope.my_latlng = [loc.lat(), loc.lng()];
            $scope.center = [loc.lat(), loc.lng()];
      };


      $scope.limit_markers_and_redraw_event = function (keyEvent) {
            if (keyEvent.which === 13) {
                  $scope.limit_markers_and_redraw();
            }
      };


      $scope.desired_distance = 200;
      $scope.limit_markers_and_redraw = function () {
            if ($scope.desired_distance >= 0) {

                  var myLocation = {
                        lat: $scope.my_latlng[0],
                        lng: $scope.my_latlng[1]
                  };
                  var dealerCount = 0;


                  $scope.dealerList.forEach(dealerObject => {
                        var dealerLocation = {
                              lat: dealerObject.address.lat,
                              lng: dealerObject.address.long
                        };

                        var distance_in_km = getDistance(myLocation, dealerLocation);
                        // console.log("distance_in_km", distance_in_km);

                        if (distance_in_km <= $scope.desired_distance) {
                              dealerObject.visible = true;
                              $scope.map.markers[dealerObject._id].setMap($scope.map);
                        } else {
                              dealerObject.visible = false;
                              $scope.map.markers[dealerObject._id].setMap(null);
                        }

                        dealerCount++;
                        if (dealerCount === $scope.dealerList.length) {
                              // termintate
                              console.log("dealer location visibility status updated");
                              // console.log($scope.dealerList);
                        }


                  });
            } else {
                  console.log("distance can not be < 0");
            }
      };


      // -=====-=====-=====-=====-=====-=====-=====-=====-=====-=====-=====-=====


      // $scope.showMarkers = function () {
      //       for (var key in $scope.map.markers) {
      //             // if(key.id == )
      //             $scope.map.markers[key].setMap($scope.map);
      //       }
      // };

      // $scope.hideMarkers = function () {
      //       for (var key in $scope.map.markers) {
      //             $scope.map.markers[key].setMap(null);
      //       }
      // };





});



appModule.controller("buyer_car_ctrl", function ($scope, $http) {

      var url_get_All_companies = baseUrl + "/data/companies";

      var config = {
            dataType: 'json',
            'Cache-Control': 'no-cache',
            // "Content-Type": "application/json"
            "Content-Type": "application/x-www-form-urlencoded"
      };

      $scope.companyList_ready = false;
      $scope.company_list = []; // this is to send so we can get all the cars for these companies

      $http.get(url_get_All_companies, config)
            .then(function (response) {
                  console.log("RESPONSE CAME");
                  // console.log(response);
                  $scope.company_names = response.data;
                  $scope.companyList_ready = true;

            }, function (reject) {
                  console.log("REJECTED : NO Company name fetched");
                  console.log(reject);
            });

      $scope.change = function (company, active) {
            console.log("changed");
            console.log(company);

            if (active) {
                  $scope.company_list.push(company);
            } else {
                  $scope.company_list.splice($scope.company_list.indexOf(company), 1);
            }

            console.log($scope.company_list);
      };



      $scope.transmission = "Automatic";
      $scope.year_model = 2010;
      $scope.car_color = "Silver";

      $scope.transmission_options = [
            "Automatic",
            "Manual"
      ];

      $scope.year_model_options = [
            2010,
            2011,
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
      ];

      $scope.car_color_options = [
            "Silver",
            "Yellow",
            "Grey",
            "Metallic White",
            "Black",
            "Blue",
      ];


      $scope.change_year = function (year_model) {
            $scope.year_model = year_model;
            console.log($scope.year_model);
      };

      $scope.change_transmission = function (transmission) {
            $scope.transmission = transmission;
            console.log($scope.transmission);
      };


      $scope.change_color = function (car_color) {
            $scope.car_color = car_color;
            console.log($scope.car_color);
      };

      $scope.body_color = [

      ];

});


appModule.controller("dealer_home_ctrl", function () {

});












// ! ========================================================


// ? chang page title
appModule.run(['$rootScope', '$route', function ($rootScope, $route) {
      $rootScope.$on('$routeChangeSuccess', function () {
            document.title = $route.current.title;
      });
}]);