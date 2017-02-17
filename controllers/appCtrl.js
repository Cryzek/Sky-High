app.controller('AppController', function($http) {
	
	var self = this;
	self.navbarOpened = false;

	/* Navbar helpers */
	self.openNavbar = function() {
		self.navbarOpened = true;
	}

	self.closeNavbar = function() {
		self.navbarOpened = false;
    }


    /* Arrivals */
    self.arrivals = [
    ];


    self.$content = $("#content");
    /* offline helpers */
    self.showOfflineWarning = function() {
        // disable the live data
        self.$content.addClass('loading');
    }

    self.hideOfflineWarning = function() {
        // enable the live data
        self.$content.classList.removeClass('loading')
        // remove the offline message
        document.getElementById("offline").remove();
        // load the live data
    }

    var dataUrl = "data.json";
    if( "caches" in window ) {
        caches.match(dataUrl)
              .then(function(response) {
                  if(response) {
                      console.log(response);
                      response.json().then(function(data) {
                          console.log(data);
                      });
                  }
                  else {
                      $http.get(dataUrl)
                           .then(function(response) {
                                    if(response) {
                                        self.arrivals = response.data;
                                    }
                                },
                                function(error) {
                                  console.log(error);
                               }
                           ); 
                  }
        });
    }

});