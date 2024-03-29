async function deleteUser(modal, id) {
    console.log("Попал в делит" + " id user = " + id)
    let userResponse = await fetch(`http://localhost:8090/admin/user/${id}`)
    let user = await userResponse.json()
    modal.find('modal-title').html('Delete user')
    let deleteButton = `<button class="btn btn-danger" id="deleteButton">Delete</button>`
    // let closeButton = `<button type="button" class="btn btn-success" id="closeButton" data-dismiss="modal"> Close</button>`
    modal.find('.modal-footer').append(deleteButton)
    // modal.find('.modal-footer').append(closeButton)

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
        const response = await fetch(`http://localhost:8090/admin/delete?id=${id}`, { method: 'DELETE', headers: head })
        if (response.ok) {
            //await allUsers();
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

