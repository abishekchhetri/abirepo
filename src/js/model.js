// import { async } from 'regenerator-runtime';
import { API_KEY, API_URL, RESULTS_PER_PAGE } from './config';
import { AJAX } from './helper';
export let state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    pages: 1,
  },
  bookmark: [],
};

export async function loadRecipe(hash) {
  try {
    const data = await AJAX(`${API_URL}/${hash.slice(1)}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data);
    if (state.bookmark.some(val => val.id === state.recipe.id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
}

export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.results = data.data.recipes.map(val => ({
      id: val.id,
      imageUrl: val.image_url,
      publisher: val.publisher,
      title: val.title,
      ...(val.key && { key: val.key }),
    }));
  } catch (err) {
    throw err;
  }
};

//implementing the pagination
export const getSearchResultsPage = function (page = pages) {
  state.search.pages = page;
  let start = (page - 1) * state.search.resultsPerPage;
  let end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(val => {
    val.quantity = (val.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

export const createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    imageUrl: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    //we added key to our custom recipe because it requires so we can know what is our own recipe !
    ...(recipe.key && { key: recipe.key }),
  };
};
//adding the bookmarks
export const addBookmark = function (recipe) {
  state.bookmark.push(recipe);
  if (state.recipe.id === recipe.id) state.recipe.bookmarked = true;
  persistBookmark();
};

export const deleteBookmark = function (id) {
  const idx = state.bookmark.findIndex(val => val.id === id);
  state.bookmark.splice(idx, 1);
  state.recipe.bookmarked = false;
  persistBookmark();
};

//saving the bookmark to the localstorage
const persistBookmark = function () {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmark));
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(val => val[0].startsWith('ingredient') && val[1] != '')
      .map(val => {
        const arr = val[1].split(',');
        if (arr.length < 3) throw new Error(`Invalid recipe format ! `);
        const [quantity, unit, description] = val[1].split(',');
        return {
          quantity: quantity === '' ? null : +quantity,
          unit: unit,
          description: description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const respData = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    console.log(respData);

    state.recipe = createRecipeObject(respData);
    addBookmark(state.recipe);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmark');
  if (storage) state.bookmark = JSON.parse(storage);
};

init();
