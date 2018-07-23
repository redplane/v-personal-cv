<template>
    <div>
        <div class="panel panel-body">
            <div class="panel-heading">
                <h3 class="panel-title">Image selector</h3>
            </div>
            <div class="panel-body">
                <croppa v-model="myCroppa"
                        :width="400"
                        :height="400"
                        :canvas-color="'default'"
                        :placeholder="'Choose an image'"
                        :placeholder-font-size="0"
                        :placeholder-color="'default'"
                        :accept="'image/*'"
                        :file-size-limit="0"
                        :quality="2"
                        :zoom-speed="3"
                        :disabled="false"
                        :disable-drag-and-drop="false"
                        :disable-click-to-choose="false"
                        :disable-drag-to-move="false"
                        :disable-scroll-to-zoom="false"
                        :disable-rotation="false"
                        :prevent-white-space="false"
                        :reverse-scroll-to-zoom="false"
                        :show-remove-button="true"
                        :remove-button-color="'red'"
                        :remove-button-size="0"
                        :initial-image="'path/to/initial-image.png'"
                        @init="handleCroppaInit"
                        @file-choose="handleCroppaFileChoose"
                        @file-size-exceed="handleCroppaFileSizeExceed"
                        @file-type-mismatch="handleCroppaFileTypeMismatch"
                        @new-image-drawn="handleNewImage"
                        @image-remove="handleImageRemove"
                        @move="handleCroppaMove"
                        @zoom="handleCroppaZoom"></croppa>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'image-cropper',
    }
</script>

<style scoped>

</style>