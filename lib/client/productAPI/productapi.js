import queryString from 'query-string';

/** 
     * shop API functions:
     * getProduct(productId) get a single products
     * getCategories() get all categories
     * filterProducts(skip, newFilter) filter products as the user clicks on checkbox and radio buttons
     * getVendorProducts(productId) get all products of a particular vendor
     * searchProduct(params) return search products list
    */

export const getProduct = async productId => {
     return await fetch(`/api/product/${productId}`, {
          method: "GET"
     })
          .then(res => res.json())
          .catch(err => console.log(err));
};

export const getCategories = async () => {
     return await fetch('/api/category/categories', {
          method: "GET"
     })
          .then(res => res.json())
          .catch(err => console.log(err));
};

export const filterProducts = async (skip, filters = {}) => {

     const data = {
          skip,
          filters
     };

     return await fetch(`/api/product/filter`, {
          method: "POST",
          headers: {
               Accept: "application/json",
               "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
     })
          .then(res => res.json())
          .catch(err => console.log(err));
};

export const searchProduct = async params => {
     const query = queryString.stringify(params);

     return await fetch(`/api/product/search?${query}`, {
          method: "GET"
     })
          .then(res => res.json())
          .catch(err => console.log(err));
};

/* manage product */
export const createProduct = async (userId, token, product) => {
     return await fetch(`/api/product/create/${userId}`, {
          method: 'POST',
          headers: {
               Accept: 'application/json',
               Authorization: `Bearer ${token}`
          },
          body: product
     })
          .then(res => res.json())
          .catch(err => console.log(err));
};

export const getProducts = async () => {
     return await fetch(`/api/product/products?limit=undefined`, {
          method: 'GET'
     })
          .then(res => res.json())
          .catch(err => console.log(err));
};

export const updateProduct = async (productId, userId, token, product) => {
     return await fetch(`/api/product/update/${productId}/${userId}`, {
          method: 'PUT',
          headers: {
               Accept: 'application/json',
               Authorization: `Bearer ${token}`
          },
          body: product
     })
          .then(res => res.json())
          .catch(err => console.log(err))
};

export const deleteProduct = async (productId, userId, token) => {
     return await fetch(`/api/product/delete/${productId}/${userId}`, {
          method: 'DELETE',
          headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`
          }
     })
          .then(res => res.json())
          .catch(err => console.log(err));
};