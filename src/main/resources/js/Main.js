let roleList = [
    {id : 1 , role: 'ADMIN'},
    {id : 2 , role: 'USER'}
]

$(async function () {
    await getUser ();
    await getDefaultModel ();
    await infoUser ();
    await getAllUsers ();
    await getNewUserForm ();
    await addUser();
    await getCreateUserForm();
    await getUserPanel();
})
let isUser = true;

const userFetch = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findUserByUserName : async () => await fetch('/admin/userThis'),
    findOneUser: async (id) => await fetch(`/admin/user?id=${id}`),
    findUsersAll: async () => await  fetch('/admin/users'),
    updateUser: async (user, id) => await fetch(`/admin/edit?id=${id}`,{method:'PUT', headers: userFetch.head, body : JSON.stringify(user)}),
    deleteUser: async (id) => await fetch(`/admin/delete?id=${id}`, {method:'DELETE', headers: userFetch.head}),
    addUser : async (user) => await fetch ('/admin/newUser', {method:'POST', headers: userFetch.head, body: JSON.stringify(user)})
}

async function infoUser () {
    let temp = ''
    const info = document.querySelector('#info')
    await userFetch.findUserByUserName()
        .then(res => res.json())
        .then(user => {
            temp += `
                <span style='color: #ffffff'>${user.email} with roles : <span> ${user.roles.map(e => '' + e.role)} </span>
                 </span>
                `
        })
    info.innerHTML = temp
}