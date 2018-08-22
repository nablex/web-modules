// seems like react is mandatory for the UI bit, don't want to drag it in, stopped trying to get it to work
Vue.component("n-form-alloy", {
	template: "#n-form-alloy",
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
		var self = this;
		setTimeout(function() {
			self.editor = AlloyEditor.editable(self.$el);
			console.log("editor is", self.editor);
		}, 1000);

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


Vue.component("page-form-input-alloy-configure", {
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

Vue.component("page-form-input-alloy", {
	template: "<n-form-alloy ref='form' :value='value' @input=\"function(value) { $emit('input', value) }\" :schema='schema'/>",
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
				component: "page-form-input-alloy", 
				configure: "page-form-input-alloy-configure", 
				name: "alloy",
				namespace: "nabu.page"
			});
		});
	}
});