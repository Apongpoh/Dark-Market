export const getVendorInfo = async userId => {
    return await fetch(`/api/vendor-info/${userId}`, {
         method: "GET"
    })
         .then(res => res.json())
         .catch(err => console.log(err));
};

export const getUser = async userId => {
    return await fetch(`/api/user/${userId}`, {
         method: "GET"
    })
         .then(res => res.json())
         .catch(err => console.log(err));
};

export const getUsers = async () => {
    return await fetch('/api/user/users', {
         method: "GET"
    })
         .then(res => res.json())
         .catch(err => console.log(err));
};

export const updateAbout = async (userId, token, about) => {
    return await fetch(`/api/user-manage/update/about/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(about)
    })
        .then(res => res.json())
        .catch(err => console.log(err))
};

export const profileImg = async (userId, token, profilePicture) => {
    return await fetch(`/api/user-manage/update/profile-photo/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: profilePicture
    })
        .then(res => res.json())
        .catch(err => console.log(err))
};

export const coverImg = async (userId, token, cover) => {
    return await fetch(`/api/user-manage/update/cover-photo/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: cover
    })
        .then(res => res.json())
        .catch(err => console.log(err))
};

export const updatePGP = async (userId, token, pgp) => {
    return await fetch(`/api/user-manage/update/pgp/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(pgp)
    })
        .then(res => res.json())
        .catch(err => console.log(err))
};

export const updatePassword = async (userId, token, password) => {
    return await fetch(`/api/user-manage/update/password/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(password)
    })
        .then(res => res.json())
        .catch(err => console.log(err))
};

export const update = (user, next) => {
    if (typeof window !== "undefined") {
        if (localStorage.getItem("jwt")) {
            let auth = JSON.parse(localStorage.getItem("jwt"));
            auth.user = user;
            localStorage.setItem("jwt", JSON.stringify(auth));
            next();
        }
    }
};
