
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

// script for moving through the sections on the same page---------------------
document.addEventListener("DOMContentLoaded", function () {
  const menuLinks = document.querySelectorAll(".menu a");
  const courseSection = document.querySelector(".course-section");

  menuLinks.forEach(function (menuLink) {
    menuLink.addEventListener("click", function (event) {
      const targetId = menuLink.getAttribute("href").substring(1); // Remove the leading '#' from the href
      const targetSection = document.getElementById(targetId);

      // Hide all sections
      const sections = document.querySelectorAll(".section");
      sections.forEach(function (section) {
        section.style.display = "none";
      });

      // Hide the old course-section
      courseSection.style.display = "none";

      // Show only the targeted section
      targetSection.style.display = "block";

      // Remove active class from all links
      menuLinks.forEach(function (link) {
        link.classList.remove("active");
      });

      // Add active class to the clicked link
      menuLink.classList.add("active");

      event.preventDefault(); // Prevent the default behavior of the link
    });
  });
});

// script for the category---------------------------------------
function toggleDropdown() {
  document.getElementById("categoryDropdown").classList.toggle("show");
}

function searchCategory() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("categorySearchInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("categoryDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

// script for making the numbers of analysis increase----------------------------
window.addEventListener("DOMContentLoaded", () => {
  const totalCoursesSpan = document.getElementById("total-courses");
  const coursesPerMonthSpan = document.getElementById("courses-per-month");
  const completedPercentageSpan = document.getElementById(
    "completed-percentage"
  );

  const totalCourses = 105; /*  total courses value */
  const coursesPerMonth = 15; /*  courses per month value */
  const completedPercentage = 76; /*  completed percentage value */

  animateNumber(totalCoursesSpan, totalCourses);
  animateNumber(coursesPerMonthSpan, coursesPerMonth);
  animatePercentage(completedPercentageSpan, completedPercentage);
});

function animateNumber(element, finalValue) {
  let currentValue = 0;
  const increment = Math.ceil(finalValue / 100); // Divide final value by 100 for smooth animation
  const interval = setInterval(() => {
    currentValue += increment;
    element.textContent = currentValue;
    if (currentValue >= finalValue) {
      clearInterval(interval);
    }
  }, 20); // Adjust the interval for desired animation speed
}

function animatePercentage(element, finalValue) {
  let currentValue = 0;
  const increment = Math.ceil(finalValue / 100); // Divide final value by 100 for smooth animation
  const interval = setInterval(() => {
    currentValue += increment;
    element.textContent = currentValue + "%";
    if (currentValue >= finalValue) {
      clearInterval(interval);
    }
  }, 20); // Adjust the interval for desired animation speed
}

//AJAX
document.addEventListener("DOMContentLoaded", function () {
  fetch("/userProfile/stdProfile/api/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Include CSRF Token header as needed, especially if you're making POST requests
    },
    credentials: "include", // For cookies, if session-based authentication is used
  })
    .then((response) => response.json())
    .then((data) => {
      window.studentId = data.user.id;
      document.querySelector(".name-profile").textContent = data.full_name;
      document.querySelector(".ID-profile").textContent = "ID: " + data.user.id; // Adjust if you have a specific student ID field
      document.querySelector(".areasOfInterest").textContent =
        data.areas_of_interest;

      // Update the src for the profile picture
      let profilePicUrl = data.user.profile_pic;
      // Ensure the profile picture URL is correct, prepend '/media/' if necessary
      if (!profilePicUrl.startsWith("http")) {
        profilePicUrl = profilePicUrl; // Assuming '/media/' is already included in the path
      }
      document.getElementById("user-profile-picture").src = profilePicUrl;
    })

    .catch((error) => console.error("Error:", error));
});

$(document).ready(function () {
  // Fetch enrolled courses when the page loads
  $.ajax({
    url: "/my-enrolled-courses/", // Update this URL to the endpoint that returns the JSON data
    type: "GET",
    success: function (response) {
      // Assuming 'response' is an array of courses
      $("#myCourses .course-section").empty(); // Clear existing courses
      response.forEach(function(course) {
        // Assume course.student_id is available in the response, or use a global studentId
        var courseHTML = `
          <div class="course-info">
              <div class="hamburger-menu">
                  <div class="menu-icon" onclick="toggleMenu(document.getElementById('menu-content-${course.id}'))">☰</div>
                  <div class="menu-content" id="menu-content-${course.id}" style="display: none;">
                      <ul>
                          ${["View", "Add to Favorite", "Unenroll"].map(action => `
                              <li onclick="event.stopPropagation(); handleCourseAction('${action}', ${course.id});">${action}</li>
                          `).join('')}
                      </ul>
                  </div>
              </div>
              <img class="course-image" src="${course.coursePic || `${STATIC_URL}images/default-course-image.jpg`}" alt="${course.title}">
              <div class="course-title">${course.title}</div>
              <div class="course-details">
                  <div class="category-type">${course.category}</div>
                  <div class="hours"><span class="emoji">&#9200;</span> ${course.duration} hours</div>
                  <div class="students"><span class="emoji">&#128100;</span> ${course.students || "N/A"}</div>
                  <div class="lessons"><span class="emoji">&#128214;</span> ${course.lessons || "N/A"}</div>
                  <div class="instructor"><span class="emoji">&#128188;</span> ${course.instructor}</div>
                  <div class="reviews">${'⭐'.repeat(course.rating)}<p>${course.reviews || "0"}</p></div>
              </div>
          </div>
        `;
        $("#myCourses .course-section").append(courseHTML);
      });
    },
    error: function (error) {
      console.log("Error loading courses:", error);
    },
  });
});
function toggleMenu(menuContent) {
  menuContent.style.display =
    menuContent.style.display === "block" ? "none" : "block";
}

function handleCourseAction(action, courseId) {
  switch (action) {
    case "View":
      window.location.href = `/viewCourse/${courseId}/`;
      break;
    case "Unenroll":
      unenroll(studentId, courseId); // You need to ensure studentId is correctly defined
      break;
    // Handle other actions like 'View', 'Edit', 'Archive' as needed
    default:
      console.log("Action not implemented:", action);
  }
}

function unenroll(studentId, courseId) {
  const csrftoken = getCookie('csrftoken');  // Ensure you're still fetching the CSRF token correctly

  fetch(`/unenroll/${studentId}/${courseId}/`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken
      },
      credentials: 'include'
  }).then(response => {
      if (response.ok) {
          if (response.status === 204) {  // Check if the status code is 204 No Content
              alert('Unenrolled successfully!');
              location.reload();  // Reload the page or update the UI as necessary
          } else {
              return response.json();  // Only parse as JSON if the response is not 204
          }
      } else {
          return response.json().then(data => {
              throw new Error('Failed to unenroll: ' + data.error);  // Handle errors within the JSON body
          });
      }
  }).catch(error => {
      console.error('Error:', error);
      alert(error.message);  // Display a more generic message or directly display the error message
  });
}

