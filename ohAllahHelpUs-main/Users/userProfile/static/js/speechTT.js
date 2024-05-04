const recognition = new webkitSpeechRecognition(); // Create a SpeechRecognition object

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript; // Get the recognized speech transcript
    document.getElementById('input').value = transcript; // Set the value of the input field to the transcript
};

function startListening() {
    recognition.start(); // Start listening for speech
}

function sendSpeechToServer() {
    fetch('/speech/recognition/', {  // Use the actual URL path here
        method: 'POST',
        body: JSON.stringify({ speech: document.getElementById('input').value }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Handle server response (if needed)
        console.log(data);
    })
    .catch(error => console.error('Error:', error));
}

