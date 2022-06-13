<script setup>
	import { ref } from 'vue'
  	import IconSearch from '../icons/IconSearch.vue'
  	import IconDelete from '../icons/IconDelete.vue'

	let searchQuery = ref('')
</script>

<template>
	<div class="search">
		<div class="head">
			<div class="input-container">
				<IconSearch class="icon search-icon"/>
				<input type="text" v-model="searchQuery" placeholder="Search by name, ingredients..">
				<IconDelete 
				v-if="searchQuery.length > 0" 
				@click="searchQuery = ''" 
				class="icon delete-icon"/>
			</div>
			<a class="cancel" href="javascript:history.back()">Cancel</a>
		</div>
		<div class="body">
			<a href="#/category">Category</a>
			<a href="#/recipe">Recipe</a>
		</div>
	</div>
</template>

<style lang="scss">
	@use '@/assets/scss/abstracts' as *;

	.search{
		.head{
			padding: 3rem 1rem 1rem 1rem;
			@include flex($align:center, $gap:1rem);

			.input-container{
				flex-grow: 1;
				position: relative;

				.icon{
					position: absolute;
					height: 100%;
					width: 2rem;

					&.search-icon{
						left: 1rem;
						fill: $color-gray1;
					}

					&.delete-icon{
						right: 1rem;
						fill: $color-gray0;
					}
				}
				input[type="text"]{
					font-size: $font-size2;
					padding: 1.5rem 4rem;
					background-color: $color-gray3;
					border-radius: 1rem;
					width: 100%;

					&::placeholder{
						color: $color-gray1;
					}
				}
			}

			.cancel{
				font-size: $font-size2;
				color: $color-main;
			}
		}
	}
</style>