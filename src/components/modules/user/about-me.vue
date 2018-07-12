<template>
    <div class="row">
        <div class="col-lg-12">
            <div class="box box-default">
                <div class="box-header"><h3 class="box-title">About me</h3></div>
                <div class="box-body"
                     v-if="aboutMe && aboutMe.paragraphs">
                    <ul>
                        <li v-for="paragraph in aboutMe.paragraphs" class="alert alert-info"> {{paragraph}}</li>
                    </ul>
                </div>
            </div>
            <div class="box box-info">
                <div class="box-header"><h3 class="box-title">My hobbies</h3></div>
                <div class="box-body"
                     v-if="hobbies">
                    <div v-for="hobby in hobbies">
                        <div class="row">
                            <div class="col-lg-12"><b class="fa fa-star text-danger"></b> <label>{{hobby.name}}</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">{{hobby.description}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    export default {
        name: 'about-me',
        data() {
            return {
                aboutMe: {},
                hobbies: []
            }
        },
        computed: {},
        mounted() {
            this.aboutMe = {
                paragraphs: ['1', '2', '3']
            };

            this.hobbies = [
                {
                    name: 'Name 01',
                    description: 'Description 01'
                },
                {
                    name: 'Name 02',
                    description: 'Description 02'
                }
            ];
        }
    }
</script>

<style scoped>

</style>