/* eslint-env browser, jquery */

let projectsVue

project.addEventListener('DOMContentLoaded', function() {
	showWait()
	projectsVue = new Vue({
		el: '#projectList',
		data: {
			projects: {
				urgent: [
					{
						name: 'Project 00',
						_id: 'o00000'
					},
					{
						name: 'Project 10',
						_id: 'o00010'
					}
				],
				normal: [
					{
						name: 'Project 01',
						_id: 'o00001'
					},
					{
						name: 'Project 11',
						_id: 'o00011'
					}
				]
			}
		},

		methods: {
			poplateProjects: function() {
				let currentVue = this

				fetch('/api/projects')
					.then(function(response) {
						return response.json()
					})
					.then(function(projects) {
						currentVue.projects.urgent = projects.filter(project => project.urgent)
						currentVue.projects.normal = projects.filter(project => !project.urgent)
					})
					.catch(function(error) {
						M.toast({ html: 'Error occured! Check console for details.' })
						console.error(error)
					})
			},
			viewProject: function(id) {
				localStorage.setItem('selectedProject', id)
				window.location.href = '/project'
			}
		},

		mounted: function() {
			this.poplateProjects()
			M.AutoInit()
			hideWait()
		}
	})
})

function deleteproject (id) {
    if(confirm('Are you sure you want to delete?')){
        $.post('/project/' + id + '/delete',{}, function (status){
            if(status){
                project.location.reload();
            }
        });
    }
}

function populate(id) {

    $.get('/project/' + id, {}, function (project) {
        /*M.toast({
            html: 'Product Found ' + product.name
        });*/
        $('#edit-modal').modal('open');
        $('#modal-heading').html('Edit project');


        $('#project-description').val(project.description).focus();
        $('#project-cost').val(project.cost).focus();
        $('#project-owner').val(project.owner).focus();
        $('#project-url').val(project.url).focus();
        $('#project-name').val(project.name).focus();

        $('#project-form').attr('action', '/project/' + id + '/update');
        $('#delete-btn').attr('href', 'javascript:deleteproject("' + id + '");');

        //console.log(product._id)
    });


}

function clearproject() {


    $('#edit-modal').modal('open');
    $('#modal-heading').html('Create project');

    $('#project-description').val('').focus();
    $('#project-image').val('').focus();
    $('#project-cost').val('').focus();
    $('#project-owner').val('').focus();
    $('#project-url').val('').focus();
    $('#project-name').val('').focus();

    $('#project-form').attr('action', '/project/create');

    $('#delete-btn').attr('href', '!#');


}

