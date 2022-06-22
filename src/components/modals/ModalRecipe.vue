<script setup>
	import { ref, computed} from 'vue'
    import getImageUrl from '../../components/composables/getImageUrl'
	import IconArrow from '../icons/IconArrow.vue'
	import IconPlus from '../icons/IconPlus.vue'
	import IconCheck from '../icons/IconCheck.vue'

	const props = defineProps({selectedRecipe: Object, mealPlan: Array})
	const emit = defineEmits(['add-to-meal-plan'])

	//REFS
	const servings = ref(4);

	//COMPUTED
	const ingredientList = computed(() => {
		let ingredientList = [];

		Object.values(props.selectedRecipe.ingredients).forEach(ingredientGroup => {
			Object.values(ingredientGroup).forEach(ingredient => {
				let newIngredient = Object.assign({}, ingredient);
				newIngredient.amount = ingredient.amount * (servings.value/2);
				ingredientList.push(newIngredient)
			})
		})

		return ingredientList
	})

	const onMealPlan = computed(() => {
		return props.mealPlan.includes(props.selectedRecipe.id)
	})

	//METHODS
</script>

<template>
  <div class="recipe">
		<div class="image-container">
			<img :src="'/scriddish/images/'+selectedRecipe.image" alt="">
		</div>
		<main class="recipe-container">
			<div class="recipe-head">
				<h2 class="recipe-title">{{ selectedRecipe.title }}</h2>
				<div class="recipe-sub-heading">
					<p class="time">{{ selectedRecipe.time }}</p>
					<select v-model="servings" name="servings" id="servings">
						<option value="2">2 Servings</option>
						<option selected value="4">4 Servings</option>
						<option value="6">6 Servings</option>
					</select>
				</div>
				<div class="recipe-description">
					<p>{{ selectedRecipe.description }}</p>
				</div>
			</div>
			<div class="recipe-body">
				<div class="ingredients-container">
					<h3 class="ingredients-title">Ingredients</h3>
					<ul class="ingredients">
						<li v-for="ingredient in ingredientList" :key="ingredient.name" class="ingredient">
							<span class="quantity">{{ ingredient.amount }} {{ ingredient.unit }}</span>
							<span class="name">{{ ingredient.name }}</span>
						</li>
					</ul>
				</div>
				<div class="instructions-container">
					<h3 class="instructions-title">Instructions</h3>
					<ol class="instructions">
						<li v-for="(instruction, index) in selectedRecipe.instructions" :key="instruction" class="instruction">
							<span class="index">{{ index + 1 }}</span>
							<span class="details">{{ instruction }}</span>
						</li>
					</ol>
				</div>
			</div>
		</main>
		<a href="javascript:history.back()" class="back"><IconArrow /></a>
		<a @click="$emit('add-to-meal-plan', selectedRecipe.id)" 
			:class="{'on-meal-plan': onMealPlan}"
			class="add-to-meal-plan">
			<IconPlus v-if="!onMealPlan" /><IconCheck v-else />Add<span v-if="onMealPlan">ed </span> to meal plan
		</a>
  </div>
</template>

<style lang="scss">
	@use '@/assets/scss/abstracts' as *;
	
	.recipe{
		perspective: 2px;
		@include flex($direction: column);

		.image-container{
			transform-style: preserve-3d;
			position: relative;

			img{
				height: 50vh;
				width: 100%;
				object-fit: cover;
				object-position: center;
				transform: translateZ(-2px) scale(2) translateY(-9em);
			}
		}
		.recipe-container{
			z-index: 1;
			position: relative;
			background-color: $color-gray4;
			border-radius: 3rem 3rem 0 0;
			margin-top: -4em;
			box-shadow: 0px -30px 30px rgb(0 0 0 / 20%);

			.recipe-head{

				h2.recipe-title{
					font-size: 2.5rem;
					font-weight: 700;
					padding: 3rem 1rem 0.5rem 1rem;
				}
				.recipe-sub-heading{
					@include flex($align:center, $gap: 1em);
					padding: 0 1rem;

					.time{color: $color-gray1}

					#servings{
						padding-right: 3em;
					}

				}
				.recipe-description{
					padding: 2rem 1rem;
					p{
						font-size: 1.2rem;
						font-weight: 400;
						color: $color-gray1;
					}
				}
			}
			.recipe-body{
				padding: 0 1rem;
				@include flex($direction: column, $gap: 3rem);

				.ingredients-container{
					@include flex($direction:column, $gap: 2rem);

					h3.ingredients-title{
						font-size: 1.5rem;
						font-weight: 700;
					}
					.ingredients{
						@include grid-equal(2);
						gap: 1rem;

						.ingredient{
							@include flex($direction:column);
							span{
								font-size: $font-size2;
								&.quantity{
									color: $color-gray1;
									font-weight: 500;
								}
							}
						}
					}
				}

				.instructions-container{
					@include flex($direction:column, $gap: 2rem);

					.instructions-title{
						font-size: 1.5rem;
						font-weight: 700;
					}

					ol.instructions{
						@include flex($direction:column, $gap: 1rem);

						li.instruction{
							@include flex($gap: 1rem);
							box-shadow: $shadow;
							padding: 1.25rem;
							border-radius: 2.5rem;

							span{
								&.index{
									font-size: 1.25rem;
									height: 2em;
									width: 2em;
									min-width: 2em;
									border-radius: 3em;
									background: $color-gray2;
									color: $color-gray1;
									font-weight: 700;
									@include flex($align:center, $justify:center);
								}

								&.details{
									font-size: 1.25rem;
									line-height: 1.5;
									align-self: center;
								}
							}
						}
					}
				}
			}
		}

		.back{
			z-index: 2;
			position: sticky;
			bottom: 85%;
			left:0;
			width: fit-content;
			background: $color-gray4;
			font-size: 1.5rem;
			padding: 0.5em;
			margin: 0 2rem;
			border-radius: 99rem;
			@include flex($align:center, $justify:center);
			box-shadow: $shadow2;

			svg{
				font-size: 1em;
				height: 2em;
				width: 2em;
				fill: $color-main;
			}
		}

		.add-to-meal-plan{
			z-index: 2;
			align-self: center;
			@include button($color-type:1, $radius-type:2);
			@include flex($align:center, $justify:center);
			margin-bottom: 4rem;
			box-shadow: $shadow2;
			padding-left: 2em;
			font-size: 1.25rem;
			transition: transform 300ms ease-in-out 1s;

			svg{
				height: 1.25em;
				width: 1.25em;
				margin-right: 0.25em;
				background-color: transparent;
			}

			&.on-meal-plan{
				background-color: $color-gray1;
				color: $color-gray2;

				svg{
					fill: $color-gray2;
				}

				span{
					color: $color-gray2;
				}
			}
		}
	}
</style>