import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PlansPage.css';
import { RecipeDTO } from '../Recipe/RecipeDTO';
import PlanBlock from './PlanBlock';
import RecipeModal from '../Recipe/RecipeModal';
import NavBar from '../NavBar/NavBar';


interface PlanMeal {
  type: string;
  recipes: any[];
}

const PlansPage: React.FC = () => {
  const [planMeals, setPlanMeals] = useState<PlanMeal[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);
  const [currentMealType, setCurrentMealType] = useState<string>('OTHER');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [editMode, setEditMode] = useState(false);
  const [recipes, setRecipes] = useState<RecipeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<'PLANS' | 'RECIPES' | 'INGREDIENTS'>('PLANS');


  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const username = user?.username || 'Korisnik';
  const targetCalories = user?.targetCalories || 2000;

  const emptyMeals = [
    { type: 'BREAKFAST', recipes: [] },
    { type: 'LUNCH', recipes: [] },
    { type: 'DINNER', recipes: [] },
    { type: 'DESERT', recipes: [] },
    { type: 'SNACK', recipes: [] },
    { type: 'OTHER', recipes: []}
  ];

  const loadPlan = async (date: string) => {
    try {
      const response = await axios.get('http://localhost:8085/meal_plan/plans', {
        params: { username, date },
      });

      const loadedMeals = emptyMeals.map(meal => ({
        ...meal,
        recipes: [],
      }));

      response.data.planRecipes?.forEach((pr: any) => {
        let type = pr.recipeCategory
        const meal = loadedMeals.find(m => m.type === type);
        if (meal) {
          meal.recipes.push({
            id: pr.recipeId,
            name: pr.name,
            caloriesNumber: pr.calories,
          });
        }
      });

      setPlanMeals(loadedMeals);
      setEditMode(false);
    } catch (error) {
      setPlanMeals(emptyMeals);
      setEditMode(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}.`;
  };
  
  const isPastDate = (dateString: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // ignoriši vreme
  const selected = new Date(dateString);
  return selected < today;
};

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleNavigate = (page: 'PLANS' | 'RECIPES' | 'INGREDIENTS') => {
    setActivePage(page);
  };

  const handleRemoveRecipe = (mealType: string, instanceId: number) => {
    setPlanMeals(prev =>
      prev.map(m =>
        m.type === mealType
          ? { ...m, recipes: m.recipes.filter(r => r.instanceId !== instanceId) }
          : m
      )
    );
  };
  

  useEffect(() => {
    loadPlan(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const calories = planMeals.flatMap(m => m.recipes).reduce((sum, r) => sum + (r.calories || r.caloriesNumber), 0);
    setTotalCalories(calories);
  }, [planMeals]);

  const openRecipeModal = (mealType: string) => {
    setCurrentMealType(mealType);
    setRecipeModalVisible(true);
  };

  const handleAddRecipe = (mealType: string, recipe: RecipeDTO) => {
    setPlanMeals(prev =>
      prev.map(m =>
        m.type === mealType
          ? {
              ...m,
              recipes: [
                ...m.recipes,
                { 
                  ...recipe,
                  calories: recipe.caloriesNumber,
                  instanceId: Date.now() 
                }
              ]
            }
          : m
      )
    );
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const recipesResp = await axios.get<RecipeDTO[]>(
          `http://localhost:8084/meal_plan/recipes?username=${username}`
        );

        const planResp = await axios.get(
          `http://localhost:8085/meal_plan/plans?username=${username}&date=${selectedDate}`
        );

        const meals: PlanMeal[] = ['BREAKFAST', 'LUNCH', 'DINNER', 'DESERT', 'SNACK', 'OTHER'
        ].map(type => ({
          type,
          recipes:
            planResp.data.planRecipes?.filter((r: any) => r.recipeCategory === type) || []
        }));

        setRecipes(recipesResp.data);
        setPlanMeals(meals);
      } catch (error) { console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, selectedDate]);

  const handleSavePlan = async () => {
    const mapCategory = (type: string) => {
      console.log(type);
      return type;
    };

    const planRecipes = planMeals.flatMap(meal =>
      meal.recipes.map(r => ({
        recipeId: r.recipeId || r.id,
        calories: r.calories || r.caloriesNumber,
        recipeCategory: mapCategory(meal.type)
      }))
    );

    const body = {
      id: 8,
      planRecipes,
      username,
      date: selectedDate
      
    };

    try {
      await axios.post('http://localhost:8085/meal_plan/plans', body);
      setEditMode(false);
    } catch (error) {
      alert('Došlo je do greške prilikom čuvanja plana.');
    }
  };

  return(
    <>
      <NavBar
        active={activePage}
        onNavigate={handleNavigate}
        username={username}
        onLogout={handleLogout}
      />
    <div className="meal-planner-page">
    <div className="plans-header">
  <h2 className="page-title">PLAN OBROKA ZA {formatDate(selectedDate)}</h2>

  <div className="header-content">
    <div className="left-section">
      <div className="calories-info">
        <p>Vaš cilj je uneti: {targetCalories} kalorija</p>
        <p>Do sada ste isplanirali {totalCalories} kalorija</p>
        <p className={`remaining-calories ${targetCalories - totalCalories < 0 ? "negative" : ""}`}>
  {targetCalories - totalCalories < 0
    ? `Prekoračili ste dnevni unos za ${Math.abs(targetCalories - totalCalories)} kalorija`
    : `Preostalo je da isplanirate ${targetCalories - totalCalories} kalorija`}
</p>    </div>

      <div className="buttons-container">
        {!editMode ? (
       <div className="button-wrapper" style={{ position: "relative", display: "inline-block" }}>
       <button
         onClick={() => {
           if (isPastDate(selectedDate)) return;
           setEditMode(true);
         }}
         className={`action-button ${isPastDate(selectedDate) ? "disabled-button" : ""}`}
       >
         Uredi
       </button>
       {isPastDate(selectedDate) && (
         <span className="tooltip">Ne možete menjati plan iz prošlih dana</span>
       )}
     </div>
     
        ) : (
          <button onClick={() => setEditMode(false)} className="action-button">
            Odustani
          </button>
        )}

        {editMode && (
          <button onClick={handleSavePlan} className="action-button">
            Sačuvaj plan
          </button>
        )}
      </div>
    </div>

    <div className="right-section">
      <input
        id="date-picker"
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="date-input"
      />
    </div>
  </div>
</div>


<div
  className="plans-content"
  style={{
    display: 'flex',
    flexWrap: 'wrap',  
    marginTop: 8,
    gap: '20px',
    overflowX: 'auto'
  }}>
        {planMeals.map(meal => (
        <PlanBlock
          key={meal.type}
          meal={meal}
          recipes={recipes}
          onAddRecipe={editMode ? (recipe) => handleAddRecipe(meal.type, recipe) : undefined}
          onCreateNewRecipe={editMode ? () => openRecipeModal(meal.type) : undefined}
          onRemoveRecipe={handleRemoveRecipe}
          username={username}
        />
      ))}
      

      <RecipeModal
        visible={recipeModalVisible}
        mode="add"
        recipe={null}
        onClose={() => setRecipeModalVisible(false)}
        onSave={(recipe) => {
          handleAddRecipe(currentMealType, recipe);
          setRecipeModalVisible(false);
        }}
      />
      </div>
      </div>
    </>
  );
};

export default PlansPage;
