const requestUrlPrefix = 'http://localhost:8090/api';


if (!document.querySelector('.messages')) {
    const container = document.createElement('div');
    container.classList.add('messages');
    container.style.cssText = 'position: fixed; top: 50%; left: 0; right: 0; max-width: 240px; margin: 0 auto;';
    document.body.appendChild(container);
}

const messages = document.querySelector('.messages');

//CRUD operations

const renderUserInfoTableRowContent = (user) => {
    let content = `<tr>
    <td>${user.id}</td>
    <td>${user.firstName}</td>
    <td>${user.lastName}</td>
    <td>${user.age == null ? '' : user.age}</td>
    <td>${user.username}</td>
    <td>`;
    user.roles.forEach(role => {
        const authority = role.name;
        content += `<span>${authority.replace("ROLE_", "")}</span>`;
    });
    content += '</td></tr>';

    document.getElementById('userInfoTableRow').innerHTML = content;
}

sendRequest('GET', '/user').then(user => renderUserInfoTableRowContent(user))


if (document.getElementById('v-pills-admin')) {
    const allUsersTableContent = (users) => {
        users.forEach(user => tableUsers(user))
    };


    //All users table
    const tableUsers = (user) => {
        let rowContent = `
            <tr id="allUsersTableRow${user.id}">
                <td>${user.id}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.age == null ? '' : user.age}</td>
                <td>${user.username}</td>
                <td>
        `;
        user.roles.forEach(role => {
            const authority = role.name;
            rowContent += `
                <span>${authority.replace("ROLE_", "")}</span>
            `;
        });
        rowContent += `
                </td>
                <td>
                    <button type="button" class="btn btn-info text-white" data-bs-toggle="modal" data-bs-target="#editModal" data-bs-userId="${user.id}">
                        Edit
                    </button>
                </td>
                <td>
                    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" data-bs-userId="${user.id}">
                        Delete
                    </button>
                </td>
            </tr>
        `;
        document.getElementById('usersListTable').innerHTML += rowContent;
    }
    sendRequest('GET', '/admin').then(users => allUsersTableContent(users));


    //Create new users
    document.getElementById('createUserForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const newUserRoles = [];
        if (document.getElementById('newRoleAdmin').selected) newUserRoles.push({id: 1, name: 'ROLE_ADMIN'});
        if (document.getElementById('newRoleUser').selected) newUserRoles.push({id: 2, name: 'ROLE_USER'});
        const newUser = {
            firstName: document.getElementById('newUserFirstName').value,
            lastName: document.getElementById('newUserLastName').value,
            age: document.getElementById('newUserAge').value,
            username: document.getElementById('newUserEmail').value,
            password: document.getElementById('newUserPassword').value,
            roles: newUserRoles
        };
        sendRequest('POST', '/admin', newUser).then(user => {
            if (user.id) {
                tableUsers(user);
                document.getElementById('newUserFirstName').value = '';
                document.getElementById('newUserLastName').value = '';
                document.getElementById('newUserAge').value = '';
                document.getElementById('newUserEmail').value = '';
                document.getElementById('newUserPassword').value = '';
                document.getElementById('newRoleAdmin').selected = true;
                document.getElementById('newRoleUser').selected = false;
                backToUsersTable();
            }
        });
    });


    //Edit user
    document.getElementById('editModal').addEventListener('show.bs.modal', (event) => {
        const userId = event.relatedTarget.getAttribute('data-bs-userId');
        sendRequest('GET', '/admin/' + userId).then(user => renderEditModalFormContent(user));
    });

    const renderEditModalFormContent = (user) => {
        document.getElementById('editForm').innerHTML = `
            <label class="d-block mx-auto pt-1 mt-2 mb-0 text-center fs-5 fw-bold">ID
                <input id="editUserId" 
                value="${user.id}" 
                type="text" disabled 
                class="form-control mx-auto" 
                style="width: 220px;">
            </label>
                
            <label class="form-label d-block mx-auto pt-1 mt-2 mb-0 text-center fs-5 fw-bold">First name
                <input id="editUserFirstName" 
                value="${user.firstName}" 
                type="text" 
                class="form-control mx-auto" 
                style="width: 220px;">
            </label>
                
            <label class="form-label d-block mx-auto pt-1 mt-3 mb-0 text-center fs-5 fw-bold">Last name
                <input id="editUserLastName" 
                value="${user.lastName}" 
                type="text" 
                class="form-control mx-auto" 
                style="width: 220px;">
            </label>
                
            <label class="form-label d-block mx-auto pt-1 mt-3 mb-0 text-center fs-5 fw-bold">Age
                <input id="editUserAge" min="0" max="200" 
                value="${user.age}" 
                type="number" 
                class="form-control mx-auto" 
                style="width: 220px;">
            </label>
                
            <label class="form-label d-block mx-auto pt-1 mt-3 mb-0 text-center fs-5 fw-bold">Email
                <input id="editUserUsername" 
                value="${user.username}" required 
                type="email" 
                class="form-control mx-auto" 
                style="width: 220px;">
            </label>
                
            <label class="form-label d-block mx-auto pt-1 mt-3 mb-0 text-center fs-5 fw-bold">Password
                <input id="editUserPassword" 
                value="" 
                type="text" 
                class="form-control mx-auto" 
                style="width: 220px;" 
                placeholder="New password">
            </label>
                
            <label class="form-label d-block mx-auto pt-1 mt-3 mb-0 text-center fs-5 fw-bold">Role
                <select size="2" multiple required class="form-select mx-auto" style="width: 220px;">
                    <option id="optionAdmin">ADMIN</option>
                    <option id="optionUser">USER</option>
                </select></label>
        `;
        user.roles.forEach(role => {
            if (role.id === 1) document.getElementById('optionAdmin').selected = true;
            if (role.id === 2) document.getElementById('optionUser').selected = true;
        });
    };

    document.getElementById('editForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const userRolesEdited = [];
        if (document.getElementById('optionAdmin').selected) userRolesEdited.push({id: 1, name: 'ROLE_ADMIN'});
        if (document.getElementById('optionUser').selected) userRolesEdited.push({id: 2, name: 'ROLE_USER'});
        const userEdited = {
            id: document.getElementById('editUserId').value,
            firstName: document.getElementById('editUserFirstName').value,
            lastName: document.getElementById('editUserLastName').value,
            age: document.getElementById('editUserAge').value,
            username: document.getElementById('editUserUsername').value,
            password: document.getElementById('editUserPassword').value,
            roles: userRolesEdited
        };
        sendRequest('PUT', '/admin', userEdited).then(user => {
            if (user) allUsersTableRowUpdate(user)
        });
        document.getElementById('buttonCloseModal').click();
    });

    const allUsersTableRowUpdate = (user) => {
        let allUsersTableRowContent = `
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age == null ? '' : user.age}</td>
            <td>${user.username}</td>
            <td>
        `;
        user.roles.forEach(role => {
            const authority = role.name;
            allUsersTableRowContent += `
                <span>${authority.replace("ROLE_", "")}</span>
            `;
        });
        allUsersTableRowContent += `
            </td>
            <td>
                <button type="button" class="btn btn-info text-white" data-bs-toggle="modal" data-bs-target="#editModal" data-bs-userId="${user.id}">
                    Edit
                </button>
            </td>
            <td>
                <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" data-bs-userId="${user.id}">
                    Delete
                </button>
            </td>
        `;
        document.getElementById('allUsersTableRow' + user.id).innerHTML = allUsersTableRowContent;
    };


    //Delete User
    document.getElementById('deleteModal').addEventListener('show.bs.modal', (event) => {
        const userId = event.relatedTarget.getAttribute('data-bs-userId');
        sendRequest('GET', '/admin/' + userId).then(user => renderDeleteModalContent(user));
    });

    const renderDeleteModalContent = (user) => {
        let content = `
            <label class="d-block mx-auto pt-1 mt-2 mb-0 text-center fs-5 fw-bold">ID</label>
            <input id="deleteUserId" 
            value="${user.id}" disabled 
            type="text" 
            class="form-control mx-auto" 
            style="width: 220px;">
            
            <label class="form-label d-block mx-auto pt-1 mt-3 mb-0 text-center fs-5 fw-bold">First name</label>
            <input value="${user.firstName}" disabled 
            type="text" 
            class="form-control mx-auto" 
            style="width: 220px;">
            
            <label class="form-label d-block mx-auto pt-1 mt-3 mb-0 text-center fs-5 fw-bold">Last name</label>
            <input value="${user.lastName}" disabled 
            type="text" 
            class="form-control mx-auto" 
            style="width: 220px;">
            
            <label class="form-label d-block mx-auto pt-1 mt-3 mb-0 text-center fs-5 fw-bold">Age</label>
            <input value="${user.age}" disabled 
            type="number" 
            class="form-control mx-auto" 
            style="width: 220px;">
            
            <label class="form-label d-block mx-auto pt-1 mt-3 mb-0 text-center fs-5 fw-bold">Email</label>
            <input value="${user.username}" disabled 
            type="text" 
            class="form-control mx-auto" 
            style="width: 220px;">
            
            <label class="form-label d-block mx-auto pt-1 mt-3 mb-0 text-center fs-5 fw-bold">Role</label>
            <select size="2" disabled 
            class="form-select mx-auto" 
            style="width: 220px;">
        `;
        user.roles.forEach(role => {
            const authority = role.name;
            content += ` <option label="${authority.replace("ROLE_", "")}"></option> `;
        });
        content += `
            </select>
        `;
        document.getElementById('deleteModalContent').innerHTML = content;
    };

    document.getElementById('deleteForm').addEventListener('submit', (event) => {
        event.preventDefault();
        sendRequest('DELETE', '/admin/' + document.getElementById('deleteUserId').value).then(id => allUsersTableRowDelete(id));
    });

    const allUsersTableRowDelete = (id) => {
        document.getElementById('allUsersTableRow' + id).remove();
    }
}

function sendRequest(method, url, body = null) {
    const options = {
        method: method,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return fetch(requestUrlPrefix + url, method === 'GET' ? null : options).then(response => {
        if (!response.ok) {
            response.status === 409 ? showAlert('This email is already in use!') : showAlert('Some Error!')
            throw new Error('Server response: ' + response.status);
        }
        return response.json();
    });
}

function backToUsersTable() {
    bootstrap.Tab.getInstance(document.querySelector('#nav-tab a[href="#nav-usersTable"]')).show();
}

function showAlert(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible role="alert" fade show';
    alert.innerHTML = `<div class="fs-5">${message}</div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
    messages.appendChild(alert);
}
