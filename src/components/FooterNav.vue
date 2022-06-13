<script setup>
	import { computed } from 'vue'
	import IconRecipes from '../components/icons/IconRecipes.vue';
	import IconGroceries from '../components/icons/IconGroceries.vue';
	import IconMealPlan from '../components/icons/IconMealPlan.vue';

	let props = defineProps({mealPlan: Array, groceries: Object})

	const groceryList = computed(() => {
		let groceryList = [];
			Object.values(props.groceries).forEach(category => {
				Object.keys(category).forEach(ingredient => {
					groceryList.push(ingredient);
				})
			})
		return groceryList;
	})

	const links = {
		'Recipes':{
			'icon': IconRecipes,
			'route': '/'
		},
		'Meal Plan':{
			'icon': IconMealPlan,
			'route': '/mealplan'
		},
		'Groceries':{
			'icon': IconGroceries,
			'route': '/groceries'
		}
	}
</script>

<template>
  	<footer>
      	<nav>
			<template v-for="(linkParameters, linkName) in links" :key="linkName">
				<RouterLink :to="linkParameters.route" class="router-link">
					<component class="icon" :is="linkParameters.icon" />
					<p>{{ linkName }}</p>
					<span v-if="linkName == 'Meal Plan' && mealPlan.length > 0" class="counter">{{ mealPlan.length }}</span>
					<span v-if="linkName == 'Groceries' && groceryList.length > 0" class="counter">{{ groceryList.length }}</span>
				</RouterLink>
			</template>
		</nav>
	</footer>
</template>

<style lang="scss">
	@use '@/assets/scss/abstracts' as *;

	footer{
		position:fixed;
		bottom:0;
		left:0;
		width: 100%;
		padding: 0.25rem 0;
		border-top: 1px solid $color-gray2;
		background-color: $color-gray4;

		nav{
			@include flex($justify:space-around);

			.router-link{
				@include flex($direction:column, $align:center);
				position:relative;

				svg{
					fill: $color-gray1;
					width: 3rem;
					height: 3rem;
				}
				p{
					font-size: 0.9rem;
					color: $color-gray1;
				}

				.counter{
					@include flex($align:center, $justify:center);
					font-size: 0.9rem;
					position: absolute;
					right: 0;
					top: 0;
					background-color: $color-gray1;
					color: white;
					font-weight: 600;
					padding: 0.25em 0.25em;
					height: 1.75em;
					width: 1.75em;
					border-radius: 1.75em;
				}

				&.router-link-active{
					svg{
						fill: $color-main;
					}
					p{
						color: $color-main;
					}
					.counter{
					background-color: $color-main;
					color: white;
					}
				}
			}
		}
	}
</style>