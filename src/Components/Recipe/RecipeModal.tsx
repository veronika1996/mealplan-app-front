import React, { useState, useEffect } from 'react';
import { RecipeDTO, RecipeCategory } from './RecipeDTO';
import { FaUtensils, FaEdit } from 'react-icons/fa';
import IngredientsSearch from './IngredientsSearch';

type RecipeModalProps = {
  visible: boolean;
  mode: 'view' | 'add' | 'edit';
  recipe: RecipeDTO | null;
  onClose: () => void;
  onSave: (recipe: RecipeDTO, mode: 'add' | 'edit') => void;
};

const storedUser = localStorage.getItem('user');
const user = storedUser ? JSON.parse(storedUser) : null;
const username = user?.username || 'Korisnik1';

const categoryOptions: { value: RecipeCategory; label: string }[] = [
  { value: 'BREAKFAST', label: 'DORUČAK' },
  { value: 'LUNCH', label: 'RUČAK' },
  { value: 'DINNER', label: 'VEČERA' },
  { value: 'SNACK', label: 'UŽINA' },
  { value: 'OTHER', label: 'OSTALO' },
  { value: 'DESERT', label: 'DEZERT' },
];

const RecipeModal: React.FC<RecipeModalProps> = ({ visible, mode, recipe, onClose, onSave }) => {
  const [editableRecipe, setEditableRecipe] = useState<RecipeDTO>({
    id: 0,
    name: '',
    ingredients: [],
    preparation: '',
    caloriesNumber: 0,
    category: 'OTHER',
    numberOfPortions: 1,
    createdBy: '',
  });

  const [currentMode, setCurrentMode] = useState<'view' | 'add' | 'edit'>(mode);

  useEffect(() => {
    if (!visible) return;

    if (recipe) {
      setEditableRecipe(recipe);
      setCurrentMode(mode);
    } else if (mode === 'add') {
      setEditableRecipe({
        id: 0,
        name: '',
        ingredients: [],
        preparation: '',
        caloriesNumber: 0,
        category: 'OTHER',
        numberOfPortions: 1,
        createdBy: username,
      });
      setCurrentMode('add');
    }
  }, [recipe, mode, visible]);

  if (!visible) return null;

  const isEditable = currentMode === 'add' || currentMode === 'edit';

  const handleChange = (field: keyof RecipeDTO, value: any) => {
    setEditableRecipe(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleIngredientAdd = (ingredient: { name: string; quantity: number }) => {
    if (editableRecipe.ingredients.some(i => i.name === ingredient.name)) return;
    setEditableRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredient],
    }));
  };

  const handleIngredientQuantityChange = (index: number, qty: number) => {
    setEditableRecipe(prev => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = { ...newIngredients[index], quantity: qty };
      return { ...prev, ingredients: newIngredients };
    });
  };

  const handleIngredientRemove = (index: number) => {
    setEditableRecipe(prev => {
      const newIngredients = [...prev.ingredients];
      newIngredients.splice(index, 1);
      return { ...prev, ingredients: newIngredients };
    });
  };

  const handleSaveClick = () => {
    if (!editableRecipe.name.trim()) {
      alert('Naziv je obavezan');
      return;
    }
    if (editableRecipe.ingredients.length === 0) {
      if (!window.confirm('Nema dodatih sastojaka. Nastaviti?')) return;
    }
    onSave(editableRecipe, currentMode);
  };

  const enableEdit = () => {
    setCurrentMode('edit');
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-content recipe-modal"
        onClick={e => e.stopPropagation()}
      >
        <div className="recipe-header">
          {isEditable ? (
            <>
              <input
                type="text"
                className="recipe-name-input"
                value={editableRecipe.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="Naziv recepta"
                autoFocus
                disabled={currentMode === 'edit'}
              />
              <div className="portions-input-group">
                <label htmlFor="portions" className="portions-label">
                  Broj porcija:
                </label>
                <input
                  id="portions"
                  type="number"
                  min={1}
                  className="portions-input"
                  value={editableRecipe.numberOfPortions}
                  onChange={e => handleChange('numberOfPortions', Number(e.target.value))}
                />
              </div>
            </>
          ) : (
            <>
              <div className="recipe-name-row">
                <h2 className="recipe-name-display">{editableRecipe.name}</h2>
                <FaEdit className="edit-icon" onClick={enableEdit} title="Izmeni recept" />
              </div>
              <div className="recipe-info-row">
                <p className="recipe-servings">
                  <FaUtensils className="recipe-info-icon" /> Broj porcija: {editableRecipe.numberOfPortions}
                </p>
                <p className="recipe-calories">
                  Broj kalorija po porciji: {editableRecipe.caloriesNumber}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="recipe-section">
          <label className="section-label">Kategorija:</label>
          {isEditable ? (
            <select
              className="category-select"
              value={editableRecipe.category}
              onChange={e => handleChange('category', e.target.value as RecipeCategory)}
            >
              {categoryOptions.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          ) : (
            <p className="category-display">
              {categoryOptions.find(c => c.value === editableRecipe.category)?.label || 'Nepoznato'}
            </p>
          )}
        </div>

        <div className="recipe-section">
          <label className="section-label">Sastojci:</label>
          {isEditable ? (
            <>
              <IngredientsSearch onAddIngredient={handleIngredientAdd} />
              <ul className="ingredients-list">
                {editableRecipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="ingredient-item">
                    <span className="ingredient-name">{ing.name}</span>
                    <input
                      type="number"
                      min={0}
                      className="ingredient-quantity-input"
                      value={ing.quantity}
                      onChange={e => handleIngredientQuantityChange(idx, Number(e.target.value))}
                    />
                    <span className="ingredient-unit">g</span>
                    <button
                      onClick={() => handleIngredientRemove(idx)}
                      className="ingredient-remove-button"
                      type="button"
                    >
                      Ukloni
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <table className="ingredients-table-view">
            <thead>
              <tr>
                <th>Ime</th>
                <th>Količina (g)</th>
              </tr>
            </thead>
            <tbody>
              {editableRecipe.ingredients.map((ing, idx) => (
                <tr key={idx}>
                  <td>{ing.name}</td>
                  <td>{ing.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>

        <div className="recipe-section">
          <label className="section-label">Priprema:</label>
          {isEditable ? (
            <textarea
              className="preparation-textarea"
              value={editableRecipe.preparation}
              onChange={e => handleChange('preparation', e.target.value)}
              rows={7}
            />
          ) : (
            <p className="preparation-text">{editableRecipe.preparation}</p>
          )}
        </div>

        <div className="modal-buttons">
          {isEditable && (
            <button
              onClick={handleSaveClick}
              className="save-button"
              type="button"
            >
              Sačuvaj
            </button>
          )}
          <button
            onClick={onClose}
            className="close-button"
            type="button"
          >
            Zatvori
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
