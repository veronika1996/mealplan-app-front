export type IngredientCategory =
  | 'FRUIT'
  | 'VEGETABLE'
  | 'MEAT'
  | 'DAIRY'
  | 'BREAD'
  | 'SPICE'
  | 'SAUCE'
  | 'JUICE'
  | 'ALCOHOL'
  | 'PASTA'
  | 'RICE'
  | 'FLOUR'
  | 'OIL'
  | 'OTHER';

export interface IngredientDTO {
  id: number;
  name: string;
  calorieNumber: number;
  addedBy: string;
  category: IngredientCategory;
}
