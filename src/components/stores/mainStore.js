import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
    state: () => ({
        mealPlan: []
    }),
    getters: {

    },
    actions: {
        addToMealPlan(recipe){
            let mealPlanItem = this.mealPlan.find(item => recipe.id == item.id),
                mealPlanIndex = this.mealPlan.indexOf(mealPlanItem);

            //if already exists in the mealplan, update with the new amount of serving
            if(mealPlanItem) return this.mealPlan[mealPlanIndex].servings = recipe.servings;

            //otherwise add new recipe
            this.mealPlan.push(recipe)
        },
        
        removeFromMealPlan(recipeID){
            const mealPlanIDs = this.mealPlan.map(recipeObject => recipeObject.id)
            const recipeIndex = mealPlanIDs.indexOf(recipeID)

            // if id already exists, remove it
            if(recipeIndex > -1) this.mealPlan.splice(recipeIndex, 1);
        },
        clearMealPlan(){
            this.mealPlan = [];
        }
    }
})