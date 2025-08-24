import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IngredientCategory, IngredientDTO } from '../Ingredients/IngredientDTO';
import IngredientModal from '../Ingredients/IngredientModal';

type IngredientSearchResult = {
  id: number;
  name: string;
  calorieNumber?: number;
  category?: string;
  addedBy?: string;
};

type IngredientsSearchProps = {
  onAddIngredient: (ingredient: { name: string; quantity: number }) => void;
};

const ingredientsCategoryOptions: { value: IngredientCategory; label: string }[] = [
  { value: 'FRUIT', label: 'VOĆE' },
  { value: 'VEGETABLE', label: 'POVRĆE' },
  { value: 'MEAT', label: 'MESO' },
  { value: 'DAIRY', label: 'MLEČNI PROIZVODI' },
  { value: 'BREAD', label: 'HLEB' },
  { value: 'SPICE', label: 'ZAČINI' },
  { value: 'SAUCE', label: 'SOSEVI' },
  { value: 'JUICE', label: 'SOKOVI' },
  { value: 'ALCOHOL', label: 'ALKOHOL' },
  { value: 'PASTA', label: 'TESTENINA' },
  { value: 'RICE', label: 'ŽITARICE' },
  { value: 'FLOUR', label: 'BRAŠNO' },
  { value: 'OIL', label: 'ULJE' },
  { value: 'OTHER', label: 'OSTALO' },
];

const IngredientsSearch: React.FC<IngredientsSearchProps> = ({ onAddIngredient }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IngredientSearchResult[]>([]);

  // za modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [ingredientToAdd, setIngredientToAdd] = useState<IngredientDTO | null>(null);
  const [errors, setErrors] = useState<{ name?: string; calorieNumber?: string }>({});

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const username = user?.username || 'Korisnik';

  useEffect(() => {
    if (query.trim().length < 1) {
      setSearchResults([]);
      return;
    }
    const fetchIngredients = async () => {
      try {
        const resp = await axios.get<IngredientSearchResult[]>(
          `http://localhost:8083/meal_plan/ingredients?username=${username}`
        );
        setSearchResults(
          (resp.data || []).filter(i =>
            i.name.toLowerCase().startsWith(query.toLowerCase())
          )
        );
      } catch (err) {
        try {
          const all = await axios.get<IngredientSearchResult[]>(`http://localhost:8083/meal_plan/ingredients?username=${username}`);
          const filtered = (all.data || []).filter(i =>
            i.name.toLowerCase().startsWith(query.toLowerCase())
          );
          setSearchResults(filtered);
        } catch {
          setSearchResults([]);
        }
      }
    };
    fetchIngredients();
  }, [query]);

  const getCategoryTitle = (categoryValue?: string) => {
    if (!categoryValue) return '';
    const found = ingredientsCategoryOptions.find(cat => cat.value === categoryValue);
    return found ? found.label : 'OSTALO';
  };

  const openAddModal = () => {
    setIngredientToAdd({
      id: 0,
      name: query.trim(),
      calorieNumber: 0,
      addedBy: username,
      category: 'OTHER',
    });
    setErrors({});
    setShowAddModal(true);
  };

  const handleAddIngredient = async () => {
    if (!ingredientToAdd) return;

    const newErrors: { name?: string; calorieNumber?: string } = {};
    if (!ingredientToAdd.name.trim()) {
      newErrors.name = 'Name is required.';
    }
    if (ingredientToAdd.calorieNumber <= 0) {
      newErrors.calorieNumber = 'Calories must be a positive number.';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const resp = await axios.post<IngredientDTO>(
        'http://localhost:8083/meal_plan/ingredients',
        ingredientToAdd
      );
      // odmah dodaj u recept
      onAddIngredient({ name: resp.data.name, quantity: 100 });
      setQuery('');
      setSearchResults([]);
      setShowAddModal(false);
      setIngredientToAdd(null);
      setErrors({});
    } catch (err) {
      alert('Greška pri dodavanju novog sastojka.');
    }
  };

  return (
    <div style={{ marginTop: 10 }}>
      <input
        type="text"
        placeholder="Pronađite sastojak..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="search-input"
      />

      {searchResults.length > 0 ? (
        <ul
          style={{
            maxHeight: 160,
            overflowY: 'auto',
            marginTop: 8,
            border: '1px solid #eee',
            padding: 8
          }}
        >
          {searchResults.map((ing, idx) => (
            <li
              key={idx}
              style={{ cursor: 'pointer', padding: '6px 4px' }}
              onClick={() => {
                onAddIngredient({ name: ing.name, quantity: 100 });
                setQuery('');
                setSearchResults([]);
              }}
            >
              {ing.name} {ing.category ? `— ${getCategoryTitle(ing.category)}` : ''}
            </li>
          ))}
        </ul>
      ) : query.trim().length > 0 ? (
        <div style={{ marginTop: 8 }}>
          Nije pronađen nijedan sastojak.
          <button
            className="save-button"
            onClick={openAddModal}
            style={{ marginLeft: 8 }}
          >
            ➕ Dodajte sastojak
          </button>
        </div>
      ) : null}

      {/* Modal za dodavanje novog sastojka */}
      <IngredientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        ingredient={ingredientToAdd!}
        setIngredient={setIngredientToAdd}
        errors={errors}
        onSave={handleAddIngredient}
        title="Dodajte nov sastojak"
        saveLabel="Sačuvaj"
      />
    </div>
  );
};

export default IngredientsSearch;
