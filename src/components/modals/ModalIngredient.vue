<script setup>
    import { reactive } from 'vue';
	const emit = defineEmits(['add-ingredient', 'cancel']);

    const newIngredient = reactive({
        name: '',
        category: 'Others',
        amount: 1,
        unit: 'unit'
    })

    function clear(){
        newIngredient.name = '';
        newIngredient.category = 'Others',
        newIngredient.amount = 1;
        newIngredient.unit = 'unit';
        emit('cancel');
    }

    function addIngredient(){
        let ingredient = Object.assign({}, newIngredient);
        emit('add-ingredient', ingredient);
        clear();
    }
    
</script>

<template>
    <div class="add-ingredient-modal">
        <div class="add-ingredient-modal-container">
            <h2>Add new ingredient</h2>
            <div class="ingredient-name input-group">
                <label for="ingredient-name">Ingredient Name</label>
                <input v-model="newIngredient.name" id="ingredient-name" type="text" placeholder="Enter ingredient name" maxlength="24">
            </div>
            <div class="ingredient-category input-group">
                <label for="ingredient-category">Category</label>
                <select v-model="newIngredient.category" id="ingredient-category">
                    <option value="Meat & Seafood">Meat & Seafood</option>
                    <option value="Canned & Sauces">Canned & Sauces</option>
                    <option value="Eggs & Dairy">Eggs & Dairy</option>
                    <option value="Condiments & Spices">Condiments & Spices</option>
                    <option selected value="Others">Others</option>
                    <option value="Produce">Produce</option>
                </select>
            </div>
            <div class="ingredient-amount input-group">
                <label for="ingredient-amount">Amount</label>
                <div class="amount-container">
                    <input v-model="newIngredient.amount" type="number" id="ingredient-amount" min="0">
                    <select v-model="newIngredient.unit" id="ingredient-unit" class="unit">
                        <option value="g">g</option>
                        <option selected value="unit">unit</option>
                        <option value="cup">cup</option>
                        <option value="pcs">pcs</option>
                        <option value="tbsp">tbsp</option>
                        <option value="lb">lb</option>
                    </select>
                </div>
            </div>
            <div class="cta-container">
                <button @click="clear()" class="cancel">Cancel</button>
                <button :class="{'inactive': newIngredient.name.length < 1}" @click="addIngredient()" class="submit">Submit</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
	@use '@/assets/scss/abstracts' as *;

    .add-ingredient-modal{
        @include flex($align:center, $justify:center);
        z-index: 4;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 1rem;
        background: rgba(240, 240, 240, 0.95);
        transition: all 200ms ease-in-out;

        .add-ingredient-modal-container{
            @include flex($direction:column, $gap:2rem);
            padding: 2rem;
            border-radius: 2rem;
            background-color: $color-gray4;
            box-shadow: $shadow;
            width: 100%;

            h2{
                font-size: 2rem;
                font-weight: 700;
            }

            .input-group{
                @include flex($direction:column);
                gap: 1em;

                label{
                    text-transform: uppercase;
                    color: $color-gray1;
                    pointer-events: none;
                }
                input, select{
                    font-size: 1.25rem;
                    -webkit-appearance: none;
                }
            }

            .ingredient-name{
                #ingredient-name{

                }
            }

            .ingredient-category{
                #ingredient-category{

                }
            }
            .ingredient-amount{
                .amount-container{
                    @include flex($gap: 1em);

                    #ingredient-amount{
                        flex-grow: 1;
                    }
                    #ingredient-unit{

                    }
                }
            }
            .cta-container{
                @include flex($justify:flex-end, $gap: 1rem);
                margin-top: 1rem;

                button{
                    font-size: 1.25rem;
                    
                    &.cancel{
                        @include button($color-type:2, $radius-type:2);
                    }

                    &.submit{
                        @include button($color-type:1, $radius-type:2);

                        &.inactive{
                            pointer-events: none;
                            opacity: 0.1;
                        }
                    }
                }
            }
        }
    }
</style>