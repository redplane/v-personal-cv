<div class="col-lg-12">
    <div class="form-group">
        <table class="table table-responsive table-condensed">
            <thead>
            <tr>
                <th class="text-center">Name</th>
                <th class="text-center">Started time</th>
                <th class="text-center">Finished time</th>
                <th class="text-center">Responsibilities</th>
                <th class="text-center">Skills</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="project in user.projects">
                <td class="text-center">
                    <b class="text-success">{{project.name}}</b>
                </td>
                <td class="text-center">{{project.startedTime}}</td>
                <td class="text-center">{{project.finishedTime}}</td>
                <td>
                    <div v-for="responsibility in project.responsibilities" class="text-center">
                        {{responsibility.name}}
                    </div>
                </td>
                <td class="text-center">
                    <div v-for="skill in project.skills"
                         class="text-center">
                        {{skill.name}}
                    </div>
                </td>
                <td>
                    <button class="btn btn-danger"
                            @click="deleteProject(project.id)">
                        <span class="fa fa-trash"></span>
                    </button>
                </td>
            </tr>
            <tr>

            </tr>
            </tbody>
        </table>
    </div>
</div>