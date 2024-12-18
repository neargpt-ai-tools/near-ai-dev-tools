const express = require('express');
const axios = require('axios');
require('dotenv').config(); 

const app = express();
app.use(express.json());

const cors = require('cors'); 
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true 
}));

app.post('/api/openai/generate-code', async (req, res) => {
    const { prompt, lang } = req.body;

    // Format the prompt based on language preference
    const formattedPrompt = `Generate a ${lang === 'ts' ? 'TypeScript' : 'Rust'} smart contract for the following: ${prompt}`;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o', // Updated model
            messages: [{ role: 'system', content: formattedPrompt }],
            max_tokens: 1500,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        res.json({ aiResponse: response.data.choices[0].message.content }); // Updated response access
    } catch (error) {
        console.error("Error communicating with OpenAI:", error);
        res.status(500).json({ error: 'Failed to retrieve response from OpenAI' });
    }
});


app.listen(8080, () => console.log('Server running on port 8080'));
