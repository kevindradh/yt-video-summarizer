/**
 * Splits transcript into smaller chunks based on word count (approximation for tokens)
 * @param {string} text 
 * @param {number} maxWordsPerChunk 
 * @returns {string[]}
 */
function splitTranscript(text, maxWordsPerChunk = 2500) {
  const words = text.split(' ');
  const chunks = [];
  
  for (let i = 0; i < words.length; i += maxWordsPerChunk) {
    chunks.push(words.slice(i, i + maxWordsPerChunk).join(' '));
  }
  
  return chunks;
}

module.exports = {
  splitTranscript
};
