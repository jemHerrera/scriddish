<script setup>
	import { ref, computed } from 'vue'
  	import IconSearch from '../icons/IconSearch.vue'
  	import IconDelete from '../icons/IconDelete.vue'
	import RecipeCard from '../RecipeCard.vue';

	const props = defineProps({mealPlan: Array, recipes: Object})
	defineEmits(['add-to-meal-plan', 'select-recipe'])

	//REF
	let searchQuery = ref('')

	//METHODS
	//get longest common substring between 2 strings
	function commonSubstring(string1, string2){
		let commonSubstrings = [];
		function getAllSubstrings(string){
			let substrings = [];
			const stringArray = string.split('');

			for(let i=0; i<stringArray.length; i++){
				let substring = stringArray[i],
					count = i;
				
				while(count < stringArray.length){
					substrings.push(substring);
					count++
					substring += stringArray[count]
				}
			}
			return substrings;
		}

		getAllSubstrings(string1).forEach(substring1 => {
			getAllSubstrings(string2).forEach(substring2 => {
				if(substring1 == substring2) commonSubstrings.push(substring1)
			})
		})

		if(commonSubstrings.length == 0) return ""
		return commonSubstrings.reduce((prev, current) => {
			if(prev.length >= current.length) return prev
			else return current
		});
	}

	const searchItems = computed(() => {
		let searchItems = [],
			query = searchQuery.value.toLowerCase()

		if(query.length < 3) return []
		props.recipes.forEach(recipe => {
			//name
			const titleMatch = commonSubstring(recipe.title.toLowerCase(), query).length >= 3;
			//tags
			function tagsMatch(){
				return recipe.tags.some(tag => commonSubstring(tag, query).length >= 3)
			}
			//ingredients
			function ingredientsMatch(){
				return Object.values(recipe.ingredients).some(category => {
					return Object.keys(category).some(ingredientID => {
						return commonSubstring(ingredientID, query).length >= 3 ||
						commonSubstring(category[ingredientID].name.toLowerCase(), query).length >= 3
					})
				})
			}
			if(titleMatch || tagsMatch() || ingredientsMatch()) searchItems.push(recipe.id);
		})

		return searchItems;
	})
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
			<div class="search-results-container">
				<div class="search-results-title" v-if="searchQuery.length >= 3">
					<h3 class="search-results" v-if="searchItems.length > 0">
						<span>Search results for</span>
						<span>"{{ searchQuery }}" </span>
						<span class="search-quantity">({{ searchItems.length }})</span>
					</h3>
					<h3 class="no-search-results" v-else>No search results found for {{ searchQuery }}</h3>
				</div>
				<ul v-if="searchItems.length > 0" class="search-results">
					<RecipeCard
					v-for="recipe in searchItems" 
					:key="recipe"
					:meal-plan="mealPlan"
					:recipe="recipes.find(i => i.id == recipe)"
					@add-to-meal-plan="$emit('add-to-meal-plan', $event)"
					@view-recipe="$emit('select-recipe', $event)"
					/>
				</ul>
				<div class="suggested"></div>
			</div>
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
		.body{
			padding: 1rem;
			@include flex($direction: column, $gap:2rem);

			.search-results-container{
				@include flex($direction: column, $gap:2rem);
				.search-results-title{
					h3{
						display:inline;
						font-size: 1.25rem;
						color: $color-gray1;
						font-weight: 500;

						span{
							font-size: inherit;
							color: inherit;
						}
					}
				}
				.search-results{
					@include flex($direction:column, $gap:1rem);
				}
			}
		}
	}
</style>