<template id="n-form-quill">
	<div class="n-form-component n-form-quill"></div>
</template>

<template id="page-quill">
	<div class="page-quill">
		<n-form-quill v-if="edit" v-model="cell.state.content" />
		<div v-else v-content="$services.page.translate(cell.state.content)"></div>
	</div>
</template>
