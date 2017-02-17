var cacheName = "sky-high-app-shell";
var dataCacheName = "sky-high-data";

var filesToCache = [
	"./",
	"./manifest.json",
    "./css/style.css",
    "https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/js/materialize.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular.min.js",
    "https://code.jquery.com/jquery-3.1.1.min.js",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/css/materialize.min.css",
	"./js/app.js",
	"./controllers/appCtrl.js",
	"./font/Pacifico.ttf"
];

/* On this event, the application shell is cached. The install event fires during the installation phase of the service worker and will fire only once if the service worker is already installed.*/
self.addEventListener('install', function(e) {
	console.log('[Service worker] install');
	/* Once the service worker is installed , go ahead and fetch the resources. */
	e.waitUntil(
        caches.open(cacheName)
        	  .then(function(cache) {
            		return cache.addAll(filesToCache)
            					.then(function() {
		            				/* self.skipWaiting() forces the waiting service worker to become active. */
		                			self.skipWaiting();
        						});
        })
    );
});

/* The activate event is fired when the service worker starts up. */
self.addEventListener('activate', function(event) {
	console.log("[Service worker] active.");
	event.waitUntil(
		caches.keys()
			  .then(function(keyList) {
			  		return Promise.all(keyList.map( function(key) {
			  			if(key !== cacheName && key != dataCacheName) {
			  				console.log(`[Service worker] removing old cache ${key}`);
			  				return caches.delete(key);
			  			}
			  		}));
			  })
	);
});


/* Fetch event gets fired when the browser fetches a resource/url */
self.addEventListener('fetch', function(event) {	
	var dataUrl = "data.json";
	if( event.request.url.indexOf(dataUrl) > -1) {
		event.respondWith(
			caches.open(dataCacheName)
				  .then(function(cache) {
				  		/* Go on and fetch the resource */
				  		return fetch(event.request)
				  				.then(function(response) {
				  					if(!response.ok) {
				  						throw Error(response.statusText);
				  					}
				  					return response;
				  				})
				  				.then(function(response) {
				  					cache.put(event.request.url, response.clone());
				  					return response;	
				  				})
				  				.catch(function(err) { 
				  					console.log(err); 
				  				});
				  })
		);
	}
	else {
		/* if the resource is cached , use it else go fetch it. */
		event.respondWith(
			caches.match(event.request)
				  .then(function(response) {
				  		return response || fetch(event.request);
				  })
		)
	}
});