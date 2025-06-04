import axios from 'axios';
//AIzaSyDUyp7OcPnMcwwQejUCRkqGL4hdKd3wq2k
const GOOGLE_API_KEY = '';
const GOOGLE_TRANSLATE_URL = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`;

interface GoogleTranslation {
  translatedText: string;
  detectedSourceLanguage?: string;
}

interface GoogleTranslateResponse {
  data: {
    translations: GoogleTranslation[];
  };
}

export async function translateWithGoogleAPI(
  texts: string | string[],
  targetLanguage: string,
  sourceLanguage: string = 'en'
): Promise<string | string[]> {
  if ((Array.isArray(texts) && texts.length === 0) || (!Array.isArray(texts) && !texts)) {
    return texts;
  }

  try {
    const response = await axios.post<GoogleTranslateResponse>(GOOGLE_TRANSLATE_URL, {
      q: texts,
      target: targetLanguage,
      source: sourceLanguage,
      format: 'text',
    });

    const translationsData = response.data.data.translations;

    if (Array.isArray(texts)) {
      return translationsData.map((t) => t.translatedText);
    } else {
      return translationsData[0]?.translatedText || (texts as string);
    }
  } catch (error) {
    console.error(
      'Google Translation API error:',
      axios.isAxiosError(error) ? error.response?.data?.error?.message || error.message : error
    );
    return texts;
  }
}