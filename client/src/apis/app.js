import axios from "../axios";

export const apiGetCategories = () => axios({
    url: '/products-category/',
    method: 'get'
});
