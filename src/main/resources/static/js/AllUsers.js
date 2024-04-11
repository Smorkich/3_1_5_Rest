document.addEventListener('DOMContentLoaded', function() {
    $(async function () {
        await getUser()
        await getDefaultModal();
        await infoUser();
        await allUsers();
        await getUserPanel()
    })
    let isAdmin = false;
    const table = $('#allUsersTBody');

    async function allUsers() {
        table.empty();
        await fetch("http://localhost:8090/admin/users")
            .then(res => res.json())
            .then(data => {
                data.forEach(user => {
                    let tableWithUsers = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.lastName}</td>
                            <td>${user.username}</td>
                            <td>${user.roles.map(role => role.name
                        .substring(5).concat(" ")).toString().replaceAll(",", "")}</td>
                            <td>
                                <button type="button" class="btn btn-info" data-userid="${user.id}" data-toggle="modal" id="buttonEdit"
                                data-action="edit" data-target="#edit">Edit</button>
                            </td>
                            <td>
                                <button type="button" class="btn btn-danger" data-toggle="modal" id="buttonDelete"
                                data-action="delete" data-userid="${user.id}" data-target="#delete">Delete</button>
                            </td>
                        </tr>)`;
                    table.append(tableWithUsers);
                })
            })
        $('#tableAllUsers').find('button').on('click', (event) => {
            let defaultModal = $('#defaultModal')

            let targetButton = $(event.target)
            let buttonUserId = targetButton.attr('data-userid')
            let buttonAction = targetButton.attr('data-action')

            defaultModal.attr('data-userid', buttonUserId)
            defaultModal.attr('data-action', buttonAction)
            defaultModal.modal('show')
        })
    }

    async function getDefaultModal() {
        console.log("Попал в ивенты модалки")
        $('#defaultModal').modal({
            keyboard: true,
            background: "static",
            show: false
        }).on('show.bs.modal', (event) => {
            let target = $(event.target)
            let userId = target.attr('data-userid')
            let action = target.attr('data-action')
            switch (action) {
                case 'edit' :
                    editUser(target, userId);
                    break;
                case 'delete' :
                    deleteUser(target, userId);
                    break;
            }
        }).on('hidden.bs.modal', (e) => {
            let target = $(e.target)
            target.find('.modal-title').html('')
            target.find('.modal-body').html('')
            target.find('.modal-footer').html('')
        })
    }

    async function infoUser() {
        let temp = ''
        const info = document.querySelector('#info')
        await fetch("http://localhost:8090/admin/userThis")
            .then(res => res.json())
            .then(user => {
                temp += `
                <span style='color: #ffffff'>${user.username} with roles : <span> ${user.roles.map(role => role.name
                    .substring(5).concat(" ")).toString().replaceAll(",", "")} </span>
                 </span>
                `
            })
        info.innerHTML = temp
    }

    async function getUser() {
        const table = document.querySelector('#tableUser tbody');
        let temp = '';
        await fetch("http://localhost:8090/admin/userThis")
            .then(res => res.json())
            .then(user => {
                temp = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.lastName}</td>
                    <td>${user.username}</td>
                    <td>${user.roles.map(role => role.name
                    .substring(5).concat(" ")).toString().replaceAll(",", "")}</td>
                </tr>
            `;
                table.innerHTML = temp;
                $(function () {
                    isAdmin = user.roles.some(role => role.name === 'ROLE_ADMIN');
                    if (isAdmin) {
                        $('#adminTab').addClass('active');
                        $('#adminTable').addClass('active show');
                        $('#userTab').removeClass('active');
                        $('#userTable').removeClass('active show');
                    } else {
                        $('#userTab').addClass('active');
                        $('#userTable').addClass('active show');
                        $('#adminTab').removeClass('active');
                        $('#adminTable').removeClass('active show');
                    }
                });
            });
    }

    async function getUserPanel() {
        $('#adminTab').click(function () {
            $('#adminPanel').show();
            $('#adminTable').addClass('active show').removeClass('fade');
            $('#userTable').removeClass('active show').addClass('fade');
            $('#userTab').removeClass('active')
            $('#adminTab').addClass('active')
        });

        $('#userTab').click(function () {
            $('#adminPanel').hide();
            $('#userTable').addClass('active show').removeClass('fade');
            $('#adminTable').removeClass('active show').addClass('fade');
            $('#userTab').addClass('active')
            $('#adminTab').removeClass('active')
        });
    }


    $(async function() {
        await newUser();
    });
    let roleList = [
        {id : 1 , name: 'USER'},
        {id : 2 , name: 'ADMIN'}
    ]
    async function newUser() {
        const form = document.forms["newUserForm"];

        form.addEventListener('submit', addNewUser)

        function addNewUser(e) {
            e.preventDefault();
            let checkedRoles = () => {
                let array = []
                let options = document.querySelector('#addRoles').options
                for ( let i =0; i < options.length; i++){
                    if (options[i].selected){
                        array.push(roleList[i])
                    }
                }
                return array
            }
            console.log(checkedRoles())
            fetch("http://localhost:8090/admin/newUser", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: form.name.value,
                    lastName: form.lastName.value,
                    username: form.username.value,
                    password: form.password.value,
                    roles: checkedRoles()
                })
            }).then(() => {
                form.reset();
                allUsers();
                $('#tableMable').tab('show');
                $('#adminTable').click();
            })
        }

    }


    async function deleteUser(modal, id) {
        let userResponse = await fetch(`http://localhost:8090/admin/user/${id}`)
        let user = await userResponse.json()
        modal.find('modal-title').html('Delete user')
        let deleteButton = `<button class="btn btn-danger" id="deleteButton">Delete</button>`
        let closeButton = `<button type="button" class="btn btn-secondary" id="closeButton" data-bs-dismiss="modal"> Close</button>`
        modal.find('.modal-footer').append(deleteButton)
        modal.find('.modal-footer').append(closeButton)

        let roles = user.roles;
        let rolesHtml = "";
        roles.forEach(role => {
            rolesHtml += `<option value="${role.id}">${role.name.substring(5).concat(" ").toString().replaceAll(",", "")}</option>`;
        });
        let bodyForm = `
                        <div class="modal-body">
                            <form id="deleteUser">
                                <div class="row justify-content-center">
                                    <div class="col-md-6">
                                        <label for="id1"
                                               class="form-label">
                                            <strong>ID</strong>
                                        </label>
                                        <input name="id1" type="text"
                                               class="form-control"
                                               id="id1"
                                               value="${user.id}"
                                               disabled>
                                    </div>
                                </div>
                                <div class="row justify-content-center">
                                    <div class="col-md-6 pt-3 ">
                                        <label for="firstName1"
                                               class="form-label">
                                            <strong>First name</strong>
                                        </label>
                                        <input name="firstName1"
                                               type="text"
                                               class="form-control"
                                               id="firstName1"
                                               value="${user.name}"
                                               disabled>
                                    </div>
                                </div>
                                <div class="row justify-content-center">
                                    <div class="col-md-6 pt-3">
                                        <label for="lastName1"
                                               class="form-label">
                                            <strong>Last name</strong>
                                        </label>
                                        <input name="lastname1"
                                               type="text"
                                               class="form-control"
                                               id="lastName1"
                                               value="${user.lastName}"
                                               disabled>
                                    </div>
                                </div>
                                <div class="row justify-content-center">
                                    <div class="col-md-6 pt-3">
                                        <label for="email1"
                                               class="form-label">
                                            <strong>Email</strong>
                                        </label>
                                        <input name="email1" type="text"
                                               class="form-control" id="email1"
                                               value="${user.username}"
                                               disabled>
                                    </div>
                                </div>
                                <div class="row justify-content-center">
                                    <div class="col-md-6 pt-3">
                                        <label for="roles1">Role</label>
                                        <select multiple class="form-control form-control-sm" id="roles1" name="roles" size="2" disabled>
                                            ${rolesHtml}
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
        `
        modal.find('.modal-body').append(bodyForm)

        $(`#deleteButton`).on('click', async () => {
            let head = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Referer': null
            }
            const response = await fetch(`http://localhost:8090/admin/delete?id=${id}`, {method: 'DELETE', headers: head})
            if (response.ok) {
                await allUsers();
                modal.modal('hide');
            } else {
                let body = await response.json();
                let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
                modal.find('.modal-body').prepend(alert);
            }
        })
    }


    async function editUser(modal, id) {
        console.log("Попал в edit" + " id user = " + id)
        let userResponse = await fetch(`http://localhost:8090/admin/user/${id}`)
        let user = await userResponse.json()
        modal.find('modal-title').html('Edit user')
        let editButton = `<button class="btn btn-primary" id="editButton">Edit</button>`
        let closeButton = `<button type="button" class="btn btn-secondary" id="closeButton" data-bs-dismiss="modal"> Close</button>`
        modal.find('.modal-footer').append(editButton)
        modal.find('.modal-footer').append(closeButton);

        let bodyForm = `
                    <div class="modal-body">
                        <form id="editForm">
                        <div class="row justify-content-center">
                            <div class="col-md-6">
                                <label for="Id" class="form-label">
                                    <strong>ID</strong>
                                </label>
                                <input  class="form-control" name="id" id="Id"
                                value="${user.id}"
                                     disabled>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-6 pt-3 ">
                                <label for="FirstName" class="form-label">
                                    <strong>First name</strong>
                                </label>
                                <input  class="form-control" name="firstName" id="FirstName"
                                value="${user.name}"
                                    >
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-6 pt-3">
                                <label for="LastName" class="form-label">
                                    <strong> Last name</strong>
                                </label>
                                <input size="8" name="lastName" class="form-control"
                                value="${user.lastName}"
                                    id="LastName" >
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-6 pt-3">
                                <label for="email" class="form-label">
                                    <strong>Email</strong>
                                </label>
                                <input name="username"  class="form-control"
                                value="${user.username}"
                                    id="email">
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-6 pt-3">
                                <label for="passw" class="form-label">
                                    <strong>Password</strong>
                                </label>
                                <input name="password"  class="form-control"
                                    id="passw">
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-6 pt-3">
                                <label for="roles"><strong>Role</strong></label>
                                <select multiple class="form-control form-control-sm" id="rolesSel" name="rolesSel" size="2">
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
        `
        modal.find('.modal-body').append(bodyForm)

        $(`#editButton`).on('click', async () => {

            let roles = () => {
                let array = []
                let options = document.querySelector('#rolesSel').options
                for (let i = 0; i< options.length; i++){
                    if (options[i].selected){
                        array.push(roleList[i])
                    }
                }
                return array
            }

            let head = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Referer': null
            }
            //const editForm = document.getElementById('editForm');
            const response = await fetch(`http://localhost:8090/admin/edit?id=${id}`, {
                method: 'PATCH',
                headers: head,
                body: JSON.stringify({
                    id: modal.find('#Id').val().trim(),
                    name: modal.find('#FirstName').val().trim(),
                    lastName: modal.find('#LastName').val().trim(),
                    username: modal.find('#email').val().trim(),
                    password: modal.find('#passw').val().trim(),
                    roles: roles()
                })
            })

            if (response.ok) {
                await allUsers()
                modal.modal('hide')
            } else {
                let body = await response.json();
                let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="MessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
                modal.find('.modal-body').prepend(alert);
                const errorMessage = document.getElementById('errormessage');

                const closeButton = errorMessage.querySelector('.close');

                closeButton.addEventListener('click', function() {
                    errorMessage.style.display = 'none';
                });
            }
        })
    }
});