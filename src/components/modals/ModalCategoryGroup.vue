<script setup>
	import { ref, computed} from 'vue'
	import { useRouter, useRoute } from 'vue-router'
	import { storeToRefs } from 'pinia';
    import { useMainStore } from '../../components/stores/mainStore';
	import IconArrow from '../icons/IconArrow.vue';
	import RecipeCard from '../../components/RecipeCard.vue';
	import suggested from '../../assets/static/suggested.json';
  
	// PROPS, EMITS, STORE
	const emit = defineEmits(['change-path'])
	const router = useRouter();
    const store = useMainStore();
    const { mealPlan, recipes, selectedCategory } = storeToRefs(store);

	//create recipe list
	let categoryRecipes = computed(() => {
		return recipes.value.filter(recipe => recipe.tags.includes(selectedCategory.value[0]));
	})
</script>

<template>
  <div class="category-group">
    <div class="category-group-container">
		<div onclick="history.back()" class="category-group-head">
			<IconArrow />
			<h2>{{ selectedCategory[1] }}</h2>
		</div>
		<div class="category-group-body">
			<div class="category-recipes">
				<RecipeCard
				v-for="recipe in categoryRecipes" 
				:key="recipe.id"
				:recipe="recipe"
				/>
			</div>
			<transition name="fade-up">
				<button class="view-meal-plan-cta" 
				@click="router.push('/mealplan'); $emit('change-path', '')"
				v-if="mealPlan.length > 0">View Meal Plan ({{mealPlan.length}})</button>
			</transition>
		</div>
    </div>
  </div>
</template>

<style lang="scss">
	@use '@/assets/scss/abstracts' as *;

	.category-group{
		.category-group-container{
			.category-group-head{
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
			.category-group-body{
				padding: 1rem 1rem 15rem 1rem;
				.category-recipes{
					@include flex($direction:column, $gap: 1rem);
				}
			}
			.view-meal-plan-cta{
				@include button($color-type:1, $radius-type:2);
				font-size: 1.25rem;
				position: fixed;
				bottom: 1rem;
				right: 0;
				margin: 0 1rem;

				@include tablet-portrait-up{
					bottom: 1rem;
					margin: 1rem;
					position: sticky;
					left: 100%;
					cursor: pointer;
				}
			}
		}
	}
</style>
