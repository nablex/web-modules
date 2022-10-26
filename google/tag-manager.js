Vue.service("GoogleTagManager", {
	services: ['page'],
	activate: function(done) {
		var applicationProperties = this.$services.page.getApplicationProperties();
		
		if (!!applicationProperties.googleTagManagerKey) {
			var gtmScript = document.createElement('script');
			gtmScript.setAttribute('async',true);
			gtmScript.setAttribute('src',"https://www.googletagmanager.com/gtag/js?id=" + applicationProperties.googleTagManagerKey);
			document.head.appendChild(gtmScript);

			var gtmScript2 = document.createElement('script');
			gtmScript2.innerHTML = "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '"+applicationProperties.googleTagManagerKey+"');"
			document.head.appendChild(gtmScript2);
		}
		else {
			console.error("Can not configure google tag manager because of missing application parameter: googleTagManagerKey");
		}
		done();
	}
});