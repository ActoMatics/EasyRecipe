// Global app controller
import Search from './models/Search';
import * as searchView from './views/SearchView';
import * as recipeView from './views/RecipeView';
import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/Recipe';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**Search controller */
const controlSearch = async () => {
    // get query from the view
    const query = searchView.getInput();

    if (query) {
        // new search obj and add to state
        state.search = new Search(query);

        // prepare UI for the results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // search for recipes
            await state.search.getResults();

            // render results on the UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            console.log(error);
            alert('Oops something went wrong');
            clearLoader();
        }
    }

};


elements.searchForm.addEventListener('submit', e => {
    // preventing default auto page loading upon submitting
    e.preventDefault();
    //adding support for 'enter' keyCodes
    if (e.keyCode === 13 || e.which === 13)
        controlSearch();

    controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});


const controlRecipe = async () => {
    // get id from the url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        //create  a new recipe obj
        state.recipe = new Recipe(id);

        try {
            // get recipe data and parse ingredients
            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);    
            
        } catch (error) {
            console.log(error);
            alert('Oops! error processing recipe');
        }
    }

};

/**Recipe controller */
['hashchange', 'load'].map(event => window.addEventListener(event, controlRecipe));