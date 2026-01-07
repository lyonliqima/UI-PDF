import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });

// NVIDIA API Configuration
const NVIDIA_API_KEY = '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';

// AI-powered spell check using NVIDIA API
async function checkSpellingWithAI(text) {
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

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Common misspellings dictionary
const commonTypos = {
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
  'acheive': 'achieve',
  'accross': 'across',
  'agressive': 'aggressive',
  'apparant': 'apparent',
  'arguement': 'argument',
  'beggining': 'beginning',
  'beleive': 'believe',
  'calender': 'calendar',
  'catagory': 'category',
  'cemetary': 'cemetery',
  'collegue': 'colleague',
  'comming': 'coming',
  'commited': 'committed',
  'concious': 'conscious',
  'curiousity': 'curiosity',
  'decieve': 'deceive',
  'descrete': 'discrete',
  'disapear': 'disappear',
  'disapoint': 'disappoint',
  'embarass': 'embarrass',
  'exagerate': 'exaggerate',
  'excercise': 'exercise',
  'experiance': 'experience',
  'familar': 'familiar',
  'finaly': 'finally',
  'foriegn': 'foreign',
  'fourty': 'forty',
  'freind': 'friend',
  'goverment': 'government',
  'grammer': 'grammar',
  'gaurd': 'guard',
  'happend': 'happened',
  'harrass': 'harass',
  'heighth': 'height',
  'heros': 'heroes',
  'humourous': 'humorous',
  'immediatly': 'immediately',
  'independant': 'independent',
  'intresting': 'interesting',
  'knowlege': 'knowledge',
  'liason': 'liaison',
  'libary': 'library',
  'lisence': 'license',
  'maintainance': 'maintenance',
  'manuever': 'maneuver',
  'milion': 'million',
  'minature': 'miniature',
  'miniscule': 'minuscule',
  'mysteryious': 'mysterious',
  'neccessary': 'necessary',
  'neccessarily': 'necessarily',
  'noticable': 'noticeable',
  'occurance': 'occurrence',
  'ofthe': 'of the',
  'officialy': 'officially',
  'ongoin': 'ongoing',
  'orignal': 'original',
  'outragous': 'outrageous',
  'paralel': 'parallel',
  'particulary': 'particularly',
  'pavillion': 'pavilion',
  'percieve': 'perceive',
  'perfomance': 'performance',
  'perseverence': 'perseverance',
  'personel': 'personnel',
  'posession': 'possession',
  'potatos': 'potatoes',
  'preceed': 'precede',
  'predjudice': 'prejudice',
  'privelege': 'privilege',
  'profesion': 'profession',
  'promiss': 'promise',
  'pronounciation': 'pronunciation',
  'publically': 'publicly',
  'realy': 'really',
  'reccomend': 'recommend',
  'reffer': 'refer',
  'relevent': 'relevant',
  'religous': 'religious',
  'remeber': 'remember',
  'repetition': 'repetition',
  'resistence': 'resistance',
  'responsability': 'responsibility',
  'rythm': 'rhythm',
  'sacreligious': 'sacrilegious',
  'sargent': 'sergeant',
  'scedule': 'schedule',
  'sentance': 'sentence',
  'seperately': 'separately',
  'sieze': 'seize',
  'similiar': 'similar',
  'sincerly': 'sincerely',
  'speach': 'speech',
  'sucessful': 'successful',
  'supercede': 'supersede',
  'supposably': 'supposedly',
  'suprise': 'surprise',
  'temperture': 'temperature',
  'tendancy': 'tendency',
  'therefor': 'therefore',
  'thier': 'their',
  'tommorow': 'tomorrow',
  'tounge': 'tongue',
  'truely': 'truly',
  'unfortunatly': 'unfortunately',
  'unfortunatley': 'unfortunately',
  'unfortunetly': 'unfortunately',
  'untill': 'until',
  'upholstry': 'upholstery',
  'usible': 'usable',
  'vaccuum': 'vacuum',
  'vegetble': 'vegetable',
  'vehical': 'vehicle',
  'visious': 'vicious',
  'weired': 'weird',
  'wellfare': 'welfare',
  'wheras': 'whereas',
  'wierd': 'weird',
  'writting': 'writing',
  'yery': 'very',
  'your': 'you\'re',
  'zuch': 'such',
  'hvae': 'have',
  'waht': 'what',
  'tihs': 'this',
  'whic': 'which',
  'becasue': 'because',
  'becuse': 'because',
  'becuase': 'because',
  'thier': 'their',
  'tehir': 'their',
  'thne': 'then',
  'taht': 'that',
  'htat': 'that',
  'ot': 'to',
  'fo': 'of',
  'tose': 'those',
  'hese': 'these',
  'nad': 'and',
  'adn': 'and',
  'nd': 'and',
  'dont': 'don\'t',
  'didnt': 'didn\'t',
  'doesnt': 'doesn\'t',
  'isnt': 'isn\'t',
  'arent': 'aren\'t',
  'wont': 'won\'t',
  'wouldnt': 'wouldn\'t',
  'couldnt': 'couldn\'t',
  'shouldnt': 'shouldn\'t',
  'cant': 'can\'t',
  'cannot': 'can not',
  'mustnt': 'mustn\'t',
  'hasnt': 'hasn\'t',
  'havent': 'haven\'t',
  'hadnt': 'hadn\'t',
  'didnt': 'didn\'t'
};

function checkSpelling(text) {
  const typos = [];
  const words = text.toLowerCase().split(/[\s\s+]/g).filter(w => w.length > 0);

  // Simple word splitting
  const cleanWords = text.match(/[a-zA-Z]+/g) || [];

  for (let i = 0; i < cleanWords.length; i++) {
    const word = cleanWords[i];
    const lowerWord = word.toLowerCase();

    // Skip very short words
    if (word.length <= 1) continue;

    // Skip numbers
    if (/^\d+$/.test(word)) continue;

    // Check against common typos
    if (commonTypos[lowerWord]) {
      // Find position in text
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const match = regex.exec(text);

      if (match) {
        typos.push({
          text: word,
          suggestion: commonTypos[lowerWord],
          errorType: 'Spelling mistake',
          position: match.index,
          pageNumber: 1 // Will be updated by PDF processing
        });
      }
    }
  }

  return typos;
}

async function analyzePDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    const text = data.text;
    const numPages = data.numpages;

    console.log('='.repeat(50));
    console.log('📄 PDF Info:');
    console.log('  Pages:', numPages);
    console.log('  Total text length:', text.length);
    console.log('  Text preview:', text.substring(0, 500));
    console.log('='.repeat(50));

    // First try AI-based spell checking
    let typos = [];
    const aiTypos = await checkSpellingWithAI(text);

    if (aiTypos && aiTypos.length > 0) {
      // Verify AI typos actually exist in the text
      const verifiedTypos = [];
      const lowerText = text.toLowerCase();

      aiTypos.forEach(typo => {
        const lowerTypo = typo.text.toLowerCase();
        const index = lowerText.indexOf(lowerTypo);

        if (index !== -1) {
          // Set pageNumber to 1 (frontend will scan all pages anyway)
          verifiedTypos.push({
            text: typo.text,
            suggestion: typo.suggestion,
            errorType: typo.errorType || 'AI detected error',
            pageNumber: 1 // Default to page 1, frontend scans all pages
          });

          console.log(`✅ Verified typo "${typo.text}" at position ${index}`);
        } else {
          console.log(`⚠️  Typo "${typo.text}" not found in text`);
        }
      });

      console.log(`🤖 AI found ${aiTypos.length} errors, ${verifiedTypos.length} verified in text`);

      if (verifiedTypos.length > 0) {
        typos = verifiedTypos;
        console.log(`✅ Using verified AI-detected errors: ${typos.length}`);
      } else {
        console.log('⚠️  AI typos not found in actual text, falling back to dictionary...');
        typos = checkSpelling(text);
      }
    } else {
      // Fall back to dictionary-based spell checking
      console.log('⚠️  AI check failed or returned no results, using dictionary...');
      typos = checkSpelling(text);
    }

    // Return typos - frontend will figure out which page each typo is on
    return {
      status: 'success',
      totalPages: numPages,
      typos: typos,
      message: `Analysis complete. Found ${typos.length} potential typos.`
    };
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF: ' + error.message);
  }
}

// Routes
app.get('/api/pdf/health', (req, res) => {
  res.send('PDF Typo Detector API is running');
});

app.post('/api/pdf/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
    }

    console.log(`Analyzing PDF: ${req.file.originalname}`);

    // Read the file buffer
    const buffer = fs.readFileSync(req.file.path);

    // Analyze the PDF
    const result = await analyzePDF(buffer);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // Send response
    res.json(result);

    console.log(`Analysis complete: ${result.typos.length} typos found`);
  } catch (error) {
    console.error('Error analyzing PDF:', error);

    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      status: 'error',
      totalPages: 0,
      typos: [],
      message: 'Error analyzing PDF: ' + error.message
    });
  }
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`\n🚀 PDF Typo Detector Backend running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`✅ Ready to analyze PDFs\n`);
});
