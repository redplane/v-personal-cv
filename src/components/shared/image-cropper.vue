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
                            @click="vOnImageCropped()">OK</button>
                    <span>&nbsp;</span>
                    <button class="btn btn-default"
                            @click="vOnCancelClicked()">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'image-cropper',
        data(){
            return {

                // Image cropper instance.
                imageCropper: {},

                // Whether any image is drawn or not.
                bImageDrawn: false
            }
        },
        methods:{

            /*
            * Called when remove image button is clicked.
            * */
            vOnRemoveImageClick(){
                this.imageCropper.remove();
                this.bImageDrawn = false;
            },

            /*
            * Called when new image is drawn on canvas.
            * */
            vOnNewImageDrawn(){
                this.bImageDrawn = true;
            },

            /*
            * Called when cancel button is clicked.
            * */
            vOnCancelClicked(){
                this.$emit('cancel');
            },

            /*
            * Called when image has been selected & ok button is clicked.
            * */
            vOnImageCropped(){
                // Get current context.
                let self = this;

                // Generate image from cropper instance.
                self.imageCropper
                    .generateBlob((blob) => {
                        self.$emit('image-cropped', blob);
                    }, 'image/png',0);
                this.$emit('')
            }
        }
    }
</script>

<style scoped>

</style>