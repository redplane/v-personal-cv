<template>
    <div>
        <h3 v-if="!user.id">Add user</h3>
        <h3 v-if="user.id">Edit user</h3>
        <hr/>
        <div v-if="user">
            <!--First name-->
            <div class="row">
                <div class="col-lg-3">
                    <label>First name</label>
                </div>
                <div class="col-lg-9">
                    <div class="form-group">
                        <input class="form-control"
                               v-model="user.firstName"/>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-lg-3">
                    <label>Last name</label>
                </div>
                <div class="col-lg-9">
                    <div class="form-group">
                        <input class="form-control"
                               v-model="user.lastName"/>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-lg-3">
                    <label>Birthday</label>
                </div>
                <div class="col-lg-9">
                    <div class="form-group">
                        <input class="form-control"
                               v-model="user.birthday"/>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-lg-3">
                    <label>Role</label>
                </div>
                <div class="col-lg-9">
                    <div class="form-group">
                        <input class="form-control"
                               v-model="user.role"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel-footer">
            <div class="text-center">
                <button class="btn btn-primary"
                        v-on:click="vOnClickOk()">OK
                </button>
                <span>&nbsp;</span>
                <button class="btn btn-default"
                        v-on:click="vOnClickCancel()">Cancel
                </button>
            </div>
        </div>
    </div>
</template>

<script>

    // Import vue.
    import Vue from 'vue';

    export default {
        name: 'user-detail',
        props: {
            userProperty: {}
        },
        data() {
            return {
                user: null,
                visibility: false
            }
        },
        mounted() {

            let self = this;
            let pGetUserDetailPromise = new Promise(resolve => {
                resolve(self.userProperty);
            });

            pGetUserDetailPromise
                .then((user) => {
                    if (!user)
                        self.user = Vue.util.extend({}, {});
                    else
                        self.user = Vue.util.extend({}, user);
                });
        },
        methods: {
            vOnClickOk() {
                let user = Vue.util.extend({}, this.user);
                this.$emit('confirm', user);
            },
            vOnClickCancel() {
                this.$emit('cancel');
            }
        }
    }
</script>

<style scoped>

</style>