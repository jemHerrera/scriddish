<script setup>
	import { reactive, ref, onMounted, watch } from 'vue'
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

	//create event listener for scroll nav feature
	onMounted(() => {
		const categorySections = document.querySelectorAll(".category-group");
		window.addEventListener('scroll', navigateCategories);

		function navigateCategories(){
			// Get current scroll position
			let scrollY = window.pageYOffset;
			categorySections.forEach(categorySection => {
				const sectionHeight = categorySection.offsetHeight;
				const sectionTop = categorySection.offsetTop - 50;
				const categorySectionId = categorySection.getAttribute("id");

				if(scrollY > sectionTop - 200 && scrollY <= sectionTop + sectionHeight - 200){
					activeCategory.value = categorySectionId;
				}
			});
		}
	})

	//METHODS
	function scrollToSection(id){
		const categorySection = document.getElementById(id);
		const sectionTop = categorySection.offsetTop;
		const navHeight = document.querySelector('.categories-container').clientHeight

		window.scroll({
			top: sectionTop - navHeight,
			behavior: 'smooth'
		});
	}

	function scrollToCategory(id){
		const container = document.querySelector('.category-nav');
		const active = document.querySelector(`[category="${id}"]`);
		const position = active.offsetLeft;

		container.scroll({
			left: position - 72,
			behavior: 'smooth'
		})
	}

	//WATCH
	//scroll pills everytime activecategory changes
	watch(activeCategory, (after, before) => {
		scrollToCategory(after);
	})
</script>

<template>
	<div class="recipes">
		<div class="recipes-container">
			<div class="head">
				<img src="/images/logo.png">
				<div class="title">
					<h1>Plan your meals</h1>
					<p>Start by adding recipes to the meal plan</p>
				</div>
			</div>
			<div class="recipes-nav">
				<div class="category-nav">
					<ul class="categories-container">
						<li v-for="(categoryValue, categoryID) in categories" 
						:key="categoryID" 
						@click="scrollToSection(categoryID)"
						:class="{'active': activeCategory == categoryID}"
						:category="categoryID"
						class="category-pill">{{ categoryValue.name }}</li>
					</ul>
				</div>
				<div class="search-container">
					<a class="search" href="#/search"><IconSearch/></a>
				</div>
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
		<div class="authors-remark">
			<p>Thank you for taking the time to check out my stuff! That's all the recipes I got for now, but I will keep an adding more as I go.</p>
		</div>
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

			.recipes-nav{
				@include flex;
				position: sticky;
				top: 0;
				border-bottom: 1px solid $color-gray2;
				background: $color-gray4;

				.category-nav{
					flex-grow: 1;
					overflow-x: auto;

					.categories-container{
						@include flex($gap: 1rem);
						width: max-content;
						padding: 1rem;
						
						.category-pill{
							list-style-type: none;
							font-size: $font-size2;
							padding: 0.75rem 1rem;
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

				.search-container{
					@include flex($align:center, $justify:center);
					padding: 0 1rem;

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
			}

			.recipes-body{
				padding: 1rem;

				.recipes-container{
					@include flex($direction:column, $gap: 3rem);
					
					.category-group{
						list-style-type: none;
						padding: 1em 0;

						.category-group-name{
							font-size: 1rem;
							text-transform: uppercase;
							font-weight: 700;
							margin-bottom: 1rem;
							color: $color-gray1;
						}

						.category-recipes{
							@include flex($direction:column, $gap: 1rem);
						}
					}
				}
			}
		}

		.view-meal-plan-cta{
			@include button($color-type:1, $radius-type:2);
			font-size: 1.25rem;
			position: fixed;
			bottom: 6rem;
			right: 0;
			margin: 0 1rem;
		}

		.authors-remark{
			@include flex($align:center, $justify:center);
			padding: 6rem 4.5rem 10rem 4.5rem;
			
			p{
				font-size: 1.25rem;
				font-style: italic;
				text-align:center;
				color: $color-gray1;
			}
		}
	}
</style>
