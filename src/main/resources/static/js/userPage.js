$(async function() {
    await thisUser();
});
async function thisUser() {
    await fetch("http://localhost:8090/")
        .then(res => res.json())
        .then(data => {
            $('#headerUsername').append(data.username);
            let roleList = data.roles.map(role => role.name.substring(5).concat(" ")).toString().replaceAll(",", "");
            $('#headerUserRolesRoles').append(roleList);
            let user = `$(
            <tr>
                <td>${data.id}</td>
                <td>${data.name}</td>
                <td>${user.lastName}</td>
                <td>${data.username}</td>
                <td>${roleList}</td>)`;
            $('#userTableBody').append(user);
        })
}