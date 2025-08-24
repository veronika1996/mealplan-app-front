import React, { useState } from 'react';
import { RecipeDTO } from '../Recipe/RecipeDTO';
import RecipesSearch from './RecipeSearch';
import RecipeModal from '../Recipe/RecipeModal';
import { FaTrash, FaEye } from 'react-icons/fa';

const categoryOptions: { value: RecipeCategory; label: string }[] = [
  { value: 'BREAKFAST', label: 'DORUČAK' },
  { value: 'LUNCH', label: 'RUČAK' },
  { value: 'DINNER', label: 'VEČERA' },
  { value: 'SNACK', label: 'UŽINA' },
  { value: 'OTHER', label: 'OSTALO' },
  { value: 'DESERT', label: 'DEZERT' },
];

interface PlanBlockProps {
  meal: { type: string; recipes: any[] };
  recipes: RecipeDTO[];
  onAddRecipe?: (recipe: RecipeDTO) => void;
  onCreateNewRecipe?: () => void;
  username: string;
  onRemoveRecipe: (mealType: string, recipeId: number) => void;  
}

const PlanBlock: React.FC<PlanBlockProps> = ({ meal, recipes, onAddRecipe, onCreateNewRecipe, onRemoveRecipe }) => {
  const editable = !!onAddRecipe && !!onCreateNewRecipe;

  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDTO | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

  const openModal = (recipe: RecipeDTO) => {
    setSelectedRecipe(recipe);
    setModalMode('view');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecipe(null);
  };

  const handleSave = (updatedRecipe: RecipeDTO) => {
    if (onAddRecipe) onAddRecipe(updatedRecipe);
    closeModal();
  };

  return (
    <div className="plan-block">
      <h2 className="plan-block-title">
        {categoryOptions.find(c => c.value === meal.type)?.label || 'Nepoznato'}
      </h2>

      {editable && (
        <div className="plan-block-search">
          <RecipesSearch onSelectRecipe={onAddRecipe!} />
        </div>
      )}

<div className="plan-block-recipes">
  {meal.recipes.map(pr => {
    const fullRecipe = recipes.find(r => r.id === pr.recipeId || r.id === pr.id);
    if (!fullRecipe) return null;
    return (
      <div key={pr.instanceId} className="plan-block-recipe-item">
        <span className="recipe-name">{fullRecipe.name} ({pr.calories || pr.caloriesNumber} kcal)</span>
        <div className="recipe-icons">
          <FaEye
            className="icon-view"
            onClick={() => openModal(fullRecipe)}
/>
          {editable && (
            <FaTrash
              className="icon-delete"
              onClick={() => onRemoveRecipe(meal.type, pr.instanceId)}
            />
          )}
        </div>
      </div>
    );
  })}
</div>

      {selectedRecipe && (
        <RecipeModal
          visible={modalVisible}
          mode={modalMode} 
          recipe={selectedRecipe}
          onClose={closeModal}
          onSave={handleSave}
          showEditIcon={false} 
        />
      )}
    </div>
  );
};

export default PlanBlock;
