document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const wordInput = document.getElementById('word-input'); 
    const resultSection = document.getElementById('result-section'); 
    const resultWord = document.getElementById('result-word'); 
    const audioContainer = document.getElementById('audio-container'); 
    const definitionPara = document.getElementById('definitions'); 
    const synonymsPara = document.getElementById('synonyms'); 

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // prevent page refresh 
        const word = wordInput.value.trim(); 
        if (word) {
            await fetchDefinition(word); 
        }
    }); 

    // fetch definition of words 
    async function fetchDefinition(word) {
        const API_URL = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        try {
            const response = await fetch(API_URL); 

            if (!response.ok) {
                throw new Error('Word not found'); 
            }
            const data = await response.json(); 
            displayResults(data[0]); 

            resultSection.classList.remove('hidden');
            resultSection.classList.add('visible');

        } catch (error) {
            resultWord.textContent = 'Word not found'; 
            definitionPara.textContent = 'Please try another word.'; 
            document.getElementById('syllables').textContent = '';
            document.getElementById('POS').textContent = '';
            synonymsPara.textContent = ''; 
            audioContainer.innerHTML = ''; 
            document.getElementById('examples').textContent = '';
            resultSection.classList.remove('hidden'); 
        }
    }

    // display results 
    function displayResults(data) {
        // reset animation
        resultSection.classList.remove('fadeInAnimation');
        resultSection.classList.remove('hidden'); 

        // display word
        resultWord.textContent = data.word; 

        // syllables, POS, element refrence 
        const syllablesSpan = document.getElementById('syllables');
        const posSpan = document.getElementById('POS');
        const antonymsPara = document.getElementById('antonyms');

        // phonetics for syllables 
        const phonetic = data.phonetics.find(p => p.text) || {};
        syllablesSpan.textContent = phonetic.text || '';

        // POS from first meaning 
        posSpan.textContent = data.meanings[0].partOfSpeech || '';

        // pronunciation / audio
        audioContainer.innerHTML = ''; 
        const phonetics = data.phonetics.find(p => p.audio); 
        if (phonetics) {
            const audio = document.createElement('audio'); 
            audio.src = phonetics.audio; 
            audio.controls = true; 
            audioContainer.appendChild(audio); 
        }

        // definitions (top 2)
        const topDefinition = data.meanings[0].definitions[0].definition; 
        definitionPara.textContent = topDefinition; 

        // synonyms (first meaning)
        const synonyms = data.meanings[0].synonyms || []; 
        synonymsPara.textContent = synonyms.slice(0, 5).join(',') || 'No synonyms found'; 

        void resultSection.offsetWidth; 

        // restart the animation
        resultSection.classList.add('fadeInAnimation'); 
    }
}); 