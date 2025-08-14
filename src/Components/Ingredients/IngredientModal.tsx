import React from 'react';
import { IngredientDTO } from './IngredientDTO';

import {
    FaAppleAlt, FaCarrot, FaDrumstickBite, FaCheese, FaBreadSlice, FaPepperHot,
    FaWineBottle, FaLeaf, FaUtensilSpoon, FaGlassWhiskey, FaUtensils, FaSeedling,
    FaTint, FaQuestion
  } from 'react-icons/fa';
  
const categoryIcons: Record<string, JSX.Element> = {
    FRUIT: <FaAppleAlt title="VOĆE" />,
    VEGETABLE: <FaCarrot title="POVRĆE" />,
    MEAT: <FaDrumstickBite title="MESO" />,
    DAIRY: <FaCheese title="MLEČNI PROIZVODI" />,
    BREAD: <FaBreadSlice title="HLEB" />,
    SPICE: <FaPepperHot title="ZAČINI" />,
    SAUCE: <FaUtensilSpoon title="SOSEVI" />,
    JUICE: <FaGlassWhiskey title="SOKOVI" />,
    ALCOHOL: <FaWineBottle title="ALKOHOL" />,
    PASTA: <FaUtensils title="TESTENINA" />,
    RICE: <FaSeedling title="ŽITARICE" />,
    FLOUR: <FaLeaf title="BRAŠNO" />,
    OIL: <FaTint title="ULJE" />,
    OTHER: <FaQuestion title="OSTALO" />,
  };
  

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient: IngredientDTO;
  setIngredient: (ingredient: IngredientDTO) => void;
  errors: { name?: string; calorieNumber?: string };
  onSave: () => void;
  title: string;
  saveLabel?: string;
  readOnlyName?: boolean;
}

const IngredientModal: React.FC<IngredientModalProps> = ({
  isOpen,
  onClose,
  ingredient,
  setIngredient,
  errors,
  onSave,
  title,
  saveLabel = 'Sačuvajte',
  readOnlyName = false
}) => {
  if (!isOpen || !ingredient) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>{title}</h3>
        <label>Ime:</label>
        <input
          type="text"
          value={ingredient.name}
          onChange={e => {
            setIngredient({ ...ingredient, name: e.target.value });
          }}
          readOnly={readOnlyName}
          disabled={readOnlyName}
        />
        {errors.name && <div className="error-text">{errors.name}</div>}

        <label>Broj kalorija na 100g:</label>
        <input
          type="number"
          min={0}
          value={ingredient.calorieNumber}
          onChange={e => {
            setIngredient({ ...ingredient, calorieNumber: Number(e.target.value) });
          }}
        />
        {errors.calorieNumber && <div className="error-text">{errors.calorieNumber}</div>}

        <label>Kategorija:</label>
        <select
          value={ingredient.category}
          onChange={e => setIngredient({ ...ingredient, category: e.target.value })}
        >
          {Object.keys(categoryIcons).map(cat => (
            <option key={cat} value={cat}>
              {(categoryIcons[cat] as any).props.title || 'OSTALO'}
            </option>
          ))}
        </select>

        <div className="modal-buttons">
          <button onClick={onSave} className="save-button">{saveLabel}</button>
          <button onClick={onClose} className="cancel-button">Odustanite</button>
        </div>
      </div>
    </div>
  );
};

export default IngredientModal;
