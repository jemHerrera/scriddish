<script setup>
	import { reactive, ref, computed } from 'vue'
	import { RouterLink, RouterView } from 'vue-router'
	import FooterNav from '@/components/FooterNav.vue'
	import ModalRouter from '@/components/ModalRouter.vue'
	import recipes from './assets/static/recipes.json'

	const mealPlan = ref([]);
	const customIngredients = ref([]);
	const selectedRecipe = ref({});
	const selectedCategory = ref([]);

	function addToMealPlan(recipe){
		// if id already exists, remove it
		let index = mealPlan.value.map(recipeObject => recipeObject.id).indexOf(recipe.id)
		if(index > -1) mealPlan.value[index] = recipe;
		else mealPlan.value.push(recipe)
	}

	function removeFromMealPlan(recipeID){
		// if id already exists, remove it
		let index = mealPlan.value.map(recipeObject => recipeObject.id).indexOf(recipeID)
		if(index > -1)mealPlan.value.splice(index, 1)
	}

	function addIngredient(ingredientObj){
		console.log(ingredientObj);
	}

	// Computed: combine all ingredients of every recipe in the meal plan + custom ingredients
	const groceries = computed(() => {
		let groceries = {};
		
		// iterate through meal plan and extract categories and ingredients
		mealPlan.value.forEach(meal => {
			const ingredients = recipes.find(recipe => recipe.id == meal.id).ingredients;

			Object.keys(ingredients).forEach(category => {
				if(!groceries[category]) groceries[category] = {};

				Object.keys(ingredients[category]).forEach(ingredientID => {
					if(!groceries[category].hasOwnProperty(ingredientID)) {
						groceries[category][ingredientID] = Object.create(ingredients[category][ingredientID]);
						groceries[category][ingredientID].amount *= (meal.servings / 2)
					}
					else groceries[category][ingredientID].amount += ingredients[category][ingredientID].amount * (meal.servings /2)
				})
			})
		})

		// iterate through custom ingredients
		if(customIngredients.value.length > 0){
			customIngredients.value.forEach(ingredient => {
				if(!groceries.hasOwnProperty(ingredient.category)) groceries[ingredient.category] = {};
				groceries[ingredient.category][ingredient.name] = ingredient;
			})
		}

		return groceries
	})

</script>

<template>
		<RouterView 
		v-slot="{ Component, route}" >
			<transition :name="route.meta.transition || 'fade'" mode="out-in">
				<keep-alive>
					<component 
					class="main-component"
					:is="Component"
					:key="route.meta.usePathKey ? route.path : undefined"
					:meal-plan="mealPlan"
					:recipes="recipes"
					:groceries="groceries"
					@add-to-meal-plan="addToMealPlan($event)"
					@remove-from-meal-plan="removeFromMealPlan($event)"
					@clear-meal-plan="mealPlan = []"
					@add-ingredient="customIngredients.push($event)"
					@select-recipe="selectedRecipe = $event"
					/>
				</keep-alive>
			</transition>
		</RouterView>
		<FooterNav 
		:meal-plan="mealPlan"
		:groceries="groceries"
		/>
		<ModalRouter 
		:meal-plan="mealPlan"
		:recipes="recipes"
		@add-to-meal-plan="addToMealPlan($event)"
		@remove-from-meal-plan="removeFromMealPlan($event)"
		@select-recipe="selectedRecipe = $event"
		@select-category="selectedCategory = $event"
		:selected-recipe="selectedRecipe"
		:selected-category="selectedCategory"/>
</template>

<style lang="scss">
	@use '@/assets/scss/abstracts' as *;
	@use '@/assets/scss/resets';
</style>


