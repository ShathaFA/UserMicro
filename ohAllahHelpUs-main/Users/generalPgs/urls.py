from django.urls import path
from .views import *


urlpatterns = [

    path('all-courses/api/', CourseListView.as_view(), name='all-courses'),
    path('all-courses/', listCourses, name='listCourses'),
    
    path('courseInfo/api/<int:course_id>/', CourseDetailView.as_view(), name='course-info'),
    path('courseInfo/<int:course_id>/', CourseDetailPageView.as_view(), name='courseInfo'),

    path('courseInner/<int:course_id>/', CourseDetailsView.as_view(), name='innerCourse'),
    path('courseInner/api/<int:course_id>/', CourseContentDetailView.as_view(), name='course-details'),

    path('addSection/api/<int:course_id>/', SectionCreateView.as_view(), name='section-create'),
    path('addLesson/api/<int:section_id>/', LessonCreateProxyView.as_view(), name='proxy-lesson-create'),

    path('deleteSection/api/<int:section_id>/', DeleteSectionView.as_view(), name='delete_section'),
    path('deleteLesson/api/<int:lesson_id>/', DeleteLessonView.as_view(), name='delete_lesson'),

    path('editLesson/api/<int:lesson_id>/', UpdateLessonProxyView.as_view(), name='proxy-update-lesson'),
    path('editSection/api/<int:pk>/', SectionUpdateProxyView.as_view(), name='proxy-update-section'),
    path('editContent/api/', ContentProxyView.as_view(), name='proxy-content-create'),
    path('editContent/api/<int:id>/', ContentProxyView.as_view(), name='proxy-content-update'),


    path('createCourse/api/', CreateCourseProxyView.as_view(), name='create-course-proxy'),
    path('deleteCourse/api/<int:pk>/', CourseDeleteProxyView.as_view(), name='proxy-course-delete'),
    path('toggleCoursePublish/api/<int:pk>/', TogglePublishCourseProxyView.as_view(), name='toggle-course-publish'),


    path('editQuiz',editQuiz, name = 'editQuiz'),
    path('viewQuiz',viewQuiz, name = 'viewQuiz'),
    path('viewCourse/',viewCourse, name = 'viewCourse'),
    path('viewCourse/<int:course_id>/',CoursePageView.as_view(), name = 'CoursePageView'),
    path('my-enrolled-courses/', EnrolledCoursesProxyView.as_view(), name='enrolled_courses_proxy'),
    path('unenroll/<int:student>/<int:course_id>/', UnenrollProxyView.as_view(), name='proxy_unenroll'),
    path('error/', error_view, name='error'),

]   

