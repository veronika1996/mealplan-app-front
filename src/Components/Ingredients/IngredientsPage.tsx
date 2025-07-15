import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './IngredientsPage.css';
import { IngredientDTO } from './IngredientDTO';
import {
  FaAppleAlt,
  FaCarrot,
  FaDrumstickBite,
  FaCheese,
  FaBreadSlice,
  FaPepperHot,
  FaWineBottle,
  FaLeaf,
  FaUtensilSpoon,
  FaGlassWhiskey,
  FaUtensils,
  FaSeedling,
  FaTint,
  FaQuestion,
  FaEdit,
  FaTrash,
  FaSearch,
} from 'react-icons/fa';

const categoryIcons: Record<string, JSX.Element> = {
  FRUIT: <FaAppleAlt title="Fruit" />,
  VEGETABLE: <FaCarrot title="Vegetable" />,
  MEAT: <FaDrumstickBite title="Meat" />,
  DAIRY: <FaCheese title="Dairy" />,
  BREAD: <FaBreadSlice title="Bread" />,
  SPICE: <FaPepperHot title="Spice" />,
  SAUCE: <FaUtensilSpoon title="Sauce" />,
  JUICE: <FaGlassWhiskey title="Juice" />,
  ALCOHOL: <FaWineBottle title="Alcohol" />,
  PASTA: <FaUtensils title="Pasta" />,
  RICE: <FaSeedling title="Rice" />,
  FLOUR: <FaLeaf title="Flour" />,
  OIL: <FaTint title="Oil" />,
  OTHER: <FaQuestion title="Other" />,
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

  const username = localStorage.getItem('username') || 'User';

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await axios.get<IngredientDTO[]>('http://localhost:8083/meal_plan/ingredients');
      setIngredients(response.data);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  // Kombinacija filtera i pretrage
  const filteredIngredients = ingredients.filter(i => {
    const matchesCategory = filterCategory ? i.category === filterCategory : true;
    const matchesSearch = i.name.toLowerCase().startsWith(searchName.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDeleteConfirmed = async () => {
    if (!ingredientToDelete) return;
    try {
      await axios.delete(`http://localhost:8083/meal_plan/ingredients/${ingredientToDelete.name}`);
      setIngredients(ingredients.filter(i => i.name !== ingredientToDelete.name));
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
      await axios.put(
        `http://localhost:8083/meal_plan/ingredients/${ingredientToEdit.name}`,
        ingredientToEdit
      );
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
      <header className="topbar">
        <div className="username">Hello, {username}</div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      <div className="ingredients-container">
        <div className="top-controls">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="add-button" onClick={openAddModal}>➕ Add Ingredient</button>
        </div>

        <div className="filter-tags">
          {Object.keys(categoryIcons).map(cat => (
            <button
              key={cat}
              className={`filter-tag ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
            >
              {categoryIcons[cat]}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {filteredIngredients.length === 0 ? (
          <p className="empty-text">No ingredients found.</p>
        ) : (
          <table className="ingredients-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Calories</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIngredients.map((ingredient) => (
                <tr key={ingredient.name}>
                  <td>{ingredient.name}</td>
                  <td>{ingredient.calorieNumber}</td>
                  <td className="icon-cell">
                    {categoryIcons[ingredient.category] || categoryIcons['OTHER']}
                    <span className="icon-label">{ingredient.category}</span>
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
        )}
      </div>

      {showEditModal && ingredientToEdit && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Edit Ingredient</h3>
            <label>Name:</label>
            <input type="text" value={ingredientToEdit.name} readOnly disabled />
            <label>Calories:</label>
            <input
              type="number"
              min={0}
              value={ingredientToEdit.calorieNumber}
              onChange={e => setIngredientToEdit({ ...ingredientToEdit, calorieNumber: Number(e.target.value) })}
            />
            <label>Category:</label>
            <select
              value={ingredientToEdit.category}
              onChange={e => setIngredientToEdit({ ...ingredientToEdit, category: e.target.value })}
            >
              {Object.keys(categoryIcons).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="modal-buttons">
              <button onClick={handleSave} className="save-button">Save</button>
              <button onClick={() => setShowEditModal(false)} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && ingredientToEdit && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Add New Ingredient</h3>
            <label>Name:</label>
            <input
              type="text"
              value={ingredientToEdit.name}
              onChange={e => {
                setIngredientToEdit({ ...ingredientToEdit, name: e.target.value });
                setErrors(prev => ({ ...prev, name: undefined }));
              }}
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
            <label>Calories:</label>
            <input
              type="number"
              min={0}
              value={ingredientToEdit.calorieNumber}
              onChange={e => {
                setIngredientToEdit({ ...ingredientToEdit, calorieNumber: Number(e.target.value) });
                setErrors(prev => ({ ...prev, calorieNumber: undefined }));
              }}
            />
            {errors.calorieNumber && <div className="error-text">{errors.calorieNumber}</div>}
            <label>Category:</label>
            <select
              value={ingredientToEdit.category}
              onChange={e => setIngredientToEdit({ ...ingredientToEdit, category: e.target.value })}
            >
              {Object.keys(categoryIcons).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="modal-buttons">
              <button onClick={handleAdd} className="save-button">Add</button>
              <button onClick={() => setShowAddModal(false)} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && ingredientToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Delete Ingredient</h3>
            <p>Are you sure you want to delete <strong>{ingredientToDelete.name}</strong>?</p>
            <div className="modal-buttons">
              <button onClick={handleDeleteConfirmed} className="save-button">Delete</button>
              <button onClick={() => setShowDeleteModal(false)} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IngredientsPage;
