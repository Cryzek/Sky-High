var cacheName = "sky-high-app-shell";
var dataCacheName = "sky-high-data";

/* On this event, the application shell is cached. The install event fires during the installation phase of the service worker and will fire only once if the service worker is already installed.*/
self.addEventListener('install', function(e) {
	console.log('Service Worker install');
	/* Once the service worker is installed , go ahead and fetch the resources. */
	e.waitUntil(
        caches.open(cacheName)
        	  .then(function(cache) {
            		return cache.addAll([
            			'./',
		                './css/style.css',
		                './js/app.js',
		                './controllers/appCtrl.js',
		                './font/Pacifico.ttf'
            		]).then(function() {
            				/* self.skipWaiting() forces the waiting service worker to become active. */
                			self.skipWaiting();
        			});
        })
    );
});

/* The activate event is fired when the service worker starts up. */
self.addEventListener('activate', function(event) {
	console.log("Serviceworker active.");
});


/* Fetch event gets fired when the browser fetches a resource/url */
self.addEventListener('fetch', function(event) {	
	/* if the resource is cached , use it else go fetch it. */
	event.respondWith(
		caches.match(event.request)
			  .then(function(response) {
			  		if(response) {
			  			return response;
			  		}
			  		else {
			  			return fetch(event.request);
			  		}
			  })
	)
});

