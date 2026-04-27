const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generates a summary and key points from a transcript using Google Gemini (New SDK)
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
5. Jangan menyebutkan bahwa kamu membaca transkrip; tulis seolah kamu menonton video.`;

  const prompt = `Transkrip video berjudul '${title}':
${transcript}
---
Buat ringkasan dan key points sesuai instruksi dalam format JSON: {"summary": "...", "keyPoints": [{"point": "..."}]}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    });

    // The SDK returns parsed JSON in .parsed when responseMimeType is application/json
    if (response.parsed) return response.parsed;
    
    // Fallback if parsed is empty but response exists
    return JSON.parse(response.text);
  } catch (error) {
    console.error('[Gemini AI Service Error]:', error.message);
    
    // Fallback Mock for testing purposes if API is busy (503) or other temporary issues
    if (process.env.NODE_ENV === 'development') {
      console.log('Using fallback mock response for development...');
      return {
        summary: `[MOCK SUMMARY] Video ini membahas tentang "${title}". Ringkasan ini muncul karena layanan AI sedang sibuk (Error 503). Konten video mencakup berbagai aspek penting yang berkaitan dengan topik tersebut, memberikan wawasan mendalam bagi para penonton.`,
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
      message: error.message || 'Gagal memproses ringkasan menggunakan Gemini AI.' 
    };
  }
}

module.exports = {
  generateSummary
};
