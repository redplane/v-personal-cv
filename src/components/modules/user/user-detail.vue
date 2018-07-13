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
    export default {
        name: 'user-detail',
        props: {
            pUser: {},
            visibilityProperty: false
        },
        data() {
            return {
                user: this.pUser,
                visibility: false
            }
        },
        mounted() {

            let self = this;
            let ngUser = self.pUser;

            let pGetUserDetailPromise = new Promise(resolve => {
                resolve(ngUser);
            });

            pGetUserDetailPromise
                .then((user) => {
                    self.user = user;
                });

            this.visibility = this.visibilityProperty;
        },
        methods: {
            vOnClickOk() {
                this.$emit('confirm', {user: this.user});
            },
            vOnClickCancel() {
                this.$emit('cancel');
            }
        },
        watch: {
            visibilityProperty(val) {
                this.visibility = val;
            }
        }
    }
</script>

<style scoped>

</style>