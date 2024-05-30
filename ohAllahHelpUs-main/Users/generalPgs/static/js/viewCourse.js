// Ensuring the DOM is fully loaded before executing the script

$(document).ready(function () {
  // Sets up global AJAX request settings, particularly for CSRF token handling

  $.ajaxSetup({
    beforeSend: function (xhr, settings) {
      // Check if the method needs CSRF protection and if it's not a cross-domain request

      if (
        !/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) &&
        !this.crossDomain
      ) {
        // Set CSRF token header for the request from hidden form field

        xhr.setRequestHeader(
          "X-CSRFToken",
          $('input[name="csrfmiddlewaretoken"]').val()
        );
      }
    },
  });


// Fetch user ID dynamically and store it globally
var currentUserId; // Global variable to hold the user ID
$(document).ready(function () {
    fetch("/userProfile/stdProfile/api/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include" // Necessary if you're handling sessions with cookies
    })
    .then(response => response.json())
    .then(data => {
        currentUserId = data.user.id; // Store the user ID globally
    })
    .catch(error => console.error('Error fetching user ID:', error));
});


  // Toggle sidebar visibility when button with class `btn` is clicked
  $(".btn").click(function () {
    $(".sidebar").toggleClass("collapsed");
  });

  // Toggle visibility of features under `.feat-btn` using event delegation
  $(document).on("click", ".feat-btn", function () {
    // Since the `.feat-show` is no longer the direct next sibling, adjust the selector
    $(this).closest("li").find(".feat-show").slideToggle();
    $(this).find(".fa-caret-down").toggleClass("rotate");
  });

  // Similar toggle functionality for `.serv-btn` elements
  $(document).on("click", ".serv-btn", function () {
    $(this).next(".serv-show").slideToggle();
    $(this).find(".fa-caret-down").toggleClass("rotate");
  });

  // Form submission handler for sections, preventing default form behavior
  $("#sectionForm").submit(function (event) {
    event.preventDefault();
    const courseId = getCourseIdFromURL();
    var sectionTitle = $("#sectionTitle").val();
    var sectionDesc = $("#sectionDesc").val();
    var postData = {
      title: sectionTitle,
      description: sectionDesc,
    };
  });

  // Function to extract course ID from the URL
  function getCourseIdFromURL() {
    var pathname = window.location.pathname;
    var segments = pathname.split("/");
    return segments[segments.length - 2]; // Adjust if necessary based on your URL structure
  }

  // Function to fetch course details and update UI dynamically
  function fetchCourseDetails() {
    const courseId = getCourseIdFromURL(); // Ensure this ID is fetched correctly
    $.ajax({
      url: `/courseInner/api/${courseId}/`,
      type: "GET",
      dataType: "json",
      success: function (course) {
        updateCourseDetails(course);
      },
      error: function (error) {
        console.error("Failed to fetch course details:", error);
      },
    });
  }


    function isUserCompletedLesson(completedStudents, currentUserId) {
      if (typeof currentUserId === "undefined") {
          console.error("currentUserId is undefined");
          return false; // or handle the error in another appropriate way
      }
      var completedStudentsArray = completedStudents.split(',');
      return completedStudentsArray.includes(currentUserId.toString());
    }



  // Function to update course details in the UI based on fetched data

  function updateCourseDetails(course) {
    $(".courseTitle").text(course.title);
    $(".Course-Title").text(course.title);
    $(".Course-topic").text(course.category);
    $(".Course-deficality").text(course.difficultyLevel);
    $(".Course-description").text(course.description);
    $(".coures-inner-img").attr(
      "src",
      course.coursePic || "/path/to/default/image.jpg"
    );

    $(".sidebar > ul").empty(); // Clear previous content

    course.sections.forEach(function (section) {
      var sectionEl = $("<li>")
        .addClass("list-sidenev")
        .data("section-id", section.id);

      // Create a container for the section title and icons
      var sectionContainer = $("<div>").addClass("section-container");

      var sectionLink = $("<a>")
        .addClass("sectionTitle a-sidenev feat-btn")
        .attr("href", "#")
        .attr("data-description", section.description) // Store the description here
        .text(section.title); // Append the text directly

      sectionLink.append($("<span>").addClass("fas fa-caret-down first")); // Caret icon

      // Append the icons and title to the section container
      sectionContainer.append(sectionLink);

      var lessonsList = $("<ul>").addClass("feat-show").css("display", "none");

      section.lessons.forEach(function (lesson) {
        var $lessonItem = $("<li>").data("lesson-id", lesson.id);
        var $lessonContainer = $("<div>").addClass("lesson-container").attr("data-lesson-id", lesson.id);  // Adding the data-lesson-id attribute


        var $lessonLink = $("<a>")
          .addClass("lessonTitle")
          .attr("href", "#")
          .data("content", lesson.contents)
          .data("lesson-id", lesson.id)
          .text(lesson.title);
          if (isUserCompletedLesson(lesson.completed_students)) {
            $lessonContainer.addClass('completed-lesson');
        }
        

          

        $lessonContainer.append($lessonLink);
        $lessonItem.append($lessonContainer);
        lessonsList.append($lessonItem);
      });

      // Append the section container and lessons list to the section element
      sectionEl.append(sectionContainer).append(lessonsList);
      $(".sidebar > ul").append(sectionEl);
    });
  }

  // Initial fetch of course details to populate UI

  fetchCourseDetails();

  // Initially hide course content and form sections
  $(".course-content").hide();
  $(".form1").hide();

  // Toggle visibility of course content on clicking the course title
  $("#courseTitle").click(function () {
    $(".course-content").slideToggle(); // Toggle visibility of course content
    $(".form1").hide(); // Ensure the editor is hidden
  });

  $(document).on("click", ".lessonTitle", function () {
    var lessonId = $(this).data("lesson-id");
    // markLessonAsCompleted(lessonId); // Call the updated function with dynamic IDs
    $('#completeLessonButton').data('lesson-id', lessonId);

    var contentsArray = $(this).data("content"); // This is an array
    var contentToDisplay = contentsArray.length > 0 && contentsArray[0].hasOwnProperty("text_content") ? contentsArray[0].text_content : "No content available";

    // Retrieve the parent section's data
    var sectionTitle = $(this).closest("ul").prev().find('.sectionTitle').text();
    var sectionDesc = $(this).closest("ul").prev().find('.sectionTitle').data('description');

    // Update the section and lesson details in the form
    $("#sectionTitle").text(sectionTitle);
    $("#editSectionDescription").text(sectionDesc);
    $("#lessonTitle").text($(this).text()); // Update lesson title from the clicked link
    $("#content-display").html(contentToDisplay); // Display the lesson content

    // Show and hide appropriate elements
    $(".course-content").hide(); // Optionally hide other course content
    $(".form1").show(); // Show the form
});


$('#completeLessonButton').click(function() {
  var lessonId = $(this).data('lesson-id');
  if (lessonId) {
      markLessonAsCompleted(lessonId);
  } else {
      alert("Please select a lesson first.");
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('completeLessonButton');
  if (button) {
      button.addEventListener('click', function() {
          var lessonId = $(this).data("lesson-id"); // Ensure this data attribute is present on the button
          markLessonAsCompleted(lessonId);
      });
  }
});



function markLessonAsCompleted(lessonId) {
  fetch(`http://127.0.0.1:8001/api/lessons/${lessonId}/complete`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: currentUserId }) // assuming `currentUserId` is globally available
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          alert('Lesson marked as completed!');
          $(`div[data-lesson-id="${lessonId}"]`).addClass('completed-lesson');

      } else {
          alert('Only Students can use this feature');
      }
  })
  .catch(error => console.error('Error:', error));
}





});
