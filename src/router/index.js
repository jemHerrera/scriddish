import { createRouter, createWebHistory } from 'vue-router'
import RecipeListView from '../views/RecipeListView.vue'
import MealPlanView from '../views/MealPlanView.vue'
import GroceriesView from '../views/GroceriesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/mealplan',
      name: 'Meal Plan',
      component: MealPlanView
    },
    {
      path: '/',
      name: 'Recipes',
      component: () => import('../views/RecipeListView.vue')
    },
    {
      path: '/groceries',
      name: 'Groceries',
      component: () => import('../views/GroceriesView.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  }
})

export default router
