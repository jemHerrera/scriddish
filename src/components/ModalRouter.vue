<script setup>
import { ref, computed, watch} from 'vue';
import ModalCategoryGroup from './modals/ModalCategoryGroup.vue'
import ModalRecipe from './modals/ModalRecipe.vue'
import ModalSearch from './modals/ModalSearch.vue'

const routes = {
  '/category': ModalCategoryGroup,
  '/recipe': ModalRecipe,
  '/search': ModalSearch
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

//WATCH
watch(currentPath, (currentPath) => {
  let scrollableParent = ['body', '#app'];

  if(currentPath) scrollableParent.forEach(element => document.querySelector(element).classList.add('overflow-hidden'));
  else scrollableParent.forEach(element => document.querySelector(element).classList.remove('overflow-hidden'));
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})

</script>

<template>
	<transition name="slide-left">
    <keep-alive exclude="ModalRecipe,ModalCategoryGroup">
      <component 
      class="modal"
      v-if="currentPath" 
      :is="currentView" 
      @change-path="currentPath = $event"/>
    </keep-alive>
	</transition>
</template>

<style lang="scss">
  @use '@/assets/scss/abstracts' as *;
  .modal{
      z-index:999;
      height: 100vh;
      width: 100vw;
      overflow: hidden auto;
      background: $color-gray4;
      position:fixed;
      top:0;
      left:0;
      transition: all .2s ease-in-out;

      @include tablet-portrait-up{
          max-height: 844px;
          max-width: 390px;
          position: sticky;
          bottom: 0;
      }
  }
</style>