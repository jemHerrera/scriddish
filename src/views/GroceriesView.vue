<script setup>
	import { ref, reactive, computed, watch} from 'vue';
	import { useRouter, useRoute } from 'vue-router';
	import { storeToRefs } from 'pinia';
    import { useMainStore } from '../components/stores/mainStore';
	import ModalIngredient from '../components/modals/ModalIngredient.vue'
	import IconArrow from '../components/icons/IconArrow.vue';
	import IconPlus from '../components/icons/IconPlus.vue';
	import IconChevron from '../components/icons/IconChevron.vue';
	import IconGroceries from '../components/icons/IconGroceries.vue';

	// SETUP: PROPS, EMITS, STORE, ROUTER
	const router = useRouter();
    const store = useMainStore();
    const { mealPlan, groceries, groceryStates, recipes } = storeToRefs(store);

	//REFS
	const groceryRef = ref(groceries.value);
	const newIngredientModal = ref(false);

	//COMPUTED
	const hasGroceries = computed(() => Object.keys(groceries.value).length > 0)
	const groceryCount = computed(() => {
		let groceryCount = Object.assign({}, groceries.value);

		Object.keys(groceryCount).forEach(category => {
			let count = 0;
			Object.keys(groceryCount[category]).forEach(ingredientID => {
				if(!groceryStates.value.ingredients[ingredientID]) count++;
			})
			groceryCount[category] = count;
		})

		return groceryCount;
	})

	watch(groceryStates.value, (i) => {
		store.writeCookies();
	})
</script>

<template>
	<div class="groceries">
		<div v-if="hasGroceries > 0" class="groceries-container">
			<div class="groceries-head">
				<IconArrow onclick="history.back()" />
				<h2>Groceries</h2>
			</div>
			<ul class="groceries-body">
				<li 
				class="category-group" 
				v-for="(ingredients, category) in groceries" 
				:key="category" 
				:class="{'expanded': groceryStates['categories'][category]}">
					<h3 class="category" @click="groceryStates['categories'][category] = !groceryStates['categories'][category]">
						<span class="category-name">{{ category }} ({{ groceryCount[category] }})</span>
						<span class="expand-button"><IconChevron/></span>
					</h3>
					<div class="ingredients-container">
						<ul class="ingredients">
							<template v-for="(ingredientItem, ingredientID) in ingredients" :key="ingredientID">
								<li :class="{'checked': groceryStates['ingredients'][ingredientID]}" class="ingredient">
									<input type="checkbox" :id="ingredientID" 
									:value="groceryStates['ingredients'][ingredientID]" :checked="groceryStates['ingredients'][ingredientID]"
									@click="groceryStates['ingredients'][ingredientID] = !groceryStates['ingredients'][ingredientID]" />
									<label :for="ingredientID" class="name">{{ ingredientItem.name }}</label>
									<span class="amount">{{ ingredientItem.amount }} {{ ingredientItem.unit }}</span>
								</li>
							</template>
						</ul>
					</div>
				</li>
			</ul>

			<div class="add-ingredient-container">
				<button @click="newIngredientModal = true" class="add-ingredient"><IconPlus /> Add Ingredient</button>
			</div>
		</div>
		<div v-else class="empty-groceries-container">
			<IconGroceries class="groceries-icon" />
			<h2>Your grocery list is empty</h2>
			<p>Start by choosing recipes that you plan to cook for the next few days.</p>
			<button @click="router.push('/')" class="see-recipes">See Recipes</button>
		</div>

		<transition name="fade">
			<ModalIngredient 
			v-if="newIngredientModal" 
			@cancel="newIngredientModal = false"
			/>
		</transition>
	</div>
</template>

<style lang="scss">
	@use '@/assets/scss/abstracts' as *;
	
	.groceries{
		min-height: 100vh;
		@include tablet-portrait-up{
			min-height: 844px;
		}

		.groceries-container{
			.groceries-head{
				@include flex($align:center, $gap:0.5rem);
				padding: 3rem 1rem 1rem 1rem;
				cursor: pointer;

				svg{
					fill: $color-gray0;
					width: 3rem;
					height: 3rem;
					transition: all 200ms ease-out;
				}

				h2{
					font-size: 2.5rem;
					font-weight: 700;
					transition: all 200ms ease-out;
				}

				&:hover{
					svg{
						transform: translateX(-3px);
					}
					h2{
						transform: translateX(3px);
					}
				}
			}
			.groceries-body{
				padding: 1rem;
				@include flex($direction: column);
				gap: 1rem;

				li{list-style-type: none}

				.category-group{
					padding: 1.5rem;
					border-radius: 1.5rem;
					box-shadow: $shadow;

					h3.category{
						@include flex($align:center, $justify:space-between);

						.category-name{
							color: $color-gray1;
						}

						.expand-button{
							svg{
								fill: $color-gray1;
								transform: rotate(0deg);
							}
						}

						cursor:pointer;
						&:hover{
							.category-name{
								color: $color-gray0;
							}

							.expand-button{
								svg{
									fill: $color-gray0;
								}
							}
						}
					}
					.ingredients-container{
						overflow: hidden;

						.ingredients{
							transition: all 200ms ease-out;
							margin-top: -200%;
							@include flex($direction:column, $gap:0.5em);

							.ingredient{
								@include flex($align:center, $justify:space-between, $gap:0.5em);
								font-size: 1.15rem;
								cursor: pointer;

								input[type="checkbox"]{
									@include flex($align:center, $justify:center);
									height: 2em;
									width: 2em;
									padding: 0;
									-webkit-appearance: none;
									background-color: $color-gray4;
									border: none;
									box-shadow: inset 3px 3px 5px $color-gray2, inset -3px -3px 5px white;
									border-radius: 6px;
									display: inline-block;
									position: relative;

									&:checked:after {
										content: '\2714';
										font-size: 1.25em;
										width: 100%;
										height: 100%;
										@include flex($align:center, $justify:center);
										color: $color-gray2;
									}
								}

								label{
									flex-grow:1;
									font-size: 1em;
								}
								.amount{
									color: $color-gray1;
									text-align: right;
								}

								&.checked{
									label{
										color: $color-gray2;
										text-decoration: line-through;
									}
									.amount{
										text-decoration: line-through;
										color: $color-gray2;
									}
								}
							}

						}
					}

					&.expanded{
						h3.category .expand-button svg{
							transform: rotate(180deg);
						}
						.ingredients-container .ingredients{
							margin-top: 1em;
						}
					}
				}
			}

			.add-ingredient-container{
				@include flex($justify:flex-end);
				padding: 1rem;

				button.add-ingredient{
					@include button($color-type:2, $radius-type:2);
					@include flex($align:center, $justify:center);
					box-shadow: $shadow;
					padding-left: 2em;
					font-size: 1.25rem;
					font-weight: 600;
					cursor: pointer;

					svg{
						height: 2rem;
						width: 2rem;
						margin-right: 0.5em;
					}

					transition: all 100ms ease-in-out;
					&:hover{
						box-shadow: $shadow4;
						transform: translateY(-3px);
					}
				}
			}
		}
		.empty-groceries-container{
			@include flex($direction: column, $align:center, $justify:center, $gap:1rem);
			height: 100vh;
			padding: 4rem;

			.groceries-icon{
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
				cursor: pointer;

				transition: all 100ms ease-in-out;
				&:hover{
					box-shadow: $shadow4;
					transform: translateY(-3px);
				}
			}
		}
	}
</style>
