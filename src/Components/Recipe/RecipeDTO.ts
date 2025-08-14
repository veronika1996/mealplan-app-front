export type RecipeCategory =
  | 'BREAKFAST'
  | 'LUNCH'
  | 'DINNER'
  | 'SNACK'
  | 'OTHER'
  | 'DESERT';

export interface IngredientQuantityDTO {
    "name": string,
    "quantity": number
}

export interface RecipeDTO {
  id: number;
  name: string;
  ingredients: IngredientQuantityDTO[];
  preparation: string;
  caloriesNumber: number;
  category: RecipeCategory;
  numberOfPortions: number;
  createdBy: string;
}
