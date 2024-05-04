let userID;  // Declare a variable to store the user ID
let today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'



document.addEventListener("DOMContentLoaded", function () {
  fetch("/userProfile/stdProfile/api/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",  // Ensure cookies are sent if using session authentication
  })
  .then((response) => response.json())
  .then((data) => {
    userID = data.user.id;  // Store the user ID in the variable
  })
  .catch(error => console.error('Error fetching user data:', error));
});


$(document).ready(function() {
  $('#enrollButton').click(function() {
      const courseId = $(this).data('course-id');

      if (!userID) {
          alert('User ID not loaded yet, please try again.');
          return;
      }

      $.ajax({
          url: 'http://127.0.0.1:8001/api/enroll/', // Your courses microservice API endpoint
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
              'course': courseId,
              'student': userID,
              'enrollment_date': today

          }),
          success: function(response) {
              alert('Enrollment successful!');
          },
          error: function(xhr, status, error) {
              alert('Failed to enroll: ' + xhr.responseText);
          }
      });
  });
});



function getCourseIdFromURL() {
  const pathname = window.location.pathname;
  const segments = pathname.split('/');
  return segments[segments.length - 2]; // This assumes the URL is like /courseInfo/123/ and gets '123'
}

const courseId = getCourseIdFromURL();  // Get the current course ID from the URL
const apiUrl = `/courseInfo/api/${courseId}/`;  // Use this to make an API request

fetch(apiUrl)
  .then(response => response.json())
  .then(course => {

    updateCourseDetails(course);
    // Update course title
    document.querySelector('.courseinfo-CourseTitle').textContent = course.title;

    // Update instructor, you'll need to adjust this based on how your instructor data is structured
    // For this example, it's assumed to be just an ID or name
    document.querySelector('.courseinfo-infoSection .info div').textContent = `Course Instructor: ${course.instructor}`;

    // Update course description
    document.querySelector('.courseAbout').textContent = course.description;

    // Assuming 'category' is a simple field, but you might need to adjust this
    // If categories are an array or a more complex structure, you'll need a loop to display them
    document.querySelector('.courseInfo-About .Category').textContent = course.category;

    document.getElementById('courseID').textContent = course.id;
    document.getElementById('difficultyLevel').textContent = course.difficultyLevel;
    document.getElementById('duration').textContent = course.duration;

    // Update more fields as necessary...

    // Update sections
    if (course.sections && course.sections.length > 0) {
        const sectionsContainer = document.getElementById('sectionsContainer');
        // Clear existing content
        sectionsContainer.innerHTML = '';
      
        course.sections.forEach(section => {
          // Create a new div for the section
          const sectionDiv = document.createElement('div');
          sectionDiv.classList.add('Sections-box'); // Assuming you have CSS styles for this class
      
          // Set the title and description
          const title = document.createElement('h3');
          title.textContent = section.title;
          title.id = 'Sections-title'; // IDs should be unique, consider not setting or using a class instead
      
          const description = document.createElement('p');
          description.textContent = section.description;
          description.id = 'Sections-description'; // Same note on uniqueness as above
      
          // Append title and description to the section div
          sectionDiv.appendChild(title);
          sectionDiv.appendChild(description);
      
          // Append the section div to the container
          sectionsContainer.appendChild(sectionDiv);
        });
      } else {
        // Handle case where there are no sections or course.sections is undefined
        document.getElementById('sectionsContainer').innerHTML = '<p>No sections available.</p>';
      }

  })
  .catch(error => console.error('Error fetching course data:', error));


  function updateCourseDetails(course) {
    // Other updates here (title, description, etc.)
    
    // Update the course image
    if(course.coursePic) {
        document.querySelector('.courseInfoRight img').src = course.coursePic;
    } else {
        // Handle cases where the coursePic might be null or undefined
        document.querySelector('.courseInfoRight img').src = '{% static "images/default.png" %}'; // A default image in case there's no coursePic
    }
}