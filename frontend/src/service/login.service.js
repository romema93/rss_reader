export const checkLogin = () => {
    return !!localStorage.getItem("token");
}

export const getLoginToken = () => {
    return localStorage.getItem("token");
}

export const setLoginToken = (token) => {
    localStorage.setItem("token", token);
}