import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RecipeDTO } from '../Recipe/RecipeDTO';

type RecipeSearchProps = {
  onSelectRecipe: (recipe: RecipeDTO) => void;
};

const RecipesSearch: React.FC<RecipeSearchProps> = ({ onSelectRecipe }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RecipeDTO[]>([]);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const username = user?.username || 'Korisnik';

  useEffect(() => {
    if (query.trim().length < 1) {
      setSearchResults([]);
      return;
    }

    const fetchRecipes = async () => {
      try {
        const resp = await axios.get<RecipeDTO[]>(
          `http://localhost:8084/meal_plan/recipes?username=${username}`
        );
        setSearchResults(
          (resp.data || []).filter(r =>
            r.name.toLowerCase().includes(query.toLowerCase())
          )
        );
      } catch {
        setSearchResults([]);
      }
    };

    fetchRecipes();
  }, [query]);

  return (
    <div style={{ marginTop: 10 }}>
      <input
        type="text"
        placeholder="Pronađite recept..."
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
          {searchResults.map((recipe, idx) => (
            <li
              key={idx}
              style={{ cursor: 'pointer', padding: '6px 4px' }}
              onClick={() => {
                onSelectRecipe(recipe);
                setQuery('');
                setSearchResults([]);
              }}
            >
              {recipe.name}
            </li>
          ))}
        </ul>
      ) : query.trim().length > 0 ? (
        <div style={{ marginTop: 8 }}>
          Nije pronađen nijedan recept.
        </div>
      ) : null}
    </div>
  );
};

export default RecipesSearch;
