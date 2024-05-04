$(document).ready(function() {
    loadEducators(); // Load educators when the page is ready

    $('#searchButton').click(function() {
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
        success: function(data) {
            const list = $('#educatorList');
            list.empty(); // Clear current list
            $.each(data, function(i, educator) {
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
    $('.approve').click(function() {
        const educatorId = $(this).data('id');
        $.ajax({
            url: `educator/approve/${educatorId}/`,
            type: 'POST',
            headers: {'X-CSRFToken': getCsrfToken()},
            success: function() {
                alert("Educator has been verified successfully.");

                loadEducators(); // Reload the educator list
            },
            error: function(xhr, status, error) {
                console.error("Error approving educator:", status, error);
            }
        });
    });

    $('.deny').click(function() {
        const educatorId = $(this).data('id');
        $.ajax({
            url: `educator/deny/${educatorId}/`,
            type: 'POST',
            headers: {'X-CSRFToken': getCsrfToken()},
            success: function() {
                alert("Educator has been unverified successfully.");

                loadEducators(); // Reload the educator list
            },
            error: function(xhr, status, error) {
                console.error("Error denying educator:", status, error);
            }
        });
    });
}

function viewEducatorDetails(educatorId) {
    $.ajax({
        url: `educator/details/${educatorId}/`,
        type: 'GET',
        success: function(data) {
            // Implement how you want to display the educator details
            alert(JSON.stringify(data));
        }
    });
}

function getCsrfToken() {
    return $('meta[name="csrf-token"]').attr('content');
}
