// NVIDIA API Configuration
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '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';

// Common misspellings dictionary
export const commonTypos = {
  'teh': 'the',
  'adn': 'and',
  'taht': 'that',
  'thier': 'their',
  'recieve': 'receive',
  'seperate': 'separate',
  'definately': 'definitely',
  'occured': 'occurred',
  'until': 'until',
  'wich': 'which',
  'th': 'the',
  'wit': 'with',
  'for': 'for',
  'becuase': 'because',
  'dont': "don't",
  'cant': "can't",
  'wont': "won't",
  'im': "I'm",
  'alot': 'a lot',
  'loose': 'lose',
  'effect': 'affect',
  'its': "it's",
  'youre': "you're",
  'theyre': "they're",
  'weather': 'whether',
  'then': 'than',
  'suprise': 'surprise',
  'maintainance': 'maintenance',
  'pronounciation': 'pronunciation',
  'accomodate': 'accommodate',
  'acheive': 'achieve'
};

// AI-powered spell check using NVIDIA API
export async function checkSpellingWithAI(text) {
  try {
    console.log('🤖 Using NVIDIA AI for spell checking...');

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-405b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a spelling and grammar checker. Analyze the text and identify spelling mistakes. Return ONLY a JSON array of objects with properties: "text" (the misspelled word), "suggestion" (correct spelling), and "errorType" (type of error).'
          },
          {
            role: 'user',
            content: `Check this text for spelling mistakes. Return JSON format only:\n\n${text.substring(0, 3000)}`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      console.error('❌ NVIDIA AI API error:', response.status, response.statusText);
      return null;
    }

    const result = await response.json();
    const aiResponse = result.choices[0].message.content;

    console.log('🤖 AI Response:', aiResponse.substring(0, 200));

    // Parse JSON from AI response
    try {
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const aiTypos = JSON.parse(jsonMatch[0]);
        console.log(`✅ AI found ${aiTypos.length} potential errors`);
        return aiTypos;
      }
    } catch (e) {
      console.error('❌ Failed to parse AI response:', e.message);
    }

    return null;
  } catch (error) {
    console.error('❌ Error calling NVIDIA AI:', error.message);
    return null;
  }
}

export async function analyzePDF(pages) {
  // Reconstruct full text and build a map
  let fullText = "";
  const textMap = [];

  for (const page of pages) {
    for (const word of page.words) {
      const start = fullText.length;
      fullText += word.text;
      const end = fullText.length;

      textMap.push({
        start,
        end,
        word: word,
        page: page.pageNumber
      });

      fullText += " ";
    }
    fullText += "\n";
  }

  console.log('='.repeat(50));
  console.log('📄 PDF Info:');
  console.log('  Pages:', pages.length);
  console.log('  Total text length:', fullText.length);
  console.log('  Text preview:', fullText.substring(0, 500));
  console.log('='.repeat(50));

  // Spell Check
  let typos = [];
  const aiTypos = await checkSpellingWithAI(fullText);

  // Helper to find word in map
  const findWordAt = (index, length) => {
    return textMap.find(entry =>
      index >= entry.start && index < entry.end + 5
    );
  };

  if (aiTypos && aiTypos.length > 0) {
    aiTypos.forEach(typo => {
      const lowerTypo = typo.text.toLowerCase();
      const index = fullText.toLowerCase().indexOf(lowerTypo);

      if (index !== -1) {
        const mapping = findWordAt(index, typo.text.length);

        const bbox = mapping && mapping.word ? {
          x: mapping.word.x,
          y: mapping.word.y,
          width: mapping.word.width,
          height: mapping.word.height
        } : null;

        typos.push({
          text: typo.text,
          suggestion: typo.suggestion,
          errorType: typo.errorType || 'AI Error',
          pageNumber: mapping ? mapping.page : 1,
          boundingBox: bbox
        });
      }
    });
  } else {
    // Dictionary check
    for (const [bad, good] of Object.entries(commonTypos)) {
      const regex = new RegExp(`\\b${bad}\\b`, 'gi');
      let match;
      while ((match = regex.exec(fullText)) !== null) {
        const mapping = findWordAt(match.index, bad.length);
        const bbox = mapping && mapping.word ? {
          x: mapping.word.x,
          y: mapping.word.y,
          width: mapping.word.width,
          height: mapping.word.height
        } : null;

        typos.push({
          text: bad,
          suggestion: good,
          errorType: 'Spelling mistake',
          pageNumber: mapping ? mapping.page : 1,
          boundingBox: bbox
        });
      }
    }
  }

  // Filter out invalid typos
  typos = typos.filter(t => {
    if (!t.text || !/[a-zA-Z0-9]/.test(t.text)) return false;

    const phraseToCheck = "not a spelling mistake";
    const suggestion = t.suggestion ? t.suggestion.toLowerCase() : "";
    const errorType = t.errorType ? t.errorType.toLowerCase() : "";

    if (suggestion.includes(phraseToCheck) || errorType.includes(phraseToCheck)) {
      return false;
    }

    return true;
  });

  return {
    status: 'success',
    totalPages: pages.length,
    typos: typos,
    message: `Analysis complete. Found ${typos.length} potential typos.`
  };
}
