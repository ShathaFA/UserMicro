$(document).ready(function() {
    function fetchCourses() {
        $.ajax({
            url: '/all-courses/api/', // Adjust to match your actual API endpoint
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                updateCourseSection(data);
            },
            error: function(error) {
                console.error('Error fetching courses:', error);
            }
        });
    }

    function fetchInstructorName(instructorId, callback) {
        $.ajax({
            url: `/adminstrationManager/educator/list/`, // This needs to change if you have an endpoint for specific instructors
            type: 'GET',
            dataType: 'json',
            success: function(educators) {
                const educator = educators.find(ed => ed.id === instructorId);
                if (educator) {
                    callback(educator.full_name);
                } else {
                    callback('Instructor not found');
                }
            },
            error: function() {
                callback('Failed to fetch instructor');
            }
        });
    }

    function updateCourseSection(courses) {
        let courseSection = $('#course-section');
        courseSection.empty(); // Clear existing content

        courses.forEach(function(course) {
            fetchInstructorName(course.instructor, function(instructorName) {

            let courseHTML = `
            <div class="course-info" data-course-id="${course.id}">
                <img class="course-image" src="${course.coursePic}" alt="${course.title}" />
                <div class="course-title">${course.title}</div>
                <div class="course-details">
                    <div class="category">${course.category}</div>
                    <div class="hours"><span class="emoji">&#9200;</span> ${course.duration}</div>
                    <div class="students"><span class="emoji">&#128100;</span> ${course.enrolled_students || '0'}</div>
                    <div class="instructor"><span class="emoji">&#128188;</span> ${instructorName}</div>
                    <div class="reviews">⭐⭐⭐⭐⭐</div>
                </div>
            </div>`;
            courseSection.append(courseHTML);
        });
    });


        if(courses.length === 0) {
            courseSection.html('<p>No courses available at this time.</p>');
        }
    }

    fetchCourses();

$('#course-section').on('click', '.course-info', function() {
    const courseId = $(this).data('course-id');
    console.log("Clicked Course ID:", courseId);  // Check if the course ID is fetched correctly
    window.location.href = `/courseInfo/${courseId}/`;  // Ensure your Django URL pattern matches this
});
});
