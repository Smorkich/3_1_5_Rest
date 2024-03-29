async function editUser(modal, id) {
    console.log("Попал в edit" + " id user = " + id)
    let userResponse = await fetch(`http://localhost:8090/admin/user/${id}`)
    let user = await userResponse.json()
    modal.find('modal-title').html('Edit user')
    let editButton = `<button class="btn btn-primary" id="editButton">Edit</button>`
    //let closeButton = `<button type="button" class="btn btn-success" id="closeButton" data-dismiss="modal"> Close</button>`
    modal.find('.modal-footer').append(editButton)
    //modal.find('.modal-footer').append(closeButton);

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
            //AllUsers()
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

