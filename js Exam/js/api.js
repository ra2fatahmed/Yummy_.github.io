// api.js

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

async function fetchMealCategories() {
    const response = await fetch(`${BASE_URL}/categories.php`);
    const data = await response.json();
    return data.categories || [];
}

async function fetchMealAreas() {
    const response = await fetch(`${BASE_URL}/list.php?a=list`);
    const data = await response.json();
    return data.meals || [];
}

async function fetchMealIngredients() {
    const response = await fetch(`${BASE_URL}/list.php?i=list`);
    const data = await response.json();
    return data.meals.slice(0, 20) || []; // limit to 20 for UI clarity
}

async function searchMealByName(name) {
    const response = await fetch(`${BASE_URL}/search.php?s=${name}`);
    const data = await response.json();
    return data.meals || [];
}

async function searchMealByFirstLetter(letter) {
    const response = await fetch(`${BASE_URL}/search.php?f=${letter}`);
    const data = await response.json();
    return data.meals || [];
}

async function searchMealByCategory(category) {
    const response = await fetch(`${BASE_URL}/filter.php?c=${category}`);
    const data = await response.json();
    return data.meals || [];
}

async function searchMealByArea(area) {
    const response = await fetch(`${BASE_URL}/filter.php?a=${area}`);
    const data = await response.json();
    return data.meals || [];
}

async function searchMealByIngredient(ingredient) {
    const response = await fetch(`${BASE_URL}/filter.php?i=${ingredient}`);
    const data = await response.json();
    return data.meals || [];
}

async function fetchRandomMeals(count) {
    const meals = [];
    for (let i = 0; i < count; i++) {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
        const data = await response.json();
        if (data.meals && data.meals[0]) {
            meals.push(data.meals[0]);
        }
    }
    return meals;
}
