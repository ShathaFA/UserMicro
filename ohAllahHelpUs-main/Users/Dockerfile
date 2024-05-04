# Use an official Python runtime as the parent image
FROM python:3.9

# Set environment variables to ensure Python outputs are sent straight to terminal (makes Docker logs more useful)
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define the command to run your app using the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
