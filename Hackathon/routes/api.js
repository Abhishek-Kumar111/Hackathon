const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyAlhT1ULPDN-UDu9OHTVZnXooUPJtKtPI4"); // Replace with your actual API key


let prompt = "";

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/chat', async (req, res) => {
    const userInput = req.body.userInput;

    
    if (!prompt) {
        prompt = `you have to act like a therapist and conduct a therapy session. Greet him and begin the conversation. Make him feel good. Keep each reply under 200 words.`;
    }

    
    prompt += `\nUser: "${userInput}"\nTherapist:`;

    try {
        // Send the prompt to the Gemini API and get a response
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Append therapist's response to maintain conversation state
        prompt += ` "${responseText}"\n`;

        // Send response back to the client
        res.json({ response: responseText });
    } catch (error) {
        console.error("Error with API:", error);
        res.status(500).json({ error: "Error generating response" });
    }
});


// Endpoint to end conversation
router.post('/end', (req, res) => {
    res.redirect("/therapist");
   });


module.exports = router;
