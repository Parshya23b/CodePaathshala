const axios = require('axios');
require('dotenv').config();

exports.askQuestion = async (req, res) => {
  try {
    const { userId, question } = req.body;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
        max_tokens: 500
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiReply = response.data.choices[0].message.content;

    res.status(200).json({
      userId,
      question,
      answer: aiReply
    });
  } catch (err) {
    res.status(500).json({ message: 'AI response failed', error: err.message });
  }
};
