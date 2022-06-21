<script setup>
	import { ref, reactive, computed, watch} from 'vue';
	import { useRouter, useRoute } from 'vue-router';
	import ModalIngredient from '../components/modals/ModalIngredient.vue'
	import IconArrow from '../components/icons/IconArrow.vue';
	import IconPlus from '../components/icons/IconPlus.vue';
	import IconChevron from '../components/icons/IconChevron.vue';
	import IconGroceries from '../components/icons/IconGroceries.vue';

	defineEmits(['add-ingredient']);
	const props = defineProps({groceries: Object})
	const router = useRouter();

	//REFS
	const groceryRef = ref(props.groceries);
	const states = reactive({
		ingredients: {},
		categories: {}
	})
	const newIngredientModal = ref(false);

	//COMPUTED
	const hasGroceries = computed(() => Object.keys(props.groceries).length > 0)
	const groceryCount = computed(() => {
		let groceryCount = Object.assign({}, props.groceries);

		Object.keys(groceryCount).forEach(category => {
			let count = 0;
			Object.keys(groceryCount[category]).forEach(ingredientID => {
				if(!states.ingredients[ingredientID]) count++;
			})
			groceryCount[category] = count;
		})

		return groceryCount;
	})
	//METHODS
	//Populate states.ingredients and states.categories (used oncreated and in groceries(prop) watcher)
	function populateStates(){
		Object.keys(props.groceries).forEach(category => {
			// Populate states.categories
			if(!states.categories[category]) states.categories[category] = true;
			Object.keys(props.groceries[category]).forEach(ingredientID => {
				// Populate states.ingredients
				if(!states.ingredients[ingredientID]) states.ingredients[ingredientID] = false;
			})
		})
	}
	//WATCH
	watch(groceryRef, (g) => populateStates())

	//SETUP FUNCTIONS
	populateStates()
	
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
				:class="{'expanded': states.categories[category]}">
					<h3 class="category" @click="states.categories[category] = !states.categories[category]">
						<span class="category-name">{{ category }} ({{ groceryCount[category] }})</span>
						<span class="expand-button"><IconChevron/></span>
					</h3>
					<div class="ingredients-container">
						<ul class="ingredients">
							<template v-for="(ingredientItem, ingredientID) in ingredients" :key="ingredientID">
								<li :class="{'checked': states.ingredients[ingredientID]}" class="ingredient">
									<input type="checkbox" :id="ingredientID" v-model="states.ingredients[ingredientID]" />
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
				<transition name="fade">
					<ModalIngredient 
					v-if="newIngredientModal" 
					@cancel="newIngredientModal = false"
					@add-ingredient="$emit('add-ingredient', $event)"
					/>
				</transition>
			</div>
		</div>
		<div v-else class="empty-groceries-container">
			<IconGroceries class="groceries-icon" />
			<h2>Your grocery list is empty</h2>
			<p>Start by choosing recipes that you plan to cook for the next few days.</p>
			<button @click="router.push('/')" class="see-recipes">See Recipes</button>
		</div>
	</div>
</template>

<style lang="scss">
	@use '@/assets/scss/abstracts' as *;
	
	.groceries{
		.groceries-container{

			.groceries-head{
				@include flex($align:center, $gap:0.5rem);
				padding: 3rem 1rem 1rem 1rem;

				svg{
					fill: $color-gray0;
					width: 3rem;
					height: 3rem;
				}

				h2{
					font-size: 2.5rem;
					font-weight: 700;
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
										font-size: 1.5em;
										width: 100%;
										height: 100%;
										@include flex($align:center, $justify:center);
										color: $color-main;
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
										color: $color-gray1;
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
					padding-left: 2em;
					font-size: 1.25rem;
					font-weight: 600;

					svg{
						height: 2rem;
						width: 2rem;
						margin-right: 0.5em;
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
			}
		}
	}
</style>
