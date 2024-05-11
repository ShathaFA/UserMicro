document.addEventListener("DOMContentLoaded", function () {
  fetch("/userProfile/tchrProfile/api/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      window.educatorFullName = data.educator.full_name; // Assigning to global variable

      console.log("Received JSON:", data); // Log the entire JSON to the console
      console.log("Courses data:", data.courses); // Specifically log the courses array
      // if (data.total_enrolled_students !== undefined) {
      //   const totalCoursesSpan = document.getElementById("total-courses");
      //   console.log(data.total_enrolled_students)
      //   animateNumber(totalCoursesSpan, data.total_enrolled_students);
      // } else {
      //   console.error("Total enrolled students data is missing");
      // }
      
      if (!data.educator || !data.courses) {
        console.error(
          "Missing 'educator' or 'courses' key in the response:",
          data
        );
      } else {
        const educator = data.educator;
        const courses = data.courses;
        document.querySelector(".name-profile").textContent =
          educator.full_name;
        document.querySelector(".ID-profile").textContent =
          "ID: " + educator.id;
        document.querySelector(".ProfeTitle-profile").textContent =
          educator.professional_title;
        document.querySelector(".company-profile").textContent =
          "Work at: " + educator.company;
        document.querySelector(".areaOfSpec").textContent =
          "Areas of specialization: " + educator.areas_of_specialization;
        document.querySelector(".pro-links a").textContent =
          educator.linkedIn_account;
        // Update the src for the profile picture
        let profilePicUrl = educator.user.profile_pic;
        // Ensure the profile picture URL is correct, prepend '/media/' if necessary
        if (!profilePicUrl.startsWith("http")) {
          profilePicUrl = profilePicUrl; // Assuming '/media/' is already included in the path
        }
        document.getElementById("user-profile-picture").src = profilePicUrl;
        // Render courses
        renderCourses(
          courses.filter((course) => course.isPublished),
          "MyPublishedCourses"
        );
        renderCourses(
          courses.filter((course) => !course.isPublished),
          "MyArchive"
        );
      }
    })
    .catch((error) => console.error("Error:", error));
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("createCourseForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission

    const formData = new FormData(form);
    formData.append(
      "category",
      document.getElementById("courseCategory").value
    );
    formData.append("title", document.getElementById("courseTitle").value);
    formData.append(
      "description",
      document.getElementById("courseDescription").value
    );
    formData.append(
      "difficultyLevel",
      document.getElementById("difficultyLevel").value
    );
    formData.append("duration", document.getElementById("duration").value);
    const fileInput = document.getElementById("courseImage");
    if (fileInput.files.length > 0) {
      formData.append("coursePic", fileInput.files[0]);
    } else {
      console.log("No file selected");
    }
    if (!formData.has('coursePic')) { 
      console.log("I will put a picture :)");
      // Check if the coursePic is actually included
      formData.append('coursePic', 'profile_pics/defaultCourse.jpg');  // This line is just illustrative; typically, you would not do this on client side
    }
    fetch("/createCourse/api/", {
      method: "POST",
      body: formData, // No headers for CSRFToken needed when sending FormData via fetch unless specifically configured to do so
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        alert("Course created successfully!");
        form.reset();
        document.getElementById("createCourseModal").style.display = "none";
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error creating course: " + error.message);
      });
  });
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

function renderCourses(courses, sectionId) {
  let section; // Declare the variable to hold the correct section

  // Use an if statement to explicitly set the section based on sectionId
  if (sectionId === "MyPublishedCourses") {
    section = document
      .getElementById("MyPublishedCourses")
      .getElementsByClassName("course-section")[0];
  } else if (sectionId === "MyArchive") {
    section = document
      .getElementById("MyArchive")
      .getElementsByClassName("course-section")[0];
  }

  if (section) {
    section.innerHTML = ""; // Clear the section before appending new content

    courses.forEach((course) => {
      const courseElement = document.createElement("div");
      courseElement.className = "course-info";
      courseElement.setAttribute('onclick', `toggleMenu(document.getElementById('menu-content-${course.id}'))`);
      // Hamburger Menu Creation
      
      const menu = document.createElement("div");
      menu.className = "hamburger-menu";
      const menuIcon = document.createElement("div");
      menuIcon.className = "menu-icon";
      menuIcon.textContent = "☰"; // Menu icon
      menuIcon.onclick = function (event) {
        event.stopPropagation();

        toggleMenu(this.nextElementSibling);
      }; // Toggle next sibling element which is the menu-content
      const menuContent = document.createElement("div");
      menuContent.className = "menu-content";
      menuContent.id = `menu-content-${course.id}`; // Unique ID for each course's menu
      menuContent.style.display = "none"; // Initially hidden
      const ul = document.createElement("ul");
      ["View", "Edit", "Archive/Publish", "Delete"].forEach((action) => {
        const li = document.createElement("li");
        li.textContent = action;
        li.onclick = function (event) {
          event.stopPropagation();  // Stop click from bubbling further to prevent unwanted navigation
          handleCourseAction(action, course.id);
        };
        ul.appendChild(li);
      });
      menuContent.appendChild(ul);
      menu.appendChild(menuIcon);
      menu.appendChild(menuContent);

      const courseImage = document.createElement("img");
      courseImage.className = "course-image";
      courseImage.src =
        course.coursePic || `${STATIC_URL}images/defaultCourse.jpg`;
      courseImage.alt = course.title;

      const courseTitle = document.createElement("div");
      courseTitle.className = "course-title";
      courseTitle.textContent = course.title;

      const courseDetails = document.createElement("div");
      courseDetails.className = "course-details";

      const category = document.createElement("div");
      category.className = "category-type";
      category.textContent = course.category;

      const hours = document.createElement("div");
      hours.className = "hours";
      hours.innerHTML = `<span class="emoji">&#9200;</span> ${course.duration}`;

      const students = document.createElement("div");
      students.className = "students";
      students.innerHTML = `<span class="emoji">&#128100;</span> ${course.enrolled_students || '0'}`;


      const instructor = document.createElement("div");
      instructor.className = "instructor";
      instructor.innerHTML = `<span class="emoji">&#128188;</span> ${window.educatorFullName}`;

      const reviews = document.createElement("div");
      reviews.className = "reviews";
      reviews.innerHTML = `${renderStars(course.rating)} <p>${
        course.reviews || "0"
      }</p>`;

      // Append all details to courseDetails
      courseDetails.append(category, hours, students, instructor, reviews);

      // Append all components to the main course element
      courseElement.append(menu, courseImage, courseTitle, courseDetails);

      // Append the course element to the section
      section.appendChild(courseElement);
    });
  } else {
    console.error(
      "Could not find the course section for sectionId:",
      sectionId
    );
  }
}

function renderStars(rating) {
  const roundedRating = Math.round(rating);
  let stars = "";
  for (let i = 0; i < 5; i++) {
    stars += i < roundedRating ? "⭐" : "☆";
  }
  return stars;
}

function toggleMenu(menuContent) {
  menuContent.style.display =
    menuContent.style.display === "block" ? "none" : "block";
}

// Example function to handle course actions
function handleCourseAction(action, courseId) {
  switch (action) {
    case "View":
      window.location.href = `/viewCourse/${courseId}/`;
      break;
    case "Edit":
      // Navigate to the inner course page when "Edit" is clicked
      window.location.href = `/courseInner/${courseId}/`;
      break;
    case "Archive/Publish":
      toggleCoursePublish(courseId);
      break;
    case "Delete":
      showConfirmPopup(courseId);
      break;
    // Handle other actions like 'View', 'Edit', 'Archive' as needed
    default:
      console.log("Action not implemented:", action);
  }
}

// script for moving through the sections on the same page---------------------
document.addEventListener("DOMContentLoaded", function () {
  const menuLinks = document.querySelectorAll(".menu a");

  menuLinks.forEach(function (menuLink) {
    menuLink.addEventListener("click", function (event) {
      const targetId = menuLink.getAttribute("href").substring(1); // Remove the leading '#' from the href
      const targetSection = document.getElementById(targetId);

      // Hide all sections
      const sections = document.querySelectorAll(".section");
      sections.forEach(function (section) {
        section.style.display = "none";
        section.querySelector(".course-section").style.display = "none"; // Also ensure internal course-sections are hidden
      });

      // Show only the targeted section and its course-section if applicable
      targetSection.style.display = "block";
      const courseSection = targetSection.querySelector(".course-section");
      if (courseSection) {
        courseSection.style.display = "flex"; // Show the course-section within the active section
      }

      // Remove active class from all links and add to the current link
      menuLinks.forEach(function (link) {
        link.classList.remove("active");
      });
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

  const totalCourses = 105; /*  total courses value */

  animateNumber(totalCoursesSpan, totalCourses);
});

function animateNumber(element, finalValue) {
  let currentValue = 0;
  const increment = finalValue > 0 ? Math.ceil(finalValue / 100) : 0;  // Avoid division by zero
  const interval = setInterval(() => {
    currentValue += increment;
    element.textContent = currentValue;
    if (currentValue >= finalValue) {
      clearInterval(interval);
      element.textContent = finalValue; // Ensure it ends exactly at finalValue
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

// script for pop-up create new course---------------------------------------
// Get the button that opens the modal
var createCourseBtn = document.getElementById("createCourseBtn");

// Get the modal element
var createCourseModal = document.getElementById("createCourseModal");
var generateCourseModal = document.getElementById("generateCourseModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
createCourseBtn.onclick = function () {
  createCourseModal.style.display = "block";
};


// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  createCourseModal.style.display = "none";
};



// When the user clicks outside of the modal, close it
window.onclick = function (event) {
  if (event.target == createCourseModal) {
    createCourseModal.style.display = "none";
  }
};





// Display the confirmation popup
function showConfirmPopup(courseId) {
  const popup = document.getElementById("confirm-popup");
  popup.style.display = "block";
  // Set a data attribute on the popup with the course ID
  popup.setAttribute("data-course-id", courseId);
}


function closePopup() {
  const popup = document.getElementById("confirm-popup");
  popup.style.display = "none";
}

function removeCourseElement(courseId) {
  const courseElement = document.querySelector(
    `div[data-course-id='${courseId}']`
  );
  if (courseElement) {
    courseElement.parentNode.removeChild(courseElement);
  }
}

function toggleCoursePublish(courseId) {
  fetch(`/toggleCoursePublish/api/${courseId}/`, {
    method: "PATCH",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Toggle publish response:", data);
      alert(`Course is now "${data.isPublished ? "published" : "archived"}".`);
      window.location.reload(); // Reload to reflect changes
    })
    .catch((error) => {
      console.error("Error toggling publish:", error);
      alert("Failed to toggle publish status.");
    });
}

// Handle course deletion
function deleteCourse() {
  const popup = document.getElementById("confirm-popup");
  const courseId = popup.getAttribute("data-course-id");
  if (courseId) {
    fetch(`/deleteCourse/api/${courseId}/`, {
      method: "DELETE",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"), // Ensure CSRF token is sent
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Course deleted successfully!");
          // Optionally, remove the course element from the DOM
          removeCourseElement(courseId);
          window.location.reload(); //
        } else {
          alert("Failed to delete the course.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while deleting the course.");
      });
  }
  closePopup(); // Close the popup irrespective of the result
}

var generateCourseModal = document.getElementById("generateCourseModal");
var generateCourseBtn = document.getElementById("generateCourseBtn");

generateCourseBtn.onclick = function () {
  generateCourseModal.style.display = "block";
};

// script for pop-up generate new course---------------------------------------
// Get the button that opens the modal
// var generateCourseModal = document.getElementById("generateCourseModal");
// var generateCourseBtn = document.getElementById("generateCourseBtn");

// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// // When the user clicks the button, open the modal
// generateCourseBtn.onclick = function () {
//   generateCourseModal.style.display = "block";
// };


// // When the user clicks on <span> (x), close the modal
// span.onclick = function () {
//   generateCourseModal.style.display = "none";
// };

// // When the user clicks outside of the modal, close it
// window.onclick = function (event) {
//   if (event.target == generateCourseModal) {
//     generateCourseModal.style.display = "none";
//   }
// };