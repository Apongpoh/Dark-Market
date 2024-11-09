export const createMessage = async (senderId, receiverId, token, message) => {
     return await fetch(`/api/message/create/${senderId}/${receiverId}`, {
          method: 'POST',
          headers: {
               Accept: 'application/json',
               Authorization: `Bearer ${token}`
          },
          body: message
     })
          .then(res => res.json())
          .catch(err => console.log(err));
};

export const getMessages = async () => {
     return await fetch(`/api/message/messages`, {
          method: 'GET'
     })
          .then(res => res.json())
          .catch(err => console.log(err));
};