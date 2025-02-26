export function getFilterIcon(filterName: string, filterLabel: string): string {
  // Convert to lowercase for consistent matching
  const cat = filterLabel.toLowerCase();

  // If filterName is "Table", return a table icon
  if (filterName === 'Tables') {
    if (cat.includes('all')) return 'list-outline';
    return 'grid';
  }

  // If filterName is "Categories", return category-based icons
  if (filterName === 'Categories') {
    const categoryIcons: Record<string, string> = {
      all: 'grid',
      pizza: 'pizza',
      combo: 'pricetags',
      wing: 'flame',
      waffle: 'ice-cream',
      bite: 'fast-food',
      soup: 'water',
      special: 'star',
      chopsuey: 'fast-food',
      chowmein: 'fast-food',
      thukpa: 'fast-food',
      momo: 'fast-food',
      'fried rice': 'fast-food',
      breakfast: 'cafe',
      snack: 'fast-food',
      tea: 'cafe',
      coffee: 'cafe',
      'iced brew': 'cafe',
      shake: 'ice-cream',
      lemonade: 'wine',
      lassi: 'wine',
      drink: 'wine',
      cigarette: 'cloud',
      frappe: 'cafe',
      mocktail: 'wine',
      'flavored latte': 'cafe',
      newari: 'restaurant',
      'ice cream': 'ice-cream',
      'bubble tea': 'cafe',
      hookah: 'cloud',
      noodle: 'fast-food',
      wrap: 'fast-food',
    };

    // Find matching key in categoryIcons
    for (const key in categoryIcons) {
      if (cat.includes(key)) {
        return categoryIcons[key];
      }
    }

    // Fallback icon for categories
    return 'restaurant';
  }

  // Generic fallback icon for unknown filter types
  return 'filter';
}
