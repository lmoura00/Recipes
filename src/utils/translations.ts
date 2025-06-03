interface TranslationMap {
  [key: string]: string;
}

const translations: TranslationMap = {
  'Easy': 'Fácil',
  'Medium': 'Médio',
  'Hard': 'Difícil',
  'All': 'Todas',
  'Todos': 'Todos',
  'Dinner': 'Jantar',
  'Lunch': 'Almoço',
  'Breakfast': 'Café da Manhã',
  'Snack': 'Lanche',
  'Dessert': 'Sobremesa',
  'Side Dish': 'Acompanhamento',
  'Appetizer': 'Entrada',
  'Main Course': 'Prato Principal',
  'Italian': 'Italiana',
  'Asian': 'Asiática',
  'Mexican': 'Mexicana',
  'American': 'Americana',
  'Japanese': 'Japonesa',
  'Indian': 'Indiana',
  'French': 'Francesa',
  'Mediterranean': 'Mediterrânea',
  'Chinese': 'Chinesa',
};

export const translate = (text: string | undefined | null, fallback?: string): string => {
  if (text === null || text === undefined) {
    return fallback || '';
  }
  if (translations[text]) {
    return translations[text];
  }
  const capitalizedText = text.charAt(0).toUpperCase() + text.slice(1);
  if (translations[capitalizedText]) {
    return translations[capitalizedText];
  }
  const spaceSeparatedText = text.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
   if (translations[spaceSeparatedText]) {
    return translations[spaceSeparatedText];
  }
  return fallback || text;
};