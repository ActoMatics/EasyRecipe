import axios from 'axios';
import {key, searchRecipe} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const res = await axios.get(searchRecipe + `?key=${key}&${this.query}`);
            return this.result = res.data.recipes;
        } catch (error) {
            alert('Something went wrong', error);
        }
    }

}

