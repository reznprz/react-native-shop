export function getCategoryIcon(category: string) {
  // Convert to lowercase for consistent matching
  const cat = category.toLowerCase();

  if (cat.includes('all')) return 'grid';
  if (cat.includes('pizza')) return 'pizza';
  if (cat.includes('combo')) return 'pricetags';
  if (cat.includes('wing')) return 'flame';
  if (cat.includes('waffle')) return 'ice-cream';
  if (cat.includes('bite')) return 'fast-food';
  if (cat.includes('soup')) return 'water';
  if (cat.includes('special')) return 'star';
  if (cat.includes('chopsuey')) return 'fast-food';
  if (cat.includes('chowmein')) return 'fast-food';
  if (cat.includes('thukpa')) return 'fast-food';
  if (cat.includes('momo')) return 'fast-food';
  if (cat.includes('fried rice')) return 'fast-food';
  if (cat.includes('breakfast')) return 'cafe';
  if (cat.includes('snack')) return 'fast-food';
  if (cat.includes('tea')) return 'cafe';
  if (cat.includes('coffee')) return 'cafe';
  if (cat.includes('iced brew')) return 'cafe';
  if (cat.includes('shake')) return 'ice-cream';
  if (cat.includes('lemonade')) return 'wine';
  if (cat.includes('lassi')) return 'wine';
  if (cat.includes('drink')) return 'wine';
  if (cat.includes('cigarette')) return 'cloud';
  if (cat.includes('frappe')) return 'cafe';
  if (cat.includes('mocktail')) return 'wine';
  if (cat.includes('flavored latte')) return 'cafe';
  if (cat.includes('newari')) return 'restaurant';
  if (cat.includes('ice cream')) return 'ice-cream';
  if (cat.includes('bubble tea')) return 'cafe';
  if (cat.includes('hookah')) return 'cloud';
  if (cat.includes('noodle')) return 'fast-food';
  if (cat.includes('wrap')) return 'fast-food';

  // Fallback icon if no match
  return 'restaurant';
}
