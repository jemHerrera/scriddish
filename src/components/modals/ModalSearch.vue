<script setup>
	import { ref, computed } from 'vue'
	import { useRouter, useRoute } from 'vue-router'
  	import IconSearch from '../icons/IconSearch.vue'
  	import IconDelete from '../icons/IconDelete.vue'
	import RecipeCard from '../RecipeCard.vue'
	import suggested from '../../assets/static/suggested.json'

	const props = defineProps({mealPlan: Array, recipes: Object})
	defineEmits(['add-to-meal-plan', 'select-recipe', 'change-path', 'select-category'])
	const router = useRouter();

	//REF
	let searchQuery = ref('');

	const searchItems = computed(() => {
		let searchItems = [],
			query = searchQuery.value.toLowerCase()

		if(query.length < 3) return []
		props.recipes.forEach(recipe => {
			//name
			const titleMatch = recipe.title.toLowerCase().includes(query);
			//tags
			function tagsMatch(){
				return recipe.tags.some(tag => tag.includes(query))
			}
			//ingredients
			function ingredientsMatch(){
				return Object.values(recipe.ingredients).some(category => {
					return Object.keys(category).some(ingredientID => {
						return ingredientID.includes(query) ||
						category[ingredientID].name.toLowerCase().includes(query)
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
			</div>
			<div class="suggested">
				<h2 class="suggested-title">Suggested categories</h2>
				<ul class="main-categories">
					<li v-for="(mainCategory, mainCategoryTitle) in suggested" :key="mainCategoryTitle" class="main-category">
						<h3 class="main-category-title">{{ mainCategoryTitle }}</h3>
						<ul class="sub-categories">
							<li class="sub-category" v-for="(subCategory, subCategoryID) in mainCategory" :key="subCategoryID">
								<a @click="$emit('select-category', [subCategoryID, subCategory.name])" href="#/category">{{ subCategory.name }}</a>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>

		<transition name="fade-up">
			<button class="view-meal-plan-cta" 
			@click="router.push('/mealplan'); $emit('change-path', '')"
			v-if="mealPlan.length > 0 && searchItems.length > 0">View Meal Plan ({{mealPlan.length}})</button>
		</transition>
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

			.suggested{
				margin-bottom: 3rem;

				h2.suggested-title{
					font-size: 1.5rem;
					font-weight: 700;
					margin-bottom: 1.5rem;
				}
				.main-categories{
					@include flex($direction: column, $gap:2rem);
					.main-category{

						@include flex($direction: column, $gap:1rem);
						.main-category-title{
							color: $color-gray1;
							font-size: 1.25em;
						}
						.sub-categories{
							@include flex($gap: 1rem);
							flex-wrap: wrap;
							.sub-category{
								@include flex;
								a{
									@include button($color-type:2, $radius-type:1);
									box-shadow: $shadow;
									font-size: $font-size2;
									padding: 0.75rem 1.5rem;
								}
							}
						}
					}
				}
			}
		}
		.view-meal-plan-cta{
			@include button($color-type:1, $radius-type:2);
			font-size: 1.25rem;
			position: fixed;
			bottom: 2rem;
			right: 0;
			margin: 0 1rem;
		}
	}
</style>