export const createBtcs = async (userId, token, authBtc) => {
     return await fetch(`/api/wallet/create/${userId}`, {
          method: 'POST',
          headers: {
               Accept: 'application/json',
               Authorization: `Bearer ${token}`
          },
          body: authBtc
     })
          .then(res => res.json())
          .catch(err => console.log(err));
};

export const getBtc = async btcId => {
     return await fetch(`/api/wallet/${btcId}`, {
          method: "GET"
     })
          .then(res => res.json())
          .catch(err => console.log(err));
};

export const getBtcs = async () => {
     return await fetch('/api/wallet/btcs', {
          method: 'GET'
     })
          .then(res => res.json())
          .catch(err => console.log(err));
};

export const createMultisig = async (userId, token, authBtc) => {
     return await fetch(`/api/wallet/create/multisig/${userId}`, {
          method: 'POST',
          headers: {
               Accept: 'application/json',
               Authorization: `Bearer ${token}`
          },
          body: authBtc
     })
          .then(res => res.json())
          .catch(err => console.log(err));
};

export const withdrawBtc = async (btcId, userId, token, btc) => {
     return await fetch(`/api/wallet/send/${btcId}/${userId}`, {
          method: 'POST',
          headers: {
               Accept: 'application/json',
               Authorization: `Bearer ${token}`
          },
          body: btc
     })
          .then(res => res.json())
          .catch(err => console.log(err));
};

export const withdrawBtcFromMultisigBuyer = async (btcId, userId, token, btc) => {
     return await fetch(`/api/wallet/multisig/vendor-cashout/${btcId}/${userId}`, {
          method: 'POST',
          headers: {
               Accept: 'application/json',
               Authorization: `Bearer ${token}`
          },
          body: btc
     })
          .then(res => res.json())
          .catch(err => console.log(err));
};

export const withdrawBtcFromMultisigVendor = async (btcId, userId, token, btc) => {
     return await fetch(`/api/wallet/multisig/vendor-cashout/${btcId}/${userId}`, {
          method: 'POST',
          headers: {
               Accept: 'application/json',
               Authorization: `Bearer ${token}`
          },
          body: btc
     })
          .then(res => res.json())
          .catch(err => console.log(err));
};