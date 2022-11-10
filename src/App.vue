<script setup>
	import { reactive, ref, computed, watch } from 'vue'
	import { RouterLink, RouterView } from 'vue-router'
	import { mapState, storeToRefs } from 'pinia';
    import { useMainStore } from '@/components/stores/mainStore';
	import FooterNav from '@/components/FooterNav.vue';
	import ModalRouter from '@/components/ModalRouter.vue';
	import recipes from './assets/static/recipes.json';
	import LoadingScreen from '@/components/LoadingScreen.vue';

	// STORE
    const store = useMainStore();
    const { mealPlan, groceries, groceryStates, customIngredients } = storeToRefs(store);
	
	//WATCH
	watch(groceries, (g) => {
		store.updateGroceryStates();
		store.writeCookies();
	})

	store.updateGroceryStates();
	store.getCookies();

	//release loading
	let loadTimeMilliseconds = 2000;
	setTimeout(()=>store.loading = false, loadTimeMilliseconds)

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
					/>
				</keep-alive>
			</transition>
		</RouterView>

		<FooterNav/>

		<ModalRouter/>

		<LoadingScreen/>
</template>

<style lang="scss">
	@use '@/assets/scss/abstracts' as *;
	@use '@/assets/scss/resets';

	#app{
		background-color: $color-gray4;
	}
</style>


