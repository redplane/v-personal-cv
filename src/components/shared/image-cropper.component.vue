<template>
    <div>
        <div class="panel panel-info">
            <div class="panel-heading">
                <h3 class="panel-title"><b class="fa fa-camera"></b> Image selector</h3>
            </div>
            <div class="panel-body text-center">
                <div class="form-group">
                    <croppa v-model="imageCropper"
                            :width="512"
                            :height="512"
                            :disable-rotation="true"
                            :prevent-white-space="true"
                            :show-remove-button="false"
                            :quality="1"
                            @new-image-drawn="vOnNewImageDrawn()"></croppa>
                </div>

                <div class="form-group"
                     v-if="bImageDrawn">
                    <button class="btn btn-default"
                            @click="vOnRemoveImageClick()">
                        <span class="fa fa-trash"></span>
                    </button>
                </div>
            </div>
            <div class="panel-footer">
                <div class="text-center">
                    <button class="btn btn-primary"
                            :disabled="!bImageDrawn"
                            @click="vOnImageCropped()">OK
                    </button>
                    <span>&nbsp;</span>
                    <button class="btn btn-default"
                            @click="vOnCancelClicked()">Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Vue, Component} from 'vue-property-decorator'

    @Component({
        name: 'image-cropper'
    })
    export default class ImageCropperComponent extends Vue {

        //#region Properties

        // Image cropper instance.
        private imageCropper: any = {};

        // Whether any image is drawn or not.
        private bImageDrawn: boolean = false;

        //#endregion

        //#region Methods

        /*
        * Called when remove image button is clicked.
        * */
        public vOnRemoveImageClick(): void {
            this.imageCropper.remove();
            this.bImageDrawn = false;
        }

        /*
        * Called when new image is drawn on canvas.
        * */
        public vOnNewImageDrawn(): void {
            this.bImageDrawn = true;
        }

        /*
        * Called when cancel button is clicked.
        * */
        public vOnCancelClicked() : void {
            this.$emit('cancel');
        }

        /*
        * Called when image has been selected & ok button is clicked.
        * */
        public vOnImageCropped(): void {

            // Generate image from cropper instance.
            this.imageCropper
                .generateBlob((blob: Blob) => {
                    this.$emit('image-cropped', blob);
                }, 'image/png', 0);
        }

        //#endregion
    }
</script>

<style scoped>

</style>