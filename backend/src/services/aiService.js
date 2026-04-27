const axios = require('axios');
const { z } = require('zod');
const env = require('../config/env');

// Use 127.0.0.1 for maximum stability with Node.js 18+
const OLLAMA_BASE_URL = env.OLLAMA_URL.replace('localhost', '127.0.0.1');

// Define the response schema using Zod
const SummaryResponseSchema = z.object({
  summary: z.string().describe('Teks ringkasan video'),
  keyPoints: z.array(z.object({
    point: z.string().describe('Deskripsi poin utama')
  })).describe('Daftar poin-poin kunci video')
});

/**
 * Generates a summary and key points from a transcript using Ollama via REST API
 * @param {object} params - { transcript, title, language, length }
 * @returns {Promise<object>} - { summary, keyPoints }
 */
async function generateSummary({ transcript, title, language, length }) {
  const languageName = language === 'id' ? 'Indonesia' : 'English';
  const lengthInstruction = {
    short: 'sekitar 100 kata',
    normal: 'sekitar 200 kata',
    detailed: 'sekitar 400 kata'
  }[length] || 'sekitar 200 kata';

  const systemInstruction = `Kamu adalah asisten yang bertugas meringkas konten video YouTube berdasarkan transkrip yang diberikan. Tugas kamu:
1. Buat ringkasan yang jelas dan terstruktur dalam bahasa ${languageName}.
2. Identifikasi 5-10 poin utama paling penting sebagai "keyPoints".
3. Untuk setiap poin, berikan deskripsi yang padat.
4. Panjang ringkasan: ${lengthInstruction}.
5. Jangan menyebutkan bahwa kamu membaca transkrip; tulis seolah kamu menonton video.
6. Format output HARUS dalam JSON yang valid dengan struktur: {"summary": "...", "keyPoints": [{"point": "..."}]}`;

  const userPrompt = `Transkrip video berjudul '${title}':
${transcript}
---
Buat ringkasan dan key points sesuai instruksi dalam format JSON.`;

  try {
    const response = await axios.post(`${OLLAMA_BASE_URL}/api/chat`, {
      model: env.AI_MODEL || 'llama3.2:3b',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userPrompt }
      ],
      format: 'json',
      stream: false,
      options: {
        temperature: 0.7,
      },
    });

    // Ollama returns chat response in response.data.message.content
    const contentText = response.data.message.content;
    const content = JSON.parse(contentText);
    
    return SummaryResponseSchema.parse(content);
  } catch (error) {
    console.error('[Ollama AI Service Error]:', error.message);
    if (error.response) {
      console.error('[Ollama AI Error Data]:', error.response.data);
    }
    
    // Fallback Mock for testing purposes
    if (process.env.NODE_ENV === 'development') {
      console.log('Using fallback mock response for development...');
      return {
        summary: `[AXIOS OLLAMA MOCK] Video: "${title}". Muncul karena kendala teknis pada Ollama. URL: ${OLLAMA_BASE_URL}. Error: ${error.message}`,
        keyPoints: [
          { point: "Poin pertama tentang latar belakang topik video." },
          { point: "Poin kedua mengenai inti pembahasan utama." },
          { point: "Poin ketiga tentang kesimpulan dan saran praktis." }
        ]
      };
    }

    throw { 
      code: 'AI_SERVICE_ERROR', 
      httpStatus: 502, 
      message: error.message || 'Gagal memproses ringkasan menggunakan Ollama AI.' 
    };
  }
}

module.exports = {
  generateSummary
};
