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
        {
            source: "London",
            destination: "California",
            time: "8:45 AM",
            delay: false
        },
        {
            source: "Delhi",
            destination: "Mumbai",
            time: "8:15 AM",
            delay: true
        },
        {
            source: "Paris",
            destination: "Madrid",
            time: "8:25 AM",
            delay: false
        }

    ];

    /* offline helpers */
    self.showOfflineWarning = function() {
        // disable the live data
        document.querySelector(".arrivals-list").classList.add('loading')
            // load html template informing the user they are offline
        var request = new XMLHttpRequest();
        request.open('GET', './offline.html', true);

        request.onload = function() {
            if (request.status === 200) {
                // success
                // create offline element with HTML loaded from offline.html template
                var offlineMessageElement = document.createElement("div");
                offlineMessageElement.setAttribute("id", "offline");
                offlineMessageElement.innerHTML = request.responseText;
                document.getElementById("main").appendChild(offlineMessageElement);
            } else {
                // error retrieving file
                console.warn('Error retrieving offline.html');
            }
        };

        request.onerror = function() {
            // network errors
            console.error('Connection error');
        };

        request.send();
    }

    self.hideOfflineWarning = function() {
        // enable the live data
        document.querySelector(".arrivals-list").classList.remove('loading')
        // remove the offline message
        document.getElementById("offline").remove();
        // load the live data
    }

});