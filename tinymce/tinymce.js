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
			branding: false,
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
			images_upload_url: 'non-existent-page',
			// but we overwrite the image upload handler
			images_upload_handler: function (blobInfo, success, failure) {
				self.$services.execute("nabu.cms.attachment.rest.internal.create", {
					nodeId: self.nodeId,
					groupId: self.groupId,
					body: blobInfo
				}).then(function(result) {
					success(self.$services.attachment.url(self.nodeId, result.id));
				}, function(error) {
					failure(error);
				});
			}
		}
		tinymce.init(parameters);
	}
});