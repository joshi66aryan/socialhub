// fetch user from local storage
export const fetchUserLS = () => {
    const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem(`user`)): localStorage.clear()
    return userInfo;
}