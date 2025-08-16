import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Ingredients/IngredientsPage.css';

import { RecipeDTO, RecipeCategory } from './RecipeDTO';
import RecipeModal from './RecipeModal';

import {
  FaEye,
  FaTrash,
  FaSearch,
  FaUtensils,
  FaPlus,
} from 'react-icons/fa';
import NavBar from '../NavBar/NavBar';

const categoryIcons: Record<string, { icon: JSX.Element; label: string }> = {
  BREAKFAST: { icon: <FaUtensils title="Doručak" />, label: "DORUČAK" },
  LUNCH: { icon: <FaUtensils title="Ručak" />, label: "RUČAK" },
  DINNER: { icon: <FaUtensils title="Večera" />, label: "VEČERA" },
  SNACK: { icon: <FaUtensils title="Užina" />, label: "UŽINA" },
  OTHER: { icon: <FaUtensils title="Ostalo" />, label: "OSTALO" },
  DESERT: { icon: <FaUtensils title="Dezert" />, label: "DEZERT" },
};

type SortConfig = {
  key: keyof RecipeDTO;
  direction: 'asc' | 'desc';
};

const RecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeDTO[]>([]);
  const [filterCategory, setFilterCategory] = useState<RecipeCategory | null>(null);
  const [searchName, setSearchName] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<RecipeDTO | null>(null);

  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDTO | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'add' | 'edit'>('view');

  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const [activePage, setActivePage] = useState<'PLANS' | 'RECIPES' | 'INGREDIENTS'>('INGREDIENTS');


  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const username = user?.username || 'Korisnik';

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (showRecipeModal) {
      setModalMode('view'); // svaki put kad se modal otvori ide u view mode
    }
  }, [showRecipeModal]);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get<RecipeDTO[]>(`http://localhost:8084/meal_plan/recipes?username=${username}`);
      setRecipes(response.data);
    } catch (error) {
      console.error('Greška prilikom učitavanja recepata:', error);
    }
  };

  const handleNavigate = (page: 'PLANS' | 'RECIPES' | 'INGREDIENTS') => {
    setActivePage(page);
  };


  const openViewModal = (recipe: RecipeDTO) => {
    setSelectedRecipe(recipe);
    setModalMode('view');
    setShowRecipeModal(true);
  };

  const openAddModal = () => {
    setSelectedRecipe(null);
    setModalMode('add');
    setShowRecipeModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!recipeToDelete) return;
    try {
      await axios.delete(`http://localhost:8084/meal_plan/recipes?id=${recipeToDelete.id}`);
      setRecipes(recipes.filter(r => r.id !== recipeToDelete.id));
      setShowDeleteModal(false);
      setRecipeToDelete(null);
    } catch (error) {
      console.error('Greška prilikom brisanja recepta:', error);
      alert('Brisanje recepta nije uspelo.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const requestSort = (key: keyof RecipeDTO) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const filteredRecipes = recipes.filter(r => {
    const matchesCategory = filterCategory ? r.category === filterCategory : true;
    const matchesSearch = r.name.toLowerCase().startsWith(searchName.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedRecipes = React.useMemo(() => {
    let sortable = [...filteredRecipes];
    sortable.sort((a, b) => {
      const aVal = a[sortConfig.key] ?? '';
      const bVal = b[sortConfig.key] ?? '';
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
    return sortable;
  }, [filteredRecipes, sortConfig]);

  return (
    <>
        <NavBar
  active={activePage}
  onNavigate={handleNavigate}
  username={username}
  onLogout={handleLogout}
/>

      <div className="ingredients-container">
        <div className="top-controls">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Pretraži po nazivu..."
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            className="add-button"
            onClick={openAddModal}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FaPlus /> Dodaj recept
          </button>
        </div>

        <div className="filter-tags">
          {Object.keys(categoryIcons).map(cat => (
            <button
              key={cat}
              className={`filter-tag ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(filterCategory === cat ? null : (cat as RecipeCategory))}
            >
              {categoryIcons[cat].icon}
              <span>{categoryIcons[cat].label}</span>
            </button>
          ))}
        </div>

        {sortedRecipes.length === 0 ? (
          <p className="empty-text">Nema pronađenih recepata.</p>
        ) : (
          <table className="ingredients-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('name')}>
                  Naziv {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('caloriesNumber')}>
                  Kalorije po porciji {sortConfig.key === 'caloriesNumber' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('category')}>
                  Kategorija {sortConfig.key === 'category' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('numberOfPortions')}>
                  Broj porcija {sortConfig.key === 'numberOfPortions' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sortedRecipes.map(recipe => (
                <tr key={recipe.id}>
                  <td>{recipe.name}</td>
                  <td>{recipe.caloriesNumber}</td>
                  <td className="icon-cell">
                    {categoryIcons[recipe.category]?.icon || categoryIcons['OTHER'].icon}
                    <span className="icon-label">{categoryIcons[recipe.category]?.label || categoryIcons['OTHER'].label}</span>
                  </td>
                  <td>{recipe.numberOfPortions}</td>
                  <td>
                    <FaEye
                      className="icon-button"
                      title="Prikaži recept"
                      onClick={() => openViewModal(recipe)}
                    />
                    <FaTrash
                      className="icon-button"
                      title="Obriši recept"
                      onClick={() => { setRecipeToDelete(recipe); setShowDeleteModal(true); }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <RecipeModal
        visible={showRecipeModal}
        mode={modalMode}
        recipe={selectedRecipe}
        onClose={() => setShowRecipeModal(false)}
        onSave={async (recipe, mode) => {
          try {
            if (mode === 'add') {
              await axios.post('http://localhost:8084/meal_plan/recipes', recipe);
            } else if (mode === 'edit') {
              await axios.put(`http://localhost:8084/meal_plan/recipes?id=${recipe.id}`, recipe);
            }
            setShowRecipeModal(false);
            await fetchRecipes();
          } catch (error) {
            console.error('Greška prilikom čuvanja recepta:', error);
            alert('Čuvanje recepta nije uspelo.');
          }
        }}
      />

      {showDeleteModal && recipeToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Brisanje recepta</h3>
            <p>Da li ste sigurni da želite da obrišete <strong>{recipeToDelete.name}</strong>?</p>
            <div className="modal-buttons">
              <button onClick={handleDeleteConfirmed} className="save-button">Obriši</button>
              <button onClick={() => setShowDeleteModal(false)} className="cancel-button">Otkaži</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecipesPage;
