export const createTicket = async (userId, token, ticket) => {
    return await fetch(`/api/ticket/create/${userId}`, {
         method: 'POST',
         headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`
         },
         body: ticket
    })
         .then(res => res.json())
         .catch(err => console.log(err));
};

export const getTickets = async () => {
    return await fetch(`/api/ticket/tickets`, {
         method: 'GET'
    })
         .then(res => res.json())
         .catch(err => console.log(err));
};