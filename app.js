"use strict";
// ? ------------------------------------------------------------------------------------------------------
var baseUrl = 'http://localhost:3000';

// ? ------------------------------------------------------------------------------------------------------

var appModule = angular.module("appathon-frontend", ["ngRoute", 'ngMap'])
      .run(function ($rootScope, $window) {

            // * check if used logged in Or NOT   ---> INITIALLY its false (AS we are NOT USING SESSIONS)
            $rootScope.buyer_loged_in = true; //? to check the user loged in : is BUYER or DEALER
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
            .when('/home', {
                  title: 'Home',
                  controller: 'buyer_home_ctrl',
                  templateUrl: './views/user_pages/buyer_home.html',
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
            $window.location.href = '#!/home';
      } else if ($rs.dealer_loged_in) {
            $window.location.href = '#!/dashboard';
      }


      this.re_render = function () {
            $route.reload();
      };

      this.something = "++++++++++";

      this.logout = function () {
            // console.log(" link clicked");
            this.buyer_loged_in = false;
            this.dealer_loged_in = false;
      };
});



appModule.controller('user_login', function ($scope, $http, $window, $rootScope) {
      var $rs = $rootScope;

      this.usermail = "prashantkr314@gmail.com";
      this.password = "000000";
      this.role = "buyer";

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



appModule.controller('buyer_home_ctrl', function (NgMap, $scope, $http) {
      var google_maps_API_Key = "AIzaSyDSCmtZj4AhNElt0AKf7h3JboQga1qXp4k";
      $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=" + google_maps_API_Key;



      // <!-- Center for now is lucknow -->
      $scope.center = [26.8467, 80.9462];
      $scope.latlng = [26.8467, 80.9462];


      $scope.getpos = function (event) { // function <---- to change the marker postion by clicking on map
            var lat = event.latLng.lat();
            var lng = event.latLng.lng();

            $scope.latlng = [lat, lng];
      };

      NgMap.getMap().then(function (map) {
            console.log(map.getCenter());
            console.log('markers', map.markers);
            console.log('shapes', map.shapes);
            $scope.map = map;
      });

      $scope.placeMarker = function () {
            console.log(this.getPlace());
            var loc = this.getPlace().geometry.location;
            $scope.latlng = [loc.lat(), loc.lng()];
            $scope.center = [loc.lat(), loc.lng()];
      };


      //! http request to get dealer locations
      $scope.array_Records_Object = [];

      var url = "http://localhost:3000/data/allDealers";
      var config = {
            dataType: 'json',
            'Cache-Control': 'no-cache',
            // "Content-Type": "application/json"
            "Content-Type": "application/x-www-form-urlencoded"
      };

      $scope.dataReady = false;

      $http.get(url, config)
            .then(function (response) {
                  console.log("RESPONSE CAME");
                  // console.log(response);
                  $scope.array_Records_Object = response.data;
                  $scope.dataReady = true;

            }, function (reject) {
                  console.log("REJECTED : NO Dealer data Fetched");
                  console.log(reject);
            });

      $scope.showDealer = function (event, dealer) {
            $scope.selectedDealer = dealer;
            $scope.map.showInfoWindow('Dealer-Info', this);
      };
});





appModule.controller("buyer_home_ctrl_____", function ($http) {

      this.google_maps_js_API_Key = "AIzaSyDSCmtZj4AhNElt0AKf7h3JboQga1qXp4k";
      console.log(this.google_maps_js_API_Key);

      // LOADING this it will call the initMap() method
      this.google_maps_js_API_with_my_key = "https://maps.googleapis.com/maps/api/js?key=" +
            this.google_maps_js_API_Key + "&callback=initMap";




      //! http request to get dealer locations
      // this.array_Records_Object = [];
      var array_Records_Object = [];

      var url = "http://localhost:3000/data/allDealers";
      var config = {
            dataType: 'json',
            "Content-Type": "application/json"
      };

      $http.get(url, config)
            .then(function (response) {
                  console.log(response);
                  array_Records_Object = response.data;

            }, function (reject) {
                  console.log("REJECTED : NO Dealer data Fetched");
                  console.log(reject);
            });




      // var array_Records_Object = JSON.parse('<%- array_Records_Object %>'); // catching rendered records
      // console.log(array_Records_Object);

      var center_location = { // ! user's location using GPS HARD-CODED
            lat: 28.7041,
            lng: 77.1025
      };


      var delear_markers_list = [];



      var map;

      function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
                  center: center_location,
                  zoom: 1,
                  gestureHandling: 'cooperative',

            });

            add_markers(map);
            // console.log(delear_markers_list);
      }


      function add_markers(map) {

            array_Records_Object.forEach(cur_record => {
                  console.log(cur_record);

                  // CREATE Dealer_MARKER : object --> to put in the   dealer_markers_list ARRAY,  & plot on map
                  var dealer_marker = {
                        marker_reference: undefined, // NEEDED to attach listner for info window
                        dealer_name: cur_record.name,
                        marker_location: {
                              lat: cur_record.address.lat, // DELHI
                              lng: cur_record.address.long
                        }
                  };

                  delear_markers_list.push(dealer_marker); // ADDING to the  LIST
                  // console.log(dealer_marker);


                  dealer_marker.marker_reference = new google.maps.Marker({ //  create A MARKER
                        map: map,
                        position: dealer_marker.marker_location,
                        draggable: false,
                        animation: google.maps.Animation.DROP,
                        title: dealer_marker.dealer_name
                  });

                  var infoWindow = new google.maps.InfoWindow({ // create info window
                        content: `<h4>${dealer_marker.dealer_name}</h4>
                           <a href="#">more deals</a>`
                  });

                  dealer_marker.marker_reference.addListener('click', function () { // add listner current MARKER
                        infoWindow.open(map, dealer_marker.marker_reference);
                  });
            });
      }


      // ! ------------------------     loading the script ------------------------

      loadScript("google_maps_js_API_with_my_key", this.google_maps_js_API_with_my_key, false); // NOT a critical script
      console.log(this.google_maps_js_API_with_my_key);






      function loadScript(script_name, url, is_critical_script, callback) {
            var kill_time = 4000;

            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);

            script.onload = function () {
                  console.log(script_name + " : script is loaded SUCCESSFULLY");
                  window.clearTimeout(timeOut_id);
            };

            script.onerror = function () {
                  var message = script_name + " : script NOT loaded     ERROR  --CONNECTION PROBLEM-- ";
                  alert(message);
                  window.clearTimeout(timeOut_id);
                  if (is_critical_script)
                        throw new Error(message);
            };

            // if the script can't be loaded
            var timeOut_id = window.setTimeout(() => {
                  var message = script_name + " : script NOT loaded     ERROR  --CONNECTION PROBLEM-- ";
                  alert(message);

                  if (is_critical_script)
                        throw new Error(message);
            }, kill_time);


      }



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