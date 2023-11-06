window.addEventListener("scroll", () => {
  var nav = document.querySelector("nav");
  var scrollClass = "scroll";

  if (window.scrollY > 0) nav.classList.add(scrollClass);
  else nav.classList.remove(scrollClass);
});

function getRandomMeal() {
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((res) => res.json())
    .then((response) => updateRandomMeal(response));
}

function updateRandomMeal(response) {
  const meal = response.meals[0];
  console.log(meal);

  const mealImg = document.getElementById("random-meal-img");
  const mealName = document.getElementById("random-meal-name");

  const mealIngredients = document.getElementById("random-meal-ingredients");
  const mealInstructions = document.getElementById("random-meal-instructions");

  mealImg.src = meal.strMealThumb;
  mealName.innerText = meal.strMeal;

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
    ingredientElem.classList.add("meal-ingredient");

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
  console.log(meal.strInstructions);
}

getRandomMeal();
