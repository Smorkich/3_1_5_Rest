$(async function() {
    await thisUser();
});
async function thisUser() {
    fetch("http://localhost:8090/user")

        .then(res => res.json())
        .then(data => {
            $('#headerUsername').append(data.username);
            let roleList = data.roles.map(role => role.role.substring(5).concat(" ")).toString().replaceAll(",", "");
            $('#headerUserRolesRoles').append(roleList);

            let user = `$(
            <tr>
                <td>${data.id}</td>
                <td>${data.name}</td>
                <td>${data.username}</td>
                <td>${roleList}</td>)`;
            $('#userTableBody').append(user);
        })
}