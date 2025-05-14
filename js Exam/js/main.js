document.addEventListener('DOMContentLoaded', function() {
    const sideNav = document.querySelector('.side-nav');
    const toggleBtn = document.querySelector('.toggle-btn');
    const navLinks = document.querySelectorAll('.nav-link');
    const searchSection = document.getElementById('search-section');
    const contactSection = document.getElementById('contact-section');
    const mealsContainer = document.getElementById('meals-container');
    const searchByName = document.getElementById('searchByName');
    const searchByLetter = document.getElementById('searchByLetter');

    toggleBtn.addEventListener('click', () => {
        sideNav.classList.toggle('open');
        document.querySelector('.main-content').classList.toggle('nav-open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateToPage(page);
        });
    });

    async function navigateToPage(page) {
        searchSection.classList.add('d-none');
        contactSection.classList.add('d-none');
        mealsContainer.innerHTML = '';
        mealsContainer.innerHTML = '<div class="col-12 text-center"><div class="loading-spinner mx-auto"></div></div>';

        try {
            switch(page) {
                case 'search':
                    searchSection.classList.remove('d-none');
                    mealsContainer.innerHTML = '';
                    break;
                case 'categories':
                    const categories = await fetchMealCategories();
                    displayCategories(categories);
                    break;
                case 'area':
                    const areas = await fetchMealAreas();
                    displayAreas(areas);
                    break;
                case 'ingredients':
                    const ingredients = await fetchMealIngredients();
                    displayIngredients(ingredients);
                    break;
                case 'contact':
                    contactSection.classList.remove('d-none');
                    mealsContainer.innerHTML = '';
                    break;
                case 'popular':
                    const popularMeals = await fetchPopularMeals();
                    displayMeals(popularMeals);
                    break;
                case 'random':
                    const randomMeals = await fetchRandomMeals(8);
                    displayMeals(randomMeals);
                    break;
            }
        } catch (error) {
            mealsContainer.innerHTML = `<div class="col-12 text-center text-danger">Error loading content: ${error.message}</div>`;
        }
    }

    function displayCategories(categories) {
        const randomMealsCard = `
            <div class="col-md-3 mb-4">
                <div class="meal-card rounded-3 overflow-hidden position-relative" onclick="navigateToPage('random')">
                    <img src="https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg/preview" alt="Random Meals" class="w-100">
                    <div class="meal-overlay p-3 d-flex align-items-center">
                        <div class="text-center w-100">
                            <h3 class="mb-3">Random Meals</h3>
                            <p class="mb-0">Discover new recipes with our random selection of delicious meals from around the world!</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        mealsContainer.innerHTML = randomMealsCard + categories.map(category => `
            <div class="col-md-3 mb-4">
                <div class="meal-card rounded-3 overflow-hidden position-relative" onclick="fetchMealsByCategory('${category.strCategory}')">
                    <img src="${category.strCategoryThumb}" alt="${category.strCategory}" class="w-100">
                    <div class="meal-overlay p-3 d-flex align-items-center">
                        <div class="text-center w-100">
                            <h3 class="mb-3">${category.strCategory}</h3>
                            <p class="mb-0">${category.strCategoryDescription.slice(0, 100)}...</p>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function displayAreas(areas) {
        mealsContainer.innerHTML = areas.map(area => `
            <div class="col-md-3 mb-4">
                <div class="meal-card text-center p-4 rounded-3 bg-dark" onclick="fetchMealsByArea('${area.strArea}')">
                    <i class="fa-solid fa-earth-americas fa-4x mb-3"></i>
                    <h3>${area.strArea}</h3>
                </div>
            </div>
        `).join('');
    }

    function displayIngredients(ingredients) {
        mealsContainer.innerHTML = ingredients.map(ingredient => `
            <div class="col-md-3 mb-4">
                <div class="meal-card text-center p-4 rounded-3 bg-dark" onclick="fetchMealsByIngredient('${ingredient.strIngredient}')">
                    <i class="fa-solid fa-drumstick-bite fa-4x mb-3"></i>
                    <h3 class="mb-3">${ingredient.strIngredient}</h3>
                    <p class="mb-0">${ingredient.strDescription ? ingredient.strDescription.slice(0, 100) + '...' : ''}</p>
                </div>
            </div>
        `).join('');
    }

    function displayMeals(meals) {
        if (!meals) {
            mealsContainer.innerHTML = '<div class="col-12 text-center">No meals found</div>';
            return;
        }

        mealsContainer.innerHTML = meals.map(meal => `
            <div class="col-md-3 mb-4">
                <div class="meal-card rounded-3 overflow-hidden position-relative" onclick="showRecipeDetails('${meal.idMeal}')">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-100">
                    <div class="meal-overlay d-flex align-items-center justify-content-center">
                        <h3 class="text-center px-3">${meal.strMeal}</h3>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async function showRecipeDetails(mealId) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
            const data = await response.json();
            const meal = data.meals[0];
    
            const ingredients = [];
            for (let i = 1; i <= 20; i++) {
                if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== '') {
                    ingredients.push({
                        ingredient: meal[`strIngredient${i}`],
                        measure: meal[`strMeasure${i}`] || ''
                    });
                }
            }
    
            const tags = meal.strTags ? meal.strTags.split(',').map(tag => tag.trim()) : [];
    
            const recipeDetails = document.getElementById('recipeDetails');
            recipeDetails.innerHTML = `
                <div class="row">
                    <div class="col-md-4">
                        <img src="${meal.strMealThumb}" class="w-100 rounded-3" alt="${meal.strMeal}">
                        <div class="mt-3">
                            <h5>Category: <span class="badge bg-secondary">${meal.strCategory}</span></h5>
                            <h5>Area: <span class="badge bg-secondary">${meal.strArea}</span></h5>
                            ${tags.length > 0 ? `
                                <h5>Tags:</h5>
                                <div class="d-flex flex-wrap">
                                    ${tags.map(tag => `<span class="badge bg-primary me-2 mb-2">${tag}</span>`).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="col-md-8">
                        <h2 class="mb-3">${meal.strMeal}</h2>
                        <h4>Ingredients:</h4>
                        <ul class="list-group mb-4">
                            ${ingredients.map(ing => `
                                <li class="list-group-item bg-dark text-light border-secondary">
                                    <i class="fas fa-utensils me-2 text-primary"></i>
                                    <strong>${ing.ingredient}:</strong> ${ing.measure}
                                </li>
                            `).join('')}
                        </ul>
                        <h4>Instructions:</h4>
                        <div class="mb-4">
                            ${meal.strInstructions.split('\r\n').map(para => `<p>${para}</p>`).join('')}
                        </div>
                        <div class="d-flex flex-wrap">
                            ${meal.strSource ? `
                                <a href="${meal.strSource}" class="btn btn-primary me-2 mb-2" target="_blank">
                                    <i class="fas fa-external-link-alt me-2"></i>Source
                                </a>
                            ` : ''}
                            ${meal.strYoutube ? `
                                <a href="${meal.strYoutube}" class="btn btn-danger mb-2" target="_blank">
                                    <i class="fab fa-youtube me-2"></i>YouTube
                                </a>
                            ` : ''}
                        </div>
                        ${meal.strYoutube ? `
                            <div class="ratio ratio-16x9 mt-4">
                                <iframe src="${meal.strYoutube.replace('watch?v=', 'embed/')}" allowfullscreen></iframe>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
    
            const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
            recipeModal.show();
        } catch (error) {
            console.error('Error fetching recipe details:', error);
        }
    }

    window.showRecipeDetails = showRecipeDetails;

    searchByName.addEventListener('input', async function() {
        if (this.value.trim().length > 0) {
            const meals = await searchMealByName(this.value);
            displayMeals(meals);
        } else {
            mealsContainer.innerHTML = '';
        }
    });

    searchByLetter.addEventListener('input', async function() {
        if (this.value.trim().length === 1) {
            const meals = await searchMealByFirstLetter(this.value);
            displayMeals(meals);
        } else {
            mealsContainer.innerHTML = '';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateToPage(page);
        });
    });

    navigateToPage('categories');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            sideNav.classList.remove('open');
            document.querySelector('.main-content').classList.remove('nav-open');
        });
    });
});

async function fetchMealsByCategory(category) {
    mealsContainer.innerHTML = '<div class="col-12 text-center"><div class="loading-spinner mx-auto"></div></div>';
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const data = await response.json();
        const meals = data.meals ? data.meals.slice(0, 20) : [];
        displayMeals(meals);
    } catch (error) {
        mealsContainer.innerHTML = `<div class="col-12 text-center text-danger">Error loading meals: ${error.message}</div>`;
    }
}

async function fetchMealsByArea(area) {
    mealsContainer.innerHTML = '<div class="col-12 text-center"><div class="loading-spinner mx-auto"></div></div>';
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        const data = await response.json();
        const meals = data.meals ? data.meals.slice(0, 20) : [];
        displayMeals(meals);
    } catch (error) {
        mealsContainer.innerHTML = `<div class="col-12 text-center text-danger">Error loading meals: ${error.message}</div>`;
    }
}

async function fetchMealsByIngredient(ingredient) {
    mealsContainer.innerHTML = '<div class="col-12 text-center"><div class="loading-spinner mx-auto"></div></div>';
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        const data = await response.json();
        const meals = data.meals ? data.meals.slice(0, 20) : [];
        displayMeals(meals);
    } catch (error) {
        mealsContainer.innerHTML = `<div class="col-12 text-center text-danger">Error loading meals: ${error.message}</div>`;
    }
}

window.fetchMealsByCategory = fetchMealsByCategory;
window.fetchMealsByArea = fetchMealsByArea;
window.fetchMealsByIngredient = fetchMealsByIngredient;
