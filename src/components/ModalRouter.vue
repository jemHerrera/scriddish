<script setup>
import { ref, computed, watch} from 'vue'
import ModalCategoryGroup from './modals/ModalCategoryGroup.vue'
import ModalRecipe from './modals/ModalRecipe.vue'
import ModalSearch from './modals/ModalSearch.vue'

const routes = {
  '/category': ModalCategoryGroup,
  '/recipe': ModalRecipe,
  '/search': ModalSearch
}

const props = defineProps({selectedRecipe: Object, mealPlan: Array, recipes: Object})
const emit = defineEmits(['add-to-meal-plan']);
const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

//WATCH
watch(currentPath, (currentPath) => {
  if(currentPath) document.querySelector('body').classList.add('overflow-hidden')
  else document.querySelector('body').classList.remove('overflow-hidden')
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>

<template>
	<transition name="slide-left">
  <component 
  class="modal"
  v-if="currentPath" 
  :is="currentView" 
  :selected-recipe="selectedRecipe"
  :recipes="recipes"
  :meal-plan="mealPlan"
  @add-to-meal-plan="$emit('add-to-meal-plan', $event)"/>
	</transition>
</template>

<style lang="scss">
  @use '@/assets/scss/abstracts' as *;
  .modal{
      z-index:999;
      height: 100vh;
      width: 100vw;
      padding-bottom: 5rem;
      overflow: hidden auto;
      background: $color-gray4;
      position:fixed;
      top:0;
      left:0;
      transition: all .2s ease-in-out;
  }
</style>