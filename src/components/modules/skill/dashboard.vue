<template>
    <table class="table table-condensed table-responsive">
        <thead>
        <tr>
            <th class="text-center">Name</th>
            <th class="text-center">Created time</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="skills && skills.length"
            v-for="skill in skills">
            <td class="text-center">{{skill.name}}</td>
            <td class="text-center">{{skill.createdTime}}</td>

            <td class="text-center">
                <button class="btn btn-info">
                    <i class="glyphicon glyphicon-pencil"></i>
                </button>
                <span>&nbsp;</span>
                <button class="btn btn-danger">
                    <i class="glyphicon glyphicon-remove"></i>
                </button>
            </td>
        </tr>
        <tr v-if="!skills || !skills.length">
            <td colspan="5"
                class="text-center">
                <i class="text-danger">No information is available.</i>
            </td>
        </tr>
        <tr>
            <td colspan="5">
                <div class="pull-right">
                    <button class="btn btn-primary">
                        <i class="glyphicon glyphicon-plus"></i>
                    </button>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
    export default {
        name: 'skill-dashboard',
        data() {
            return {
                skills: []
            }
        },
        mounted(){
            this.skills = [
                {
                    name: 'Skill 01',
                    createdTime: 0
                }
            ]
        }
    }
</script>

<style scoped>

</style>