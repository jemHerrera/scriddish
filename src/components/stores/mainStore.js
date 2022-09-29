import { defineStore } from 'pinia'
import recipes from '../../assets/static/recipes.json'

export const useMainStore = defineStore('main', {
    state: () => ({
        recipes: recipes,
        mealPlan: [],
        customIngredients: [],
        groceryStates: {
            ingredients: {},
            categories: {}
        },
        selectedRecipe: {},
        selectedCategory: []
    }),
    getters: {
        groceries(){
            let groceries = {};
            
            // iterate through meal plan and extract categories and ingredients
            this.mealPlan.forEach(meal => {
                const ingredients = recipes.find(recipe => recipe.id == meal.id).ingredients;
    
                //BUILD THE CATEGORIES
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
            if(this.customIngredients.length > 0){
                this.customIngredients.forEach(ingredient => {
                    if(!groceries.hasOwnProperty(ingredient.category)) groceries[ingredient.category] = {};
                    groceries[ingredient.category][ingredient.name] = ingredient;
                })
            }
    
            return groceries
        }
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
            this.customIngredients = [];
        },
        
        writeCookies(){
            function bake_cookie(name, value, lifespaninSeconds) {
                let now = new Date();
                now.setTime(now.getTime() + 1 * lifespaninSeconds * 1000);
                
                let cookie = [name, '=', JSON.stringify(value), '; expires=', now.toUTCString()].join('');
                document.cookie = cookie;
            }

            let cookieLifespanInSeconds = 604800;
            bake_cookie('mealPlan', this.mealPlan, cookieLifespanInSeconds);
            bake_cookie('customIngredients', this.customIngredients, cookieLifespanInSeconds);
            bake_cookie('groceryStates', this.groceryStates, cookieLifespanInSeconds);
        },

        getCookies(){
            function read_cookie(name) {
                var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
                result && (result = JSON.parse(result[1]));
                return result;
            }

            if(read_cookie('mealPlan')) this.mealPlan = read_cookie('mealPlan');
            if(read_cookie('customIngredients')) this.customIngredients = read_cookie('customIngredients');
            if(read_cookie('groceryStates')) {
                this.groceryStates.categories = read_cookie('groceryStates').categories;
                this.groceryStates.ingredients = read_cookie('groceryStates').ingredients;
            }
        },
        
        updateGroceryStates(){
            //remove from grocerystates
            let updatedGroceryStates = {
                ingredients: {},
                categories: {}
            }

            Object.keys(this.groceries).forEach(category => {

                // Populate updatedGroceryStates.categories
                if(!this.groceryStates.categories[category]) updatedGroceryStates.categories[category] = true;
                else updatedGroceryStates.categories[category] = this.groceryStates.categories[category]
                
                Object.keys(this.groceries[category]).forEach(ingredientID => {
                    // Populate groceryStates.ingredients
                    if(!this.groceryStates.ingredients[ingredientID]) updatedGroceryStates.ingredients[ingredientID] = false;
                    else updatedGroceryStates.ingredients[ingredientID] = this.groceryStates.ingredients[ingredientID];
                })
            })

            this.groceryStates = updatedGroceryStates;
        }

    }
})