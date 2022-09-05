<script setup>
	import { reactive, ref, computed, watch } from 'vue'
	import { RouterLink, RouterView } from 'vue-router'
	import { storeToRefs } from 'pinia';
    import { useMainStore } from '@/components/stores/mainStore';
	import FooterNav from '@/components/FooterNav.vue'
	import ModalRouter from '@/components/ModalRouter.vue'
	import recipes from './assets/static/recipes.json'

	// STORE
    const store = useMainStore();
    const { mealPlan } = storeToRefs(store);

	// REACTIVE STATES
	const customIngredients = ref([]);
	const selectedRecipe = ref({});
	const selectedCategory = ref([]);
	const groceryStates = reactive({
		ingredients: {},
		categories: {}
	})


	//Populate groceryStates.ingredients and groceryStates.categories (used oncreated and in groceries(prop) watcher)
	function populateStates(){
		Object.keys(groceries.value).forEach(category => {
			// Populate groceryStates.categories
			if(!groceryStates.categories[category]) groceryStates.categories[category] = true;
			Object.keys(groceries.value[category]).forEach(ingredientID => {
				// Populate groceryStates.ingredients
				if(!groceryStates.ingredients[ingredientID]) {
					groceryStates.ingredients[ingredientID] = false;
				}
			})
		})
	}

	function writeCookies(){
		function bake_cookie(name, value, lifesplanInSeconds) {
			let now = new Date();
			now.setTime(now.getTime() + 1 * lifesplanInSeconds * 1000);
			
			let cookie = [name, '=', JSON.stringify(value), '; expires=', now.toUTCString()].join('');
			document.cookie = cookie;
		}

		bake_cookie('mealPlan', mealPlan.value, 604800);
		bake_cookie('customIngredients', customIngredients.value, 604800);
		bake_cookie('groceryStates', groceryStates, 604800);
	}

	function getCookies(){
		function read_cookie(name) {
			var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
			result && (result = JSON.parse(result[1]));
			return result;
		}

		if(read_cookie('mealPlan')) mealPlan.value = read_cookie('mealPlan');
		if(read_cookie('customIngredients'))customIngredients.value = read_cookie('customIngredients')
		if(read_cookie('groceryStates')) {
			groceryStates.categories = read_cookie('groceryStates').categories;
			groceryStates.ingredients = read_cookie('groceryStates').ingredients;
		}
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

	//WATCH
	watch(groceries, (g) => {
		populateStates();
		writeCookies();
	})

	watch(groceryStates, (i) => {
		writeCookies();
	})

	getCookies();

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
					:grocery-states="groceryStates"
					@add-to-meal-plan="addToMealPlan($event)"
					@remove-from-meal-plan="removeFromMealPlan($event)"
					@clear-meal-plan="clearMealPlan()"
					@add-ingredient="customIngredients.push($event)"
					@select-recipe="selectedRecipe = $event"
					@change-grocery-state="groceryStates[$event[0]][$event[1]] = $event[2]"
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

	#app{
		background-color: $color-gray4;
	}
</style>


