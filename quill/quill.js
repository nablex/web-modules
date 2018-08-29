Vue.component("n-form-quill", {
	template: "#n-form-quill",
	props: {
		value: {
			required: true
		},
		timeout: {
			type: Number,
			required: false,
			default: 600
		},
		edit: {
			type: Boolean,
			required: false,
			default: true
		},
		required: {
			type: Boolean,
			required: false,
			// explicitly set default value to null, otherwise vue will make it false which we can't distinguish from "not set"
			default: null
		},
		name: {
			type: String,
			required: false
		},
		// a json schema component stating the definition
		schema: {
			type: Object,
			required: false
		},
		pattern: {
			type: String,
			required: false
		},
		minLength: {
			type: Number,
			required: false
		},
		maxLength: {
			type: Number,
			required: false
		},
		// need for imageupload
		nodeId: {
			type: String,
			required: false
		},
		groupId: {
			type: String,
			required: false
		}
	},
	data: function() {
		return {
			timer: null,
			editor: null
		}
	},
	ready: function() {
		var toolbarOptions = [
			['bold', 'italic', 'underline', 'strike'],        // toggled buttons
			['blockquote', 'code-block'],

			[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//			[{ 'header': 1 }, { 'header': 2 }],               // custom button values
			[{ 'list': 'ordered'}, { 'list': 'bullet' }],
			[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
			[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
//			[{ 'direction': 'rtl' }],                         // text direction

//			[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

			[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
			[{ 'font': [] }],
			[{ 'align': [] }],
			
			// depends on the module
			['emoji'],

			['clean']                                         // remove formatting button
		];
		if (this.value) {
			this.$el.innerHTML = this.value;
		}
		this.editor = new Quill(this.$el, {
			theme: "snow",
			modules: {
				imageDrop: true,
				toolbar: toolbarOptions,
				imageResize: {
					// the toolbar offers alignment options
					// however these alignment options are not persisted in html (presumably they are in the delta)
					// you can already do positioning with the alignment in the editor itself so use that
					modules: [ 'Resize', 'DisplaySize' ] // , 'Toolbar'
				},
				toolbar_emoji: true
			}
		});
		var self = this;
		this.editor.on("text-change", function(delta, oldDelta, source) {
			if (self.timer) {
				clearTimeout(self.timer);
				self.timer = null;
			}
			self.timer = setTimeout(function() {
				self.$emit("input", self.$el.querySelector(".ql-editor").innerHTML);
			}, self.timeout);
		});
	},
	computed: {
		definition: function() {
			return nabu.utils.vue.form.definition(this);
		},
		mandatory: function() {
			return nabu.utils.vue.form.mandatory(this);
		}
	},
	methods: {
		validate: function() {
			var messages = nabu.utils.schema.json.validate(this.definition, this.value ? this.value.replace(/<[^>]+>/, "") : this.value, this.mandatory);
			for (var i = 0; i < messages.length; i++) {
				messages[i].component = this;
			}
			this.valid = messages.length == 0;
			return messages;
		}
	}
});


Vue.component("page-form-input-quill-configure", {
	template: "<div/>",
	props: {
		cell: {
			type: Object,
			required: true
		},
		page: {
			type: Object,
			required: true
		},
		// the fragment this image is in
		field: {
			type: Object,
			required: true
		}
	}
});

Vue.component("page-form-input-quill", {
	template: "<n-form-quill ref='form' :value='value' @input=\"function(value) { $emit('input', value) }\" :schema='schema'/>",
	props: {
		cell: {
			type: Object,
			required: true
		},
		page: {
			type: Object,
			required: true
		},
		field: {
			type: Object,
			required: true
		},
		value: {
			required: true
		},
		label: {
			type: String,
			required: false
		},
		timeout: {
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		schema: {
			type: Object,
			required: false
		}
	},
	methods: {
		validate: function(soft) {
			return this.$refs.form.validate(soft);
		}
	}
});

window.addEventListener("load", function() {
	if (application.bootstrap && nabu.page.provide) {
		application.bootstrap(function($services) {
			nabu.page.provide("page-form-input", { 
				component: "page-form-input-quill", 
				configure: "page-form-input-quill-configure", 
				name: "quill",
				namespace: "nabu.page"
			});
		});
		
		nabu.page.provide("page-format", {
			format: function(value) {
				var div = document.createElement("div");
				div.setAttribute("class", "ql-container ql-snow");
				var div2 = document.createElement("div");
				div2.setAttribute("class", "ql-editor");
				if (value) {
					div2.innerHTML = value;
				}
				div.appendChild(div2);
				return div;
			},
			html: true,
			skipCompile: true,
			name: "quill",
			namespace: "nabu.cms"
		});
	}
});