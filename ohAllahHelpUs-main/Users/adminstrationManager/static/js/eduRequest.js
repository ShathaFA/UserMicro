$(document).ready(function () {
    loadEducators(); // Load educators when the page is ready

    $('#searchButton').click(function () {
        const searchTerm = $('#searchInput').val();
        loadEducators(searchTerm); // Reload educators with the search term
    });
});

function loadEducators(searchTerm = '') {
    let url = 'educator/list/';
    if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
    }

    $.ajax({
        url: url,
        type: 'GET',
        success: function (data) {
            const list = $('#educatorList');
            list.empty(); // Clear current list
            $.each(data, function (i, educator) {
                list.append(`<tr>
                                <td>${educator.full_name}</td>
                                <td>${educator.request_date}</td>
                                <td>
                                    <button class="approve" data-id="${educator.id}">✅</button>
                                    <button class="deny" data-id="${educator.id}">❌</button>
                                    <button class="view" data-id="${educator.id}" onclick="viewEducatorDetails(${educator.id})">👁️</button>
                                </td>
                             </tr>`);
            });
            attachEventListeners();
        }
    });
}

function attachEventListeners() {
    $('.approve').click(function () {
        const educatorId = $(this).data('id');
        $.ajax({
            url: `educator/approve/${educatorId}/`,
            type: 'POST',
            headers: { 'X-CSRFToken': getCsrfToken() },
            success: function () {
                showMessage("Educator has been verified successfully.", "success");
                loadEducators(); // Reload the educator list
            },
            error: function (xhr, status, error) {
                console.error("Error approving educator:", status, error);
            }
        });
    });

    $('.deny').click(function () {
        const educatorId = $(this).data('id');
        $.ajax({
            url: `educator/deny/${educatorId}/`,
            type: 'POST',
            headers: { 'X-CSRFToken': getCsrfToken() },
            success: function () {
                showMessage("Educator has been unverified successfully.", "danger");
                loadEducators(); // Reload the educator list
            },
            error: function (xhr, status, error) {
                console.error("Error denying educator:", status, error);
            }
        });
    });
}

function viewEducatorDetails(educatorId) {
    $.ajax({
        url: `educator/details/${educatorId}/`,
        type: 'GET',
        success: function (data) {
            showDetailsPopup(data); // Call the new function for pop-up
        }
    });
}

// function viewEducatorDetails(educatorId) {
//     $.ajax({
//       url: `educator/details/${educatorId}/`,
//       type: 'GET',
//       success: function(data) {
//         showDetails(data);
//       }
//     });
//   }


// New function to create and display custom alert messages with positioning (for approve and deny)
function showMessage(message, type) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert', `alert-${type}`); // Add classes for styling
    alertBox.textContent = message;
    document.body.appendChild(alertBox);

    // Position the alert box in the center of the screen
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const alertWidth = alertBox.offsetWidth;
    const alertHeight = alertBox.offsetHeight;
    alertBox.style.position = 'fixed';
    alertBox.style.top = `${windowHeight / 2 - alertHeight / 2}px`;
    alertBox.style.left = `${windowWidth / 2 - alertWidth / 2}px`;

    // Optionally, add functionality to close the alert after a timeout
    setTimeout(() => {
        alertBox.remove();
    }, 2000); // Remove after 3 seconds
}

// New function to create and display custom alert messages with positioning (for view info of educator)
function showDetailsPopup(data) {
    const detailsBox = document.createElement('div');
    detailsBox.classList.add('details-popup'); // Add a class for styling
    detailsBox.innerHTML = `
      <h3>Educator Details</h3>
      <pre>${JSON.stringify(data, null, 2)}</pre>
      <button class="close-btn">X</button>`; // Add close button with "X"
    document.body.appendChild(detailsBox);
  
    // Position the pop-up box in the center of the screen
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const detailsWidth = detailsBox.offsetWidth;
    const detailsHeight = detailsBox.offsetHeight;
    detailsBox.style.position = 'fixed';
    detailsBox.style.top = `${windowHeight / 2 - detailsHeight / 2}px`;
    detailsBox.style.left = `${windowWidth / 2 - detailsWidth / 2}px`;
  
    // Add functionality to close the pop-up box on click
    const closeButton = detailsBox.querySelector('.close-btn');
    closeButton.addEventListener('click', function() {
      detailsBox.remove();
    });
  }
// function showDetails(data) {
//     const detailsBox = document.createElement('div');
//     detailsBox.classList.add('details'); 
//     detailsBox.innerHTML = `
//       <h3>Educator Details</h3>
//       <pre>${JSON.stringify(data, null, 2)}</pre>
//       <button class="close-btn">❌</button>`; 
//     document.body.appendChild(detailsBox);
  
//     const closeButton = detailsBox.querySelector('.close-btn');
//     closeButton.addEventListener('click', function() {
//       detailsBox.remove();
//     });
//   }
  
  


function getCsrfToken() {
    return $('meta[name="csrf-token"]').attr('content');
}
