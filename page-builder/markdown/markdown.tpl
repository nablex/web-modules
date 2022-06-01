<template id="typography-markdown">
	<div class="is-content">
		<n-form-text type="area" v-if="edit" v-model="cell.state.content" :timeout="100"/>
		<span v-else v-html="interpret(cell.state.content)"></span>
	</div>
</template>