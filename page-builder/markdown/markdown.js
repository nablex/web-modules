Vue.view("typography-markdown", {
	icon: "modules/markdown/logo.png",
	description: "Write content using markdown syntax",
	name: "Markdown",
	category: "Typography",
	props: {
		page: {
			type: Object,
			required: true
		},
		parameters: {
			type: Object,
			required: false
		},
		childComponents: {
			type: Object,
			required: false
		},
		cell: {
			type: Object,
			required: true
		},
		edit: {
			type: Boolean,
			required: true
		}
	},
	methods: {
		interpret: function(content) {
			var markdown = nabu.page.providers("page-format").filter(function(x) {
				 return x.name == "markdown";
			})[0];
			var result = markdown ? markdown.format(content) : content;
			var highlighter = nabu.page.providers("page-format").filter(function(x) {
				 return x.name == "highlight";
			})[0];
			if (highlighter) {
				result = highlighter.format(result, null, true);
			}
			return result;
		}
	}
});

var markdownToParse = [];
window.addEventListener("load", function() {
	nabu.page.provide("page-format", {
		format: function(value) {
			var $services = application.services;
			if ($services.vue.$highlightCounter == null) {
				$services.vue.$highlightCounter = 1;
			}
			var id = "format_markdown_" + $services.vue.$highlightCounter++;
			// we want to hide it while it's loading
			var result = value == null ? null : "<div style='opacity: 0' data-id='" + id + "'>" + value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</div>";
			var compile = function(id) {
				var converter = new showdown.Converter();
				converter.setFlavor('github');
				var part = document.querySelector("[data-id='" + id + "']");
				if (part) {
					part.innerHTML = nabu.utils.elements.sanitize(converter.makeHtml(part.innerHTML)).replace(/&amp;lt;/g, "&lt;").replace(/&amp;gt;/g, "&gt;");
					part.style.opacity = 1;
				}
			};
			setTimeout(function() {
				compile(id);
			}, 1);
			
			return result;
		},
		html: true,
		skipCompile: true,
		name: "markdown",
		namespace: "nabu.page"
	});
})