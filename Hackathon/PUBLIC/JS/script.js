
document.getElementById('send-button').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
    if (userInput) {
        // Append user input to chat box
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML += `<p>You: ${userInput}</p>`;
        
        // Clear input
        document.getElementById('user-input').value = '';

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userInput }),
            });

            const data = await response.json();
            if (data.response) {
                // Append therapist response to chat box
                chatBox.innerHTML += `<p>Therapist: ${data.response}</p>`;
            }
        } catch (error) {
            console.error("Error fetching response:", error);
        }
    }
});
