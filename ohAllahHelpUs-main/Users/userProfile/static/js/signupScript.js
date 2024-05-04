  function displayFileName() {
    var input = document.getElementById("inputfile");
    var fileName = input.files[0].name;
    document.getElementById("file-name").textContent = fileName;
  }

  // Modify this JavaScript to handle opening and closing the pop-up
  function openPopup() {
    // Validation code to ensure all necessary fields are filled out can be added here
    document.getElementById("popup").style.display = "flex";
  }

  function closePopup() {
    document.getElementById("popup").style.display = "none";
    
  }



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


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission

        const formData = new FormData(); // Use FormData to handle file uploads
        formData.append('first_name', document.getElementById('first_name').value);
        formData.append('last_name', document.getElementById('last_name').value);
        formData.append('birthday', document.getElementById('birthday').value);
        formData.append('role', document.getElementById('roleSelect').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('password1', document.getElementById('password1').value);
        formData.append('password2', document.getElementById('password2').value);
        // Append file to formData
        const fileInput = document.getElementById('inputfile');
        if (fileInput.files[0]) {
          formData.append('profile_pic', fileInput.files[0]);
      }

        // If the role is 'educator', add specific fields to formData
        if (document.getElementById('roleSelect').value === 'teacher') {
            formData.append('company', document.getElementById('company').value);
            formData.append('professional_title', document.getElementById('professionalTitle').value);
            formData.append('linkedIn_account', document.getElementById('linkedInAcc').value);
            formData.append('areas_of_specialization', document.getElementById('areasOfSpec').value);
        }

        fetch('api', {  // Update this URL to your API's endpoint
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: formData, // Send formData with file
        })
        .then(response => response.json().then(data => ({status: response.status, body: data})))
        .then(obj => {
            if (obj.status !== 201) {
                const errors = obj.body;
                let errorMessages = "";
                for (const [field, messages] of Object.entries(errors)) {
                    errorMessages += `${field}: ${messages.join()}\n`;
                }
                alert(errorMessages); // For simplicity, displaying errors as an alert; consider updating the DOM instead.
            
            } else {
                openPopup(); // This line calls the function to display the popup
            }
        })
        .catch(error => console.error('Error:', error));
    });
});

document.addEventListener('DOMContentLoaded', function () {
  var roleSelect = document.getElementById('role');
  var educatorFields = document.getElementById('educatorFields');
  var fields = educatorFields.querySelectorAll('input, select, textarea'); // Get all input, select, and textarea elements

    // Function to update fields requirement based on role
    function updateFieldsRequirement(require) {
      fields.forEach(field => {
        field.required = require;
      });
    }

  roleSelect.addEventListener('change', function() {
    if (roleSelect.value === 'teacher') {
      // Adjust the max-height to the content's natural height
      educatorFields.style.maxHeight = '500px'; // Adjust this value based on the actual content size
      educatorFields.style.opacity = '1';
      updateFieldsRequirement(true); // Make fields required

    } else {
      educatorFields.style.maxHeight = '0';
      educatorFields.style.opacity = '0';
      updateFieldsRequirement(false); // Make fields not required

    }
  });
});


