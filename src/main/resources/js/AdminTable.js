async function getUser (){
    const table = document.querySelector('#tableUser tbody')
    let temp = ''
    await userFetch.findUserByUserName().then(res => res.json())
        .then(user => {
            temp = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.lastname}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(r => ' ' + r.role).join(', ')}</td>
                </tr>
            `
            table.innerHTML = temp
            $(function () {
                let role = ""
                for (let i=0; i < user.roles.length; i++ ){
                    role = user.roles[i].role
                    if(role ==='ADMIN'){
                        isUser = false
                    }
                }
                if(isUser){
                    $('#userTable').addClass('show active')
                    $('#userTab').addClass('show active')
                }else {
                    $('#adminTable').addClass('show active')
                    $('#adminTab').addClass('show active')
                    $('#tableMable').addClass('show active')
                }
            })
        })
}

async function getCreateUserForm () {
    let button = $('#addUser')
    let form = $('#addForm')

    button.on('click', () => {
        console.log('Button clicked');
        form.show()
    })
}



async function getAllUsers () {
    const table = document.querySelector('#tableAllUsers tbody')
    let row = ''
    await userFetch.findUsersAll().then(res => res.json())
        .then(users => {
            users.forEach(user => {
                const roles = user.roles.map(r => ' ' + r.role).join(', ')
                row += `
            <tr>            
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.lastname}</td>
                <td>${user.age}</td>
                <td>${user.email}</td>
                <td>${roles}</td>
                <td>        
                    <button id="1" type="button" data-userid="${user.id}" data-action="edit" 
                    className data-toggle="modal" class="btn btn-info" data-target="#editModal">Edit</button>
                </td>
                <td>        
                    <button id="2" type="button" data-userid="${user.id}" data-action="delete" 
                    className data-toggle="modal" class="btn btn-danger" data-target="#deleteModal" >Delete</button>
                </td>
            </tr>`

            })
            table.innerHTML = row

        })
    $('#tableAllUsers').find('button').on('click', (event) => {
        let defaultModal = $('#defaultModal')

        let targetButton = $(event.target)
        console.log(targetButton)
        let buttonUserId = targetButton.attr('data-userid')
        let buttonAction = targetButton.attr('data-action')

        defaultModal.attr('data-userid', buttonUserId)
        defaultModal.attr('data-action', buttonAction)
        defaultModal.modal('show')

    })
}
async function getUserPanel () {
    let adminTab = document.getElementById('adminTab');
    let userTab = document.getElementById('userTab');
    let adminTable = document.getElementById('adminTable');
    let userTable = document.getElementById('userTable');

    adminTab.addEventListener('click', function () {
        adminTab.classList.add('active');
        userTab.classList.remove('active');
        adminTable.classList.add('active', 'show');
        adminTable.classList.remove('fade');
        userTable.classList.add('fade');
        userTable.classList.remove('active', 'show');
    });

    userTab.addEventListener('click', function () {
        userTab.classList.add('active');
        adminTab.classList.remove('active');
        userTable.classList.add('active', 'show');
        userTable.classList.remove('fade');
        adminTable.classList.add('fade');
        adminTable.classList.remove('active', 'show');
    });
}

async function getNewUserForm() {
    let tabsButton = document.querySelectorAll('.nav-item')
    let tabsItemzs = document.querySelectorAll('.tab-pane')
    console.log(tabsButton);
    let divForm = $('#newUser')
    tabsButton.forEach(function (item) {
        item.addEventListener("click", event => {
            let currentBtn = item.querySelector('.nav-link')
            let href = currentBtn.getAttribute('data-tab')
            let currentTab = document.querySelector(href)
            console.log(currentBtn);
            console.log(href);

            tabsButton.forEach( function (item) {
                let currentBtn = item.querySelector('.nav-link')
                currentBtn.classList.remove('active')
            })

            tabsItemzs.forEach( function (item) {
                item.classList.remove('active')
                item.classList.add('fade')
            })

            currentBtn.classList.add('active')
            currentTab.classList.add('active')
            currentTab.classList.remove('fade')
        })
    })
}

async function getDefaultModel() {
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