// does not fully work yet, code works standalone but for some reason not when plugged in
Vue.component("n-form-tinymce", {
	template: "#n-form-tinymce",
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
			timer: null
		}
	},
	ready: function() {
		var self = this;
		var parameters = {
			target: this.$el,
			setup: function(editor) {
				editor.on("change", function(event) {
					if (self.timer) {
						clearTimeout(self.timer);
						self.timer = null;
					}
					self.timer = setTimeout(function() {
						self.$emit("input", editor.getContent());
					}, self.timeout);
				});
			}
		};
		if (this.nodeId) {
			// without images_upload_url set, upload tab won't show up
			parameters['images_upload_url'] = 'non-existent-page';
			// but we overwrite the image upload handler
			parameters['images_upload_handler'] = function (blobInfo, success, failure) {
				self.$services.execute("nabu.cms.attachment.rest.internal.create", {
					nodeId: self.nodeId,
					groupId: self.groupId,
					body: blobInfo
				}).then(function(result) {
					success(self.$services.attachment.url(self.nodeId, result.id));
				}, function(error) {
					failure(error);
				});
			};
		}
		tinymce.init(parameters);
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
				Object.defineProperty(messages[i], 'component', {
					value: this,
					enumerable: false
				});
			}
			this.valid = messages.length == 0;
			return messages;
		}
	}
});


Vue.component("page-form-input-tinymce-configure", {
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

Vue.component("page-form-input-tinymce", {
	template: "<n-form-tinymce ref='form' :value='value' @input=\"function(value) { $emit('input', value) }\" :schema='schema'/>",
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
				component: "page-form-input-tinymce", 
				configure: "page-form-input-tinymce-configure", 
				name: "tinymce",
				namespace: "nabu.page"
			});
		});
	}
});
