<script setup>
	import { ref, computed } from 'vue'
	import { useRouter, useRoute } from 'vue-router'
	import ModalVerify from '../components/modals/ModalVerify.vue'
	import IconMealPlan from '../components/icons/IconMealPlan.vue';
	import IconDelete from '../components/icons/IconDelete.vue';
	import IconPlus from '../components/icons/IconPlus.vue';
	import recipes from '../assets/static/recipes.json'
    import getImageUrl from '../components/composables/getImageUrl'

	let props = defineProps({mealPlan: Array, groceries: Object})
	let emit = defineEmits(['add-to-meal-plan', 'clear-meal-plan', 'select-recipe'])

	const router = useRouter();
	function findRecipe(recipeID){
		return recipes.find(recipe => recipeID == recipe.id)
	}
	const modalVerify = ref('');
	const modalClear = ref(false);
	const groceryList = computed(() => {
		let groceryList = [];
			Object.values(props.groceries).forEach(category => {
				Object.keys(category).forEach(ingredient => {
					groceryList.push(ingredient);
				})
			})
		return groceryList;
	})

	function viewRecipe(recipe){
		emit('select-recipe', recipe);
		window.location.href = "#/recipe"
	}
</script>

<template>
	<div class="meal-plan">
		<div v-if="mealPlan.length > 0" class="meal-plan-container">
			<div class="meal-plan-head">
				<h2>My meal plan</h2>
				<a class="new-dish-link" @click="router.push('/')"><IconPlus />Add a new dish</a>
			</div>
			<div class="meal-plan-body">
				<TransitionGroup name="list" tag="ul" class="recipe-list">
					<li v-for="mealID in mealPlan" 
					:key="mealID" 
					@click="viewRecipe(findRecipe(mealID))">
						<div :style="{'background-image': `url('/images/${findRecipe(mealID).image}')`}" class="meal-inner">
							<span class="title">{{ findRecipe(mealID).title }}</span>
							<button class="delete-recipe" @click.stop.prevent="modalVerify = mealID"><IconDelete /></button>
						</div>
						<transition name="fade">
							<ModalVerify 
							v-if="modalVerify == mealID"
							@confirm="$emit('add-to-meal-plan', mealID)"
							@cancel="modalVerify = ''" />
						</transition>
					</li>
				</TransitionGroup>
			</div>
			<div class="cta-container">
				<button @click="router.push('/groceries')" class="view-groceries-cta">
					<span>View Groceries </span>
					<span>({{ groceryList.length }})</span>
				</button>
				<div class="clear-meal-plan-container">
					<p class="clear-meal-plan">Want to start over? <span class="clear-button" @click="modalClear = true">Clear Meal Plan</span></p>
					<transition name="fade">
						<ModalVerify 
						v-if="modalClear"
						@confirm="$emit('clear-meal-plan', mealID)"
						@cancel="modalClear = false" />
					</transition>
				</div>
			</div>
		</div>

		<div v-if="mealPlan.length == 0" class="empty-meal-plan">
			<IconMealPlan class="meal-plan-icon" />
			<h2>Your meal plan is empty</h2>
			<p>Start by choosing recipes that you plan to cook for the next few days.</p>
			<button @click="router.push('/')" class="see-recipes">See Recipes</button>
		</div>
	</div>
</template>

<style lang="scss">
	@use '@/assets/scss/abstracts' as *;

	.meal-plan{
		.meal-plan-container{
			@include flex($direction: column);
			gap: 1.5rem;

			.meal-plan-head{
				@include flex($justify:space-between, $align:center);
				padding: 3rem 1rem 1rem 1rem;

				h2{
					font-size: 2.5rem;
					font-weight: 700;
				}

				.new-dish-link{
					@include flex($align:center, $gap:0.1rem);
					color: $color-main;
					font-size: $font-size2;
					font-weight: 600;

					svg{
						width: 1.5rem;
						height: 1.5rem;
						fill: $color-main;
					}
				}
			}

			.meal-plan-body{
				padding: 0 1rem;
				
				.recipe-list{
					@include grid-equal(2);
					gap: 1.5rem;

					li{
						list-style-type: none;
						height: 15rem;
						transition: all 250ms ease;
						box-shadow: $shadow;
						border-radius: 2rem;


						&:active{
							box-shadow: 1px 2px 5px rgb(0 0 0 / 21%);
						}

						.meal-inner{
							transition: all 250ms ease;
							height: 100%;
							width: 100%;
							padding: 1.5rem;
							@include flex($align: flex-end);
							position: relative;
							background-size: cover;
							background-position: center;
							overflow: hidden;
							border-radius: 2rem;

							&::after{
								content: '';
								position: absolute;
								width: 100%;
								bottom: 0;
								left:0;
								height: 50%;
								background-image: linear-gradient(0deg, rgba(19, 7, 7, 0.75), transparent)
							}

							.title{
								color: white;
								font-weight: 600;
								font-size: 1.25rem;
								z-index: 1;
							}

							.delete-recipe{
								position: absolute;
								top: 0;
								right: 0;
								margin: 0.5rem;
								height: 2.5rem;
								width: 2.5rem;
								border-radius: 2.5rem;
								@include flex($align:center, $justify:center);
								background-color: $color-gray4;
								box-shadow: $shadow2;

								svg{
									fill: $color-main;
								}
							}
						}

						&.list-enter-from,
						&.list-leave-to {
							.verify{
								display: none;
							}
						}
					}
				}
			}

			.cta-container{
				@include flex($direction:column, $align:center, $gap:1em);
				margin: 2rem 0;

				.view-groceries-cta{
					font-size: 1.35rem;
					@include button($color-type:2, $radius-type:2);
				}
				.clear-meal-plan{
					color: $color-gray1;
					font-size: 1.25rem;
					padding: 1rem;

					.clear-button{
						font-size: inherit;
						color: $color-gray1;
						font-weight: 700;
					}
				}
			}
		}

		.empty-meal-plan{
			@include flex($direction: column, $align:center, $justify:center, $gap:1rem);
			height: 100vh;
			padding: 4rem;

			.meal-plan-icon{
				fill: $color-main;
				height: 4rem;
				width: 4rem;
				opacity: 0.5;
			}

			h2{
				font-size: 2rem;
				font-weight: 700;
				color: $color-gray0;
				text-align: center;
			}

			p{
				font-size: 1.25rem;
				text-align: center;
				color: $color-gray1;
			}

			.see-recipes{
				@include button($radius-type:2);
				font-size: 1.25rem;
				margin-top: 2rem;
				width: 100%;
				color: white;
				box-shadow: $shadow2;
			}
		}
	}
</style>
