// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as likesView from './views/likesView';

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

    if (id) {
        // prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search)
            searchView.highlightSelected(id);

        //create  a new recipe obj
        state.recipe = new Recipe(id);

        try {
            // get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe.recipe,
                state.likes.isLiked(id)
            );

        } catch (error) {
            console.log(error);
            alert('Oops! error processing recipe');
        }
    }

};


['hashchange', 'load'].map(event => window.addEventListener(event, controlRecipe));


/**
 * List controller
 */
const controlList = () => {
    // create a new list if there is non yet
    if (!state.list) state.list = new List();

    // add each ingredients to the list and UI
    state.recipe.ingredients.map(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from the state
        state.list.deleteItem(id);

        //delete from the UI
        listView.deleteItem(id);

        // handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});


/**
 * Likes controller
 */
// testing
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();

    const currID = state.recipe.id;

    // user has not liked current recipe
    if (!state.likes.isLiked(currID)) {
        // add like to the state
        const newLike = state.likes.addLike(
            currID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // toggle like button
        likesView.toggleLikeBtn(true);

        // add like to ui list
        likesView.renderLike(newLike);

        // user has  liked current recipe
    } else {
        // remove like from the state
        state.likes.deleteLike(currID);

        //  toggle like button
        likesView.toggleLikeBtn(false);

        // remove like from  ui list
        likesView.deleteLike(currID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // decrease btn is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingIngredients(state.recipe);
        }

    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase btn is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
    // console.log(state.recipe);
});

window.l = new List();


