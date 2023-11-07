const loader = document.getElementById("loader");

window.addEventListener("scroll", () => {
  var nav = document.querySelector("nav");
  var scrollClass = "scroll";

  if (window.scrollY > 0) nav.classList.add(scrollClass);
  else nav.classList.remove(scrollClass);
});

function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

function getRandomMeal() {
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((res) => res.json())
    .then((response) => updateRandomMeal(response));
}

function updateRandomMeal(response) {
  const meal = response.meals[0];

  const randomMealImg = document.getElementById("random-meal-img");
  const randomMealName = document.getElementById("random-meal-name");

  randomMealImg.src = meal.strMealThumb;
  randomMealName.innerText = meal.strMeal;

  const modalMealImg = document.getElementById("modal-meal-img");
  const modalMealName = document.getElementById("modal-meal-name");

  const mealIngredients = document.getElementById("modal-meal-ingredients");
  const mealInstructions = document.getElementById("modal-meal-instructions");

  modalMealImg.src = meal.strMealThumb;
  modalMealName.innerText = meal.strMeal;

  const ingredientMeasurePairs = [];

  for (let num = 1; num <= 20; num++) {
    const ingredientKey = `strIngredient${num}`;
    const measureKey = `strMeasure${num}`;

    if (meal[ingredientKey] && meal[measureKey]) {
      const ingredient = meal[ingredientKey];
      const measure = meal[measureKey];

      ingredientMeasurePairs.push([ingredient, measure]);
    }
  }

  for (let i = 0; i < ingredientMeasurePairs.length; i++) {
    const pair = ingredientMeasurePairs[i];

    let ingredientElem = document.createElement("div");
    ingredientElem.classList.add("modal-ingredient");

    let ingredientImgElem = document.createElement("img");
    ingredientImgElem.src = `https://www.themealdb.com/images/ingredients/${pair[0]}-Small.png`;

    let ingredientNameElem = document.createElement("span");
    ingredientNameElem.classList.add("meal-ingredient-name");
    ingredientNameElem.innerHTML = pair[0] + "<br>" + pair[1];

    ingredientElem.appendChild(ingredientImgElem);
    ingredientElem.appendChild(ingredientNameElem);
    mealIngredients.appendChild(ingredientElem);
  }

  mealInstructions.innerText = meal.strInstructions;

  hideLoader();
}

getRandomMeal();

const randomMealCard = document.getElementById("random-meal");
const modalContainer = document.getElementsByClassName("modal-container")[0];

let isModalOpen = false;

randomMealCard.addEventListener("click", () => {
  if (!isModalOpen) {
    modalContainer.style.display = "block";
    document.body.style.overflow = "hidden";
    isModalOpen = true;
  } else {
    modalContainer.style.display = "none";
    document.body.style.overflow = "auto";
    isModalOpen = false;
  }
});

const modalCloseBtn = document.getElementsByClassName("modal-close-btn")[0];
modalCloseBtn.addEventListener("click", () => {
  modalContainer.style.display = "none";
  document.body.style.overflow = "auto";
  isModalOpen = false;
});

const modalClose = document.getElementsByClassName("modal-close")[0];
modalClose.addEventListener("click", () => {
  modalContainer.style.display = "none";
  document.body.style.overflow = "auto";
  isModalOpen = false;
});

const getNewMealBtn = document.getElementById("get-new-meal");
getNewMealBtn.addEventListener("click", () => {
  showLoader();
  getRandomMeal();
});

async function fetchSearchResult(query) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
  );

  if (!response.ok)
    throw new Error(`Failed to fetch data. Status: ${response.status}`);

  return response.json();
}

const searchSection = document.getElementById("search");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchQuery = document.getElementsByClassName("search-query")[0];

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = searchInput.value;
  searchQuery.innerText = query;

  if (query.trim() === "") alert("Please enter a valid search query.").f;
  else {
    showLoader();

    fetchSearchResult(query)
      .then((result) => displaySearchResult(result))
      .catch((error) => {
        console.error("An error occurred:", error);
      })
      .finally(() => hideLoader());
  }
});

const searchResults = document.getElementsByClassName("search-results")[0];
const resultsDiv = document.getElementById("results");

function displaySearchResult(result) {
  const meals = result.meals;
  console.log(meals);

  searchResults.classList.remove("hidden");
  searchSection.classList.add("result-found");

  resultsDiv.innerHTML = "";

  if (meals && meals.length > 0) {
    meals.forEach((meal) => {
      const mealDiv = document.createElement("div");
      mealDiv.classList.add("result-meal");

      const mealName = document.createElement("h3");
      mealName.textContent = meal.strMeal;

      const mealImage = document.createElement("img");
      mealImage.src = meal.strMealThumb;
      mealImage.alt = meal.strMeal;

      mealDiv.appendChild(mealName);
      mealDiv.appendChild(mealImage);

      resultsDiv.appendChild(mealDiv);
    });
  } else {
    resultsDiv.textContent = "No results found.";
  }
}
