import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as data from './model.js'; //data from the model itself
import recipeView from './recipeView.js';
import searchView from './searchView.js';
import resultView from './resultView.js';
import paginationView from './paginationView.js';
import bookmarksView from './bookmarksView.js';
import addRecipeView from './addRecipeView.js';
import { MODAL_TIMEOUT } from './config.js';
//hot moduling in action
// if (module.hot) module.hot.accept();
const showRecipe = async function () {
  //fetching recipe
  try {
    recipeView.renderSpinner();
    const hash = window.location.hash;
    if (!hash) {
      recipeView.renderSuccess();
      return;
    }
    await data.loadRecipe(hash);
    recipeView.render(data.state.recipe);
    controlServings(3);

    if (data.getSearchResultsPage(1).length === 0) return;

    resultView.render(data.getSearchResultsPage(1));
    bookmarksView.render(data.state.bookmark);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};
showRecipe();

//we are controlling the flow of data from the model here of the search results actually
const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    await data.loadSearchResults(query);
    resultView.renderSpinner();
    resultView.render(data.getSearchResultsPage(1));
    paginationView.render(data.state.search);
    bookmarksView.render(data.state.bookmark);
  } catch (err) {
    console.log(err);
    console.error(err);
  }
};

const controlPagination = function (pageNumber) {
  resultView.render(data.getSearchResultsPage(pageNumber));
  paginationView.render(data.state.search);
};

const controlServings = function (servings) {
  data.updateServings(servings);
  // recipeView.render(data.state.recipe);
  recipeView.update(data.state.recipe);
};
//the way subscriber publisher pattern work is, since window is the part of dom itself we shall isolate it in the recipeView hence I can actually only have to do is that i need to pass function directly to the recipe view and work is done here actually

//bookmarking the recipe section
const controlAddBookmark = function () {
  if (data.state.recipe.bookmarked) data.deleteBookmark(data.state.recipe.id);
  else data.addBookmark(data.state.recipe);

  bookmarksView.render(data.state.bookmark);
  recipeView.update(data.state.recipe);
};

//best approach tbh nice!!
const controlBookmark = function () {
  bookmarksView.render(data.state.bookmark);
};

//use the upload button to get data of form
const controlAddRecipe = async function (newRecipe) {
  try {
    //render spinner
    addRecipeView.renderSpinner();

    //render message
    await data.uploadRecipe(newRecipe);
    recipeView.render(data.state.recipe);
    //pushing the id to url of browser
    window.history.pushState(null, '', `#${data.state.recipe.id}`);
    setTimeout(() => {
      addRecipeView.renderSuccess();
      addRecipeView._toggleHandler();
      bookmarksView.render(data.state.bookmark);
    }, MODAL_TIMEOUT * 1000);

    console.log(data.state.recipe);
  } catch (err) {
    addRecipeView.renderError(err);
  }
};
//init is where we would bind our handler from the view by passing hte function simply
const init = function () {
  addRecipeView.addHandlerUpload(controlAddRecipe);
  bookmarksView.addHandlerRender(controlBookmark);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerRender(showRecipe);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  console.log('version 1.0');
  console.log('version 1 improvement done!!');
};

init();
