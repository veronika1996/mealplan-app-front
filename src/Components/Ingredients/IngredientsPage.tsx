import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './IngredientsPage.css';
import { IngredientDTO } from './IngredientDTO';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import IngredientModal from './IngredientModal';

import {
  FaAppleAlt, FaCarrot, FaDrumstickBite, FaCheese, FaBreadSlice, FaPepperHot,
  FaWineBottle, FaLeaf, FaUtensilSpoon, FaGlassWhiskey, FaUtensils, FaSeedling,
  FaTint, FaQuestion
} from 'react-icons/fa';
import NavBar from '../NavBar/NavBar';

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

type SortConfig = {
  key: keyof IngredientDTO;
  direction: 'asc' | 'desc';
};

const IngredientsPage: React.FC = () => {
  const [ingredients, setIngredients] = useState<IngredientDTO[]>([]);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [searchName, setSearchName] = useState<string>('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [ingredientToEdit, setIngredientToEdit] = useState<IngredientDTO | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState<IngredientDTO | null>(null);
  const [errors, setErrors] = useState<{ name?: string; calorieNumber?: string }>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const [activePage, setActivePage] = useState<'PLANS' | 'RECIPES' | 'INGREDIENTS'>('INGREDIENTS');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const username = user?.username || 'Korisnik';

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleNavigate = (page: 'PLANS' | 'RECIPES' | 'INGREDIENTS') => {
    setActivePage(page);
  };

  const fetchIngredients = async () => {
    try {
      const response = await axios.get<IngredientDTO[]>(`http://localhost:8083/meal_plan/ingredients?username=${username}`);
      setIngredients(response.data);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  const requestSort = (key: keyof IngredientDTO) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedIngredients = React.useMemo(() => {
    const sortableIngredients = [...ingredients];
    if (sortConfig !== null) {
      sortableIngredients.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        } else {
          return 0;
        }
      });
    }
    return sortableIngredients;
  }, [ingredients, sortConfig]);

  const filteredIngredients = sortedIngredients.filter(i => {
    const matchesCategory = filterCategory ? i.category === filterCategory : true;
    const matchesSearch = i.name.toLowerCase().startsWith(searchName.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Paginacija
  const totalPages = Math.max(Math.ceil(filteredIngredients.length / itemsPerPage), 1);
  const paginatedIngredients = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredIngredients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredIngredients, currentPage]);

  const handleDeleteConfirmed = async () => {
    if (!ingredientToDelete) return;
    try {
      await axios.delete(`http://localhost:8083/meal_plan/ingredients?id=${ingredientToDelete.id}`);
      setIngredients(ingredients.filter(i => i.id !== ingredientToDelete.id));
      setShowDeleteModal(false);
      setIngredientToDelete(null);
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      alert('Failed to delete ingredient.');
    }
  };

  const handleSave = async () => {
    if (!ingredientToEdit) return;
    try {
      await axios.put(`http://localhost:8083/meal_plan/ingredients/${ingredientToEdit.name}`, ingredientToEdit);
      setIngredients((prev) =>
        prev.map(i => (i.name === ingredientToEdit.name ? ingredientToEdit : i))
      );
      setShowEditModal(false);
      setIngredientToEdit(null);
    } catch (error) {
      console.error('Error saving ingredient:', error);
      alert('Failed to save ingredient.');
    }
  };

  const handleAdd = async () => {
    if (!ingredientToEdit) return;
    const newErrors: { name?: string; calorieNumber?: string } = {};
    if (!ingredientToEdit.name.trim()) {
      newErrors.name = 'Name is required.';
    }
    if (ingredientToEdit.calorieNumber <= 0) {
      newErrors.calorieNumber = 'Calories must be a positive number.';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8083/meal_plan/ingredients`, ingredientToEdit);
      setIngredients((prev) => [...prev, response.data]);
      setShowAddModal(false);
      setIngredientToEdit(null);
      setErrors({});
    } catch (error) {
      console.error('Error adding ingredient:', error);
      alert('Failed to add ingredient.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const openAddModal = () => {
    setIngredientToEdit({
      id: 0,
      name: '',
      calorieNumber: 0,
      addedBy: username,
      category: 'OTHER',
    });
    setErrors({});
    setShowAddModal(true);
  };

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
              placeholder="Pronađite sastojak po imenu..."
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="add-button" onClick={openAddModal}>➕ Dodajte nov sastojak</button>
        </div>

        <div className="filter-tags">
          {Object.keys(categoryIcons).map(cat => (
            <button
              key={cat}
              className={`filter-tag ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
            >
              {categoryIcons[cat]}
              <span> {(categoryIcons[cat] as any).props.title || 'OSTALO'}</span>
            </button>
          ))}
        </div>

        {filteredIngredients.length === 0 ? (
          <p className="empty-text">Nijedan sastojak nije pronađen.</p>
        ) : (
          <>
            <table className="ingredients-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort('name')}>
                    Ime {sortConfig?.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                  </th>
                  <th onClick={() => requestSort('calorieNumber')}>
                    Broj kalorija na 100g {sortConfig?.key === 'calorieNumber' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                  </th>
                  <th onClick={() => requestSort('category')}>
                    Kategorija {sortConfig?.key === 'category' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginatedIngredients.map((ingredient) => (
                  <tr key={ingredient.name}>
                    <td>{ingredient.name}</td>
                    <td>{ingredient.calorieNumber}</td>
                    <td className="icon-cell">
                      {categoryIcons[ingredient.category] || categoryIcons['OTHER']}
                      <span className="icon-label">{(categoryIcons[ingredient.category] as any).props.title || 'OSTALO'}</span>
                    </td>
                    <td>
                      <FaEdit
                        className="icon-button"
                        title="Edit"
                        onClick={() => { setIngredientToEdit(ingredient); setShowEditModal(true); }}
                      />
                      <FaTrash
                        className="icon-button"
                        title="Delete"
                        onClick={() => { setIngredientToDelete(ingredient); setShowDeleteModal(true); }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginacija uvek vidljiva */}
            <div className="pagination">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}> ◀ </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={page === currentPage ? 'active' : ''}
                >
                  {page}
                </button>
              ))}
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}> ▶</button>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <IngredientModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        ingredient={ingredientToEdit!}
        setIngredient={setIngredientToEdit}
        errors={{}}
        onSave={handleSave}
        title="Izmenite sastojak"
        readOnlyName
      />

      <IngredientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        ingredient={ingredientToEdit!}
        setIngredient={setIngredientToEdit}
        errors={errors}
        onSave={handleAdd}
        title="Dodajte nov sastojak"
        saveLabel="Add"
      />

      {showDeleteModal && ingredientToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Brisanje sastojka</h3>
            <p>Da li ste sigurni da želite da obrišete sastojak <strong>{ingredientToDelete.name}</strong>?</p>
            <div className="modal-buttons">
              <button onClick={handleDeleteConfirmed} className="save-button">Obrišite</button>
              <button onClick={() => setShowDeleteModal(false)} className="cancel-button">Odustanite</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IngredientsPage;
