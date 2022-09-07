<script setup>
    import { ref } from 'vue'
    import { useMainStore } from '../components/stores/mainStore';
	import { storeToRefs } from 'pinia';
    import IconPlus from '../components/icons/IconPlus.vue'
    import IconCheck from '../components/icons/IconCheck.vue'
    import getImageUrl from '../components/composables/getImageUrl'

    //PROPS, EMITS, STORE
    const props = defineProps({recipe: Object})
    const store = useMainStore();
    const { mealPlan, selectedRecipe } = storeToRefs(store);

    //METHODS
    function toggleMeal(){
        let inMealPlan = mealPlan.value.some(item => props.recipe.id == item.id);

        if(inMealPlan) return store.removeFromMealPlan(props.recipe.id);
            
        store.addToMealPlan({
            'id': props.recipe.id,
            'servings': 4
        })
    }
</script>

<template>
    <a class="recipe-card" :id="recipe.id" @click="selectedRecipe = recipe" href="#/recipe">
        <div class="recipe-card-container">
            <img :src="'/scriddish//images/'+recipe.image">
            <div class="details">
                <h4 class="title">{{ recipe.title }}</h4>
                <div class="description-container">
                    <p class="description">{{ recipe.description }}</p>
                </div>
                <div class="card-footer">
                    <p class="time">{{ recipe.time }}</p>
                    <button @click.prevent="toggleMeal()">
                        <IconPlus class="plus" v-if="!mealPlan.map(meal => meal.id).includes(recipe.id)"/>
                        <IconCheck class="check" v-else/>
                    </button>
                </div>
            </div>
        </div>
    </a>
</template>

<style scoped lang="scss">
	@use '@/assets/scss/abstracts' as *;
    $card-size: 12em;

    .recipe-card{
        border-radius: 3em;
        box-shadow: $shadow;
        overflow: hidden;
        

        .recipe-card-container{
            @include flex($align:center);
            height: $card-size;

            img{
                width: $card-size;
                object-fit: cover;
                object-position: center;
                min-height: 100%;
            }

            .details{
                padding: 1.5rem 1.25rem 1rem 1.5rem;
                @include flex($direction: column);
                height: 100%;
                
                .title{
                    font-size: $font-size2;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                    -webkit-box-orient: vertical;  
                }

                .description-container{
                    flex-grow:1;
                    .description{
                        color: $color-gray1;
                        display: -webkit-box;
                        -webkit-line-clamp: 3;
                        overflow: hidden;
                        -webkit-box-orient: vertical;  
                    }
                }

                .card-footer{
                    @include flex($justify:space-between, $align:flex-end);

                    .time{
                        color: $color-main;
                        font-weight: 600;
                    }
                    button{
                        @include flex($align:flex-end);
                        cursor: pointer;
                        
                        svg{
                            border-radius: 2em;
                            border: 2px solid $color-main;
                            height: 2.5rem;
                            width: 2.5rem;
                            padding: 0.25em;

                            &.plus{
                                fill: white;
                                background: $color-main;
                                box-shadow: $shadow;

                                &:hover{
                                    box-shadow: $shadow3;
                                }
                            }
                            &.check{
                                background-color: $color-gray4;
                                border: none;
                                box-shadow: inset 2px 2px 4px $color-gray2, inset -2px -2px 4px white;
                                fill: $color-gray2;
                                
                                &:hover{
                                box-shadow: inset 2px 2px 4px $color-gray3, inset -2px -2px 4px white;
                                }
                            }

							transition: all 100ms ease-in-out;
                        }
                    }
                }
            }
        }

        &:active{
            box-shadow: 1px 1px 4px #00000016, -2px -2px 5px white;
            transform:scale(0.99)
        }

        transition: all 100ms ease-in-out;
        &:hover{
            box-shadow: $shadow4;
            transform: translateY(-3px);
        }
    }
</style>