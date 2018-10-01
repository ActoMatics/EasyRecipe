import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            let getRecipe = 'https://www.food2fork.com/api/get';
            let searchRecipe = 'https://www.food2fork.com/api/search';

            const key = '6581e47d4bf6ed80f6b99291808ec81c';
            const res = await axios.get(searchRecipe + `?key=${key}&${this.query}`);
            return this.result = res.data.recipes;
            // console.log(this.results);
        } catch (error) {
            alert('Something went wrong', error);
        }
    }

}

