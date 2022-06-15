<script setup>
	import { reactive, ref, computed } from 'vue'
	import { RouterLink, RouterView } from 'vue-router'
	import FooterNav from '@/components/FooterNav.vue'
	import ModalRouter from '@/components/ModalRouter.vue'
	import recipes from './assets/static/recipes.json'

	const mealPlan = ref([]);
	const customIngredients = ref([]);
	const selectedRecipe = ref({});

	function addToMealPlan(recipeID){
		// if id already exists, remove it
		let index = mealPlan.value.indexOf(recipeID);
		if(index > -1)mealPlan.value.splice(index, 1)
		else mealPlan.value.push(recipeID)
	}

	function addIngredient(ingredientObj){
		console.log(ingredientObj);
	}

	// Computed: combine all ingredients of every recipe in the meal plan + custom ingredients
	const groceries = computed(() => {
		let groceries = {};
		
		// iterate through meal plan and extract categories and ingredients
		mealPlan.value.forEach(meal => {
			const ingredients = recipes.find(recipe => recipe.id == meal).ingredients;

			Object.keys(ingredients).forEach(category => {
				if(!groceries.hasOwnProperty(category)) groceries[category] = {};

				Object.keys(ingredients[category]).forEach(ingredientID => {
					let groceryIngredient = groceries[category][ingredientID],
					recipesIngredient = ingredients[category][ingredientID];
					
					if(!groceries[category].hasOwnProperty(ingredientID)) groceries[category][ingredientID] = Object.create(ingredients[category][ingredientID]);
					else groceryIngredient.amount += recipesIngredient.amount
					
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
				:is="Component"
				:key="route.meta.usePathKey ? route.path : undefined"
				:meal-plan="mealPlan"
				:recipes="recipes"
				:groceries="groceries"
				@add-to-meal-plan="addToMealPlan($event)"
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
	@add-to-meal-plan="addToMealPlan($event)"
	:selected-recipe="selectedRecipe"/>
</template>

<style lang="scss">
	@use '@/assets/scss/abstracts' as *;
	@use '@/assets/scss/resets';

</style>


