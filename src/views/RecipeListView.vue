<script setup>
	import { reactive, ref } from 'vue'
	import { useRouter, useRoute } from 'vue-router'
	import IconSearch from '../components/icons/IconSearch.vue';
	import RecipeCard from '../components/RecipeCard.vue';
	import categories from '../assets/static/categories.json'

	const props = defineProps({mealPlan: Array, recipes: Object})
	defineEmits(['add-to-meal-plan', 'select-recipe'])

	// populate categories with recipes
	props.recipes.forEach(recipe => {
		let category = recipe.category;
		if(!category in categories) return
		if(!categories[category].recipes.includes(recipe.id)) categories[category].recipes.push(recipe.id)
	})

	const activeCategory = ref("featured");
	const router = useRouter();
</script>

<template>
	<div class="recipes">
		<div class="recipes-container">
			<div class="head">
				<div class="title">
					<h1>Plan your meals</h1>
					<p>Start by adding recipes to the meal plan</p>
				</div>
			</div>
			<div class="category-nav">
				<ul class="categories-container">
					<li class="search-container">
						<a class="search" href="#/search"><IconSearch/></a>
					</li>
					<li v-for="(categoryValue, categoryID) in categories" 
					:key="categoryID" 
					@click="activeCategory = categoryID"
					:class="{'active': activeCategory == categoryID}"
					class="category-pill">{{ categoryValue.name }}</li>
				</ul>
			</div>
			<div class="recipes-body">
				<ul class="recipes-container">
					<li v-for="(categoryValue, categoryID) in categories" 
					:key="categoryID" 
					:id="categoryID"
					class="category-group">
						<h3 class="category-group-name">{{ categoryValue.name }}</h3>
						<ul class="category-recipes">
							<RecipeCard
							v-for="recipe in categoryValue.recipes" 
							:key="recipe"
							:meal-plan="mealPlan"
							:recipe="recipes.find(i => i.id == recipe)"
							@add-to-meal-plan="$emit('add-to-meal-plan', $event)"
							@view-recipe="$emit('select-recipe', $event)"
							/>
						</ul>
					</li>
				</ul>
			</div>
		</div>
		<transition name="fade-up">
			<button class="view-meal-plan-cta" 
			@click="router.push('/mealplan')"
			v-if="mealPlan.length > 0">View Meal Plan ({{mealPlan.length}})</button>
		</transition>
	</div>
</template>

<style lang="scss">
	@use '@/assets/scss/abstracts' as *;

	.recipes{
		background-color: $color-gray4;
		min-height: 100vh;

		.recipes-container{
			@include flex($direction: column);

			.head{
				padding: 3rem 1rem 1rem 1rem;
				@include flex($align:center, $gap:1rem);

				img{
					height: 4rem;
					width: 4rem;
				}

				.title{
					flex-grow:1;

					h1{
						font-size: 2.5rem;
						font-weight: 700;
					}

					p{
						color: $color-gray1;
					}
				}
			}

			.category-nav{
				width: 100vw;
				overflow-x: auto;
				position: sticky;
				top: 0;
				background: $color-gray4;
				border-bottom: 1px solid $color-gray2;

				.categories-container{
					@include flex($gap: 1rem);
					width: max-content;
					padding: 1rem 2rem;
					
					.search-container{
						list-style-type: none;
						position: sticky; 
						left: 1rem;

						.search{
							@include flex($align:center, $justify:center);
							border-radius: 1rem;
							padding: 0.5rem;
							background-color: $color-gray4;
							box-shadow: $shadow2;

							svg{
								width: 2.5rem;
								height: 2.5rem;
								fill: $color-main;
							}
						}
					}
					.category-pill{
						list-style-type: none;
						font-size: $font-size2;
						padding: 1rem 3rem;
						color: $color-main;
						background-color: $color-gray4;
						border-radius: 2em;
						box-shadow: $shadow;

						&.active{
							background-color: $color-main;
							color: white;
						}
					}
				}
			}

			.recipes-body{
				padding: 1rem;

				.recipes-container{
					@include flex($direction:column, $gap: 3rem);
					margin-bottom: 15rem;
					
					.category-group{
						list-style-type: none;

						.category-group-name{
							font-size: 1rem;
							text-transform: uppercase;
							font-weight: 700;
							margin-bottom: 1rem;
							color: $color-gray1;
						}

						.category-recipes{
							@include flex($direction:column, $gap: 1.5rem);
						}
					}
				}
			}
		}

		.view-meal-plan-cta{
			@include button($color-type:1, $radius-type:2);
			font-size: 1.35rem;
			position: fixed;
			bottom: 6rem;
			right: 0;
			margin: 0 1rem;
		}
	}
</style>
