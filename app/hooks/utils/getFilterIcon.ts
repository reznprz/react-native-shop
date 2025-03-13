import { IconType } from 'app/navigation/screenConfigs';

export function getFilterIcon(
  filterName: string,
  filterLabel: string,
): { iconName: string; iconType: IconType } {
  const cat = filterLabel?.toLowerCase() || '';
  // If filterName is "Tables", return a table icon (MaterialCommunityIcons)
  if (filterName === 'Tables') {
    if (cat.includes('all')) return { iconName: 'list-outline', iconType: 'Ionicons' };
    return { iconName: 'table', iconType: 'TableIcon' };
  }

  // If filterName is "Categories", return category-based icons (Ionicons)
  if (filterName === 'Categories') {
    const categoryIcons: Record<string, string> = {
      all: 'list-outline',
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
        return { iconName: categoryIcons[key], iconType: 'Ionicons' };
      }
    }

    // Fallback icon for categories
    return { iconName: 'restaurant', iconType: 'Ionicons' };
  }

  // Generic fallback icon for unknown filter types (MaterialCommunityIcons)
  return { iconName: 'filter', iconType: 'MaterialCommunityIcons' };
}
