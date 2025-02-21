import { Food } from "app/api/services/foodService";

export enum SubCategory {
  MainCourses = "Main Courses",
  AppetizersAndSides = "Appetizers & Sides",
  Beverages = "Beverages",
  Desserts = "Desserts",
  SpecialtyItems = "Specialty Items",
  Breakfast = "Breakfast",
}

export function groupFoodBySubCategory(
  foods: Food[]
): Record<SubCategory, Food[]> {
  return foods.reduce((acc, food) => {
    let subCategory: SubCategory;

    switch (food.categoryName) {
      case "PIZZA":
      case "CHOWMEIN":
      case "THUKPA":
      case "MOMO":
      case "CHOPSUEY":
      case "FRIED RICE":
      case "NEWARI KHAJA SET":
      case "NOODLES":
      case "Wrap":
        subCategory = SubCategory.MainCourses;
        break;

      case "SOUP":
      case "SNACKS":
      case "OUR SPECIAL":
      case "OUR SPECIAL DRINKS":
      case "SPECIAL WINGS":
      case "COMBO SPECIAL MENU":
        subCategory = SubCategory.AppetizersAndSides;
        break;

      case "TEA":
      case "COFFEE":
      case "ICED BREW":
      case "LEMONADE":
      case "LASSI":
      case "DRINKS":
      case "MOCKTAIL":
      case "BUBBLE TEA":
      case "FLAVORED LATTE":
      case "SHAKE":
      case "FRAPPE":
        subCategory = SubCategory.Beverages;
        break;

      case "ICE CREAM":
        subCategory = SubCategory.Desserts;
        break;

      case "HOOKAH":
      case "CIGARETTE":
        subCategory = SubCategory.SpecialtyItems;
        break;

      case "BREAKFAST":
      case "SHA-JHYA WAFFLES":
      case "SHA-JHYA BITES":
        subCategory = SubCategory.Breakfast;
        break;

      default:
        return acc; // Skip if no matching category is found
    }

    if (!acc[subCategory]) {
      acc[subCategory] = [];
    }

    acc[subCategory].push(food);
    return acc;
  }, {} as Record<SubCategory, Food[]>);
}
