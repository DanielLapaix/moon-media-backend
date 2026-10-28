const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

// Inicializar la API de Gemini (la llave API la configuras de forma segura en las variables de entorno de Render)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Ruta de salud que usa tu widget para saber si el servicio está online
app.get('/api/health', (req, res) => {
  res.json({ ai: true, status: 'online' });
});

// Ruta que procesa los mensajes del chat de la web
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    // Tomamos el último mensaje enviado por el usuario
    const userMessage = messages[messages.length - 1].content;

    // Llamada al modelo de Gemini con contexto de la identidad de Moon Media
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: "Eres el asistente virtual oficial de Moon Media, un estudio creativo de diseño gráfico y marketing digital en la República Dominicana. Tu tono es profesional, cercano y comercial. Ayudas a los clientes informando sobre servicios de logotipos, redes sociales, branding, web y marketing. Contacto oficial: WhatsApp 809-215-4915, correo moondigital101@hotmail.com."
      }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("Error en la IA:", error);
    res.status(500).json({ reply: "Lo siento, en este momento tengo un pequeño problema técnico, pero puedes contactarnos directamente por WhatsApp al 809-215-4915." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de Moon Media corriendo en el puerto ${PORT}`);
});
