
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
        console.log('попал в функцию ')
        e.preventDefault();
        console.log('Перед чек ролес')
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
            $('#adminTable').click();
        })
    }

}