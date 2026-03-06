// server.js (clean version)

// ===== Imports (CommonJS) =====
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();
const OpenAI = require('openai');
// .env se variables read karega

// OpenAI official client (CommonJS style)

// ===== App setup =====
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Static files (public folder me tumhara index.html, img, css, js, etc.)

app.use(express.static(__dirname));   // ya 'My_Portfolio' root ko hi serve karo


// ===== Nodemailer Contact API =====
app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Nodemailer setup
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,      // <- .env se
      pass: process.env.MAIL_PASS,      // <- .env se (app password use karo)
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.MAIL_TO || process.env.MAIL_USER, // jisme mail receive karna hai
    subject: subject || 'New Contact Form Submission',
    text: `
You have a new contact form submission:

Name: ${firstName} ${lastName}
Email: ${email}
Subject: ${subject || 'No Subject'}
Message: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// ===== OpenAI client =====
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// ===== Sahil Bot system prompt =====
const SAHIL_PROFILE = `
You are "Sahil Bot", an AI assistant on Sahil Shaikh's portfolio website.

About Sahil:
- DevOps & Cloud enthusiast, works with AWS, CI/CD pipelines, Docker, Linux and monitoring.
- Projects: AWS Infrastructure Deployment, CI/CD Pipeline Automation, Student Project Tracking System,
  Evil Twin Wi-Fi Attack Lab, Monitoring & Dashboards, Cloud Cost & Security Review.
- Shares work on GitHub and LinkedIn.

If user asks for GitHub or LinkedIn, share:
GitHub: https://github.com/sahilshaikh867
LinkedIn: www.linkedin.com/in/sahil-shaikh-781b94255

Your role: Answer questions about Sahil's skills, projects, contact info, resume, and how he works.
Be friendly and helpful. You can mix simple Hinglish if user uses Hindi.

Guidelines:
- Answer briefly (2-4 sentences) and friendly, you can mix simple Hinglish if user uses Hindi.
- Help with questions about Sahil's skills, projects, contact info, resume, and how he works.
- If asked something you don't know (salary, private life, etc.), say you are not sure.
- When relevant, mention user can view projects on the portfolio or GitHub.
`;

// ===== Chatbot API =====
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: 'Kya poochna chahte ho? 🙂' });

  try {
   const completion = await client.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    { role: "system", content: SAHIL_PROFILE },
    { role: "user", content: message }
  ]
});

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('AI error:', err);
    res.status(500).json({ reply: 'Server busy hai, thodi der baad try karo.' });
  }
});

// ===== Start server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
async function handleSend() {
  const text = chatbotInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  chatbotInput.value = '';

  addMessage('Thinking...', 'bot');

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    chatbotBody.removeChild(chatbotBody.lastChild);

    const reply = data.reply || getBotReply(text);
    addMessage(reply, 'bot');
  } catch (err) {
    console.error(err);
    chatbotBody.removeChild(chatbotBody.lastChild);
    addMessage(getBotReply(text), 'bot');
  }
}
