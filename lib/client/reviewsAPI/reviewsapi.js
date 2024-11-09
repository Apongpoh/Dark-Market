export const createReview = async (userId, productId, token, reviews) => {
     return await fetch(`/api/review/create/${userId}/${productId}`, {
          method: 'POST',
          headers: {
               Accept: 'application/json',
               Authorization: `Bearer ${token}`
          },
          body: reviews
     })
          .then(res => res.json())
          .catch(err => console.log(err));
 };
 
 export const getReviews = async () => {
     return await fetch(`/api/review/reviews`, {
          method: 'GET'
     })
          .then(res => res.json())
          .catch(err => console.log(err));
 };