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

    /* Register service workers */
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./serviceworker.js')
            .then(function() { 
                console.log('[Service Worker] Registered'); 
            });
    }

    var dataUrl = "data.json";
    if( "caches" in window ) {
        console.log("Cached data available.");
        caches
            .match(dataUrl)
            .then(function(response) {
                var r = response.clone();
                if(response) {
                    response.json().then(addData);
                    function addData(data) {
                        data.forEach(addToArrivals);
                        function addToArrivals(val){
                            self.arrivals.push(val);
                        };
                    };
                }
            });
    }
        
    $http.get(dataUrl).then(
            function(response) {
                if(response) {
                    self.arrivals = response.data;
                }
            },
            function(error) {
                console.log(error);
            }
        ); 

});