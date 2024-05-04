
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


document.addEventListener('DOMContentLoaded', function() {
    // Fetch users and generate table rows
    fetch('userMang/api/')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('table tbody');
        tableBody.innerHTML = ''; // Clear existing rows
        
        data.forEach(user => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.first_name} ${user.last_name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td class="action-icons">
                    <a href="#" class="deny" data-user-id="${user.id}">❌</a>
                </td>
            `;
        });
    });

    // Event delegation for dynamically added "deny" buttons
    document.addEventListener('click', function(event) {
        if (event.target.matches('.deny')) {
            event.preventDefault();
            const userId = event.target.getAttribute('data-user-id');
            const popupMessage = document.querySelector('.popup-message');
            // Update the popup message to include the user's ID
            popupMessage.textContent = `Are you sure you want to delete user with ID=${userId}?`;
            // Show the popup
            document.getElementById('popup').style.display = 'block';

            // Temporarily store the userId in the delete button for later use
            const deleteButton = document.querySelector('.popup-delete-button');
            deleteButton.setAttribute('data-user-id', userId);
        }
    });

    // Handling delete confirmation within the popup
    const deleteButton = document.querySelector('.popup-delete-button');
    deleteButton.addEventListener('click', function() {
        const userId = this.getAttribute('data-user-id'); // Retrieve the stored user ID
        
        fetch(`userMang/api/delete/${userId}/`, { method: 'DELETE',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        }, })
        .then(response => {
            if (response.ok) {
                // If the user was successfully deleted, remove the corresponding row
                document.querySelector(`a[data-user-id="${userId}"]`).closest('tr').remove();
                closePopup(); // Close the confirmation popup
            } else {
                console.error('Failed to delete user');
                // Optionally, display an error message to the admin
            }
        });
    });

    // Function to close the popup
    function closePopup() {
        document.getElementById('popup').style.display = 'none';
    }

    // Close the popup when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target.matches('.popup')) {
            closePopup();
        }
    });

    // Prevent the popup from closing when clicking inside it
    document.getElementById('popup').addEventListener('click', function(event) {
        event.stopPropagation();
    });
});
