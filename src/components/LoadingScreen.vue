<script setup>
    import { storeToRefs } from 'pinia';
    import { useMainStore } from '@/components/stores/mainStore';

	// STORE
    const store = useMainStore();
    const { loading } = storeToRefs(store);
</script>

<template>
    <Transition name="fade">
        <div v-if="loading" class="loading-screen">
            <img class="loading-logo" src="/images/logo-white.png" alt="">
        </div>
    </Transition>
</template>

<style lang="scss">
    @use '@/assets/scss/abstracts' as *;

    .loading-screen{
        position: fixed;
        top:0;
        left:0;
        height: 100%;
        width: 100%;
        bottom:0;
        z-index: 999;
        background-color: $color-main;
        @include flex($align:center, $justify: center);

        img.loading-logo{
            height: 75px;
            width: 75px;
            animation-duration: 2s;
            animation-name: breathe;
            animation-delay: 0;
            animation-iteration-count: infinite;
            animation-direction: alternate;
        }

        @keyframes breathe{
            0%{
                transform: scale(1.25);
            }
            100%{
                transform: scale(1);
            }
        }

        @include tablet-portrait-up{
            position: sticky;
            bottom:0;
        }
    }

</style>