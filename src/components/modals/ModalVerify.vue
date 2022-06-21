<script setup>
	defineEmits(['confirm', 'cancel'])
</script>

<template>
    <div class="verify">
        <div class="verify-container">
            <h2>Sure about this?</h2>
            <p>This action can not be reverted.</p>
            <div class="button-container">
                <button @click.stop="$emit('cancel')" class="cancel">Cancel</button>
                <button @click.stop="$emit('confirm');$emit('cancel')" class="confirm">Confirm</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
	@use '@/assets/scss/abstracts' as *;

    .verify{
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
        overflow: hidden;

        .verify-container{
            @include flex($direction:column, $gap:1rem);
            padding: 2rem 1rem;
            border-radius: 2rem;
            background-color: $color-gray4;
            box-shadow: $shadow;
            width: 100%;

            h2{
                font-size: 1.5rem;
                font-weight: 700;
            }

            p{
                font-size: 1.1rem;
            }

            .button-container{
                @include flex($justify:flex-end, $gap: 1rem);
                margin-top: 1rem;

                button{
                    font-size: 1.1rem;
                    
                    &.cancel{
                        @include button($color-type:2, $radius-type:2);
                    }

                    &.confirm{
                        @include button($color-type:1, $radius-type:2);
                    }
                }
            }
        }
    }
</style>