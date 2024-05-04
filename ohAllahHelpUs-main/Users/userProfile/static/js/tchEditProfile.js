//ajax
document.addEventListener("DOMContentLoaded", function () {
    fetch("/userProfile/editTchrProfile/api/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Ensure this matches your authentication setup
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("first-name").value = data.first_name;
        document.getElementById("last-name").value = data.last_name;
        document.getElementById("email").value = data.email;
        document.getElementById("birthday").value = data.birthday;
        document.getElementById("company").value = data.company;
        document.getElementById("professional_title").value = data.professional_title;
        document.getElementById("linkedIn_account").value = data.linkedIn_account;
        document.getElementById("areas_of_specialization").value = data.areas_of_specialization;

        document.getElementById("user-profile-picture").src = data.profile_pic;
      })
      .catch((error) => console.error("Error fetching profile data:", error));
  });
  
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    // Listen for form submission
    document
      .querySelector("#edit-profile-form")
      .addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent the default form submission
  
        // Password confirmation check
        var password = document.getElementById("password").value;
        var confirmPassword = document.getElementById("Confirm-password").value;
  
        if (password !== confirmPassword) {
          alert("Passwords do not match.");
          return; // Stop the function here
        }
  
        var formData = new FormData(this); // 'this' refers to the form element
  
        for (var pair of formData.entries()) {
          console.log(pair[0] + ", " + pair[1]);
        }
        fetch("/userProfile/editTchrProfile/api/", {
          method: "POST",
          body: formData, // FormData is appropriate for 'multipart/form-data'
          credentials: "include", // Necessary for including session cookies
          headers: {
            "X-CSRFToken": getCookie("csrftoken"), // Include CSRF token
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json(); // Parse JSON response into JavaScript object
          })
          .then((data) => {
            console.log("Success:", data);
            alert("Profile updated successfully!");
            // Optionally, redirect or update the UI accordingly
          })
          .catch((error) => {
            console.error("Error updating profile:", error);
            // Here we handle displaying the error messages
            if (error.password) {
              // If there are password errors, join them into a single string and display
              alert("Failed to update profile: " + error.password.join("; "));
            } else {
              // For other errors, you can display a generic message or handle other specific fields similarly
              alert("Failed to update profile. Please check your inputs.");
            }
          });
      });
  
    // Event listener for changing the profile picture
    document
      .getElementById("profile-upload")
      .addEventListener("change", function (event) {
        if (event.target.files.length > 0) {
          var reader = new FileReader();
          reader.onload = function (e) {
            document.getElementById("user-profile-picture").src = e.target.result;
          };
          reader.readAsDataURL(event.target.files[0]); // Read the selected file
        }
      });
  });