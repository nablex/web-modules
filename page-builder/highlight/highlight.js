var blocksToHighlight = [];

window.addEventListener("load", function() {
	var highlightFormatter = function(value, syntax, inline) {
		var $services = application.services;
		if ($services.vue.$highlightCounter == null) {
			$services.vue.$highlightCounter = 1;
		}
		var id = "format_highlight_" + $services.vue.$highlightCounter++;
		var clazz = syntax ? " class='" + syntax + "'" : "";
		var result = value == null ? null :
			(inline ? "<div id='" + id + "'>" + value + "</div>" : "<pre id='" + id + "'" + clazz + "><code>" + value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</code></pre>");
			
		setTimeout(function() {
			if (!$services.vue.$highlightLoaded) {
				$services.vue.$highlightLoaded = [];
			}
			var loaded = $services.vue.$highlightLoaded;
			
			var highlight = function(id) {
				if (inline) {
					hljs.highlightAll(document.getElementById(id));
				}
				else {
					hljs.highlightBlock(document.getElementById(id));
				}
			}
			
			// included in bundle now, should no longer be triggered
			if (!window.hljs) {
				blocksToHighlight.push(id);
				if (loaded.indexOf("$main") < 0) {
					loaded.push("$main");
					var script = document.createElement("script");
					script.setAttribute("type", "text/javascript");
					script.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/highlight.min.js");
					document.head.appendChild(script);
					script.onload = function() {
						blocksToHighlight.forEach(highlight);
					}
					var link = document.createElement("link");
					link.rel = "stylesheet";
					link.href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/styles/default.min.css";
					document.head.appendChild(link);
				}
			}
			else {
				highlight(id);
			}
		}, 1);
		
		return result;
	};

	nabu.page.provide("page-format", {
		format: highlightFormatter,
		html: true,
		skipCompile: true,
		name: "highlight",
		namespace: "nabu.page"
	});
})