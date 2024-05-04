document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('generateCourseForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission

        const courseTitle = document.getElementById('gcourseTitle').value;
        const courseCategory = document.getElementById('gcourseCategory').value;
        const difficultyLevel = document.getElementById('gdifficultyLevel').value;
        document.getElementById('loadingIndicator').style.display = 'block';

        // Construct the data object to send
        const formData = {
            title: courseTitle,
            category: courseCategory,
            difficultyLevel: difficultyLevel
        };

        // Send the data using fetch API
        fetch('http://127.0.0.1:8001/generate-course-content/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include CSRF token if needed, shown here for Django's standard need
                'X-CSRFToken': getCookie('csrftoken') // Assuming you have a function to get cookies
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            // Hide the loading indicator
            document.getElementById('loadingIndicator').style.display = 'none';
            // Handle response here
            if (data.number_of_sections > 0) {
                alert("Your course was fully generated, please check your archive");
                form.reset();
                document.getElementById("createCourseModal").style.display = "none";
            } else {
                alert("Your course was generated with the basic info");
                form.reset();
                document.getElementById("createCourseModal").style.display = "none";
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle errors here, e.g., display an error message
        });
    });
});

// Helper function to get cookie by name; essential for CSRF token handling in Django
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
