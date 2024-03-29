$(async function () {
    await allUsers();
    await getDefaultModal();
})

const table = $('#allUsersTBody');
async function allUsers() {
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
                            <td>${user.roles.map(role => role.name.substring(5).concat(" ")).toString().replaceAll(",", "")}</td>
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
                deleteUser(target,userId);
                break;
        }
    }).on('hidden.bs.modal', (e) => {
        let target = $(e.target)
        target.find('.modal-title').html('')
        target.find('.modal-body').html('')
        target.find('.modal-footer').html('')
    })
}

async function infoUser () {
    let temp = ''
    const info = document.querySelector('#info')
    await fetch("http://localhost:8090/admin/userThis")
        .then(res => res.json())
        .then(user => {
            temp += `
                <span style='color: #ffffff'>${user.username} with roles : <span> ${user.roles.map(e => '' + e.role)} </span>
                 </span>
                `
        })
    info.innerHTML = temp
}