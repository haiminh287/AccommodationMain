import axios from "axios";

const BASE_URL = 'http://192.168.1.28:8000/';
export const endpoints ={
    'login':'/o/token/',
    'register':'/users/',
    'current-user':'/users/current-user/',
    'conversations':user_id => `/users/${user_id}/conversations/`,
    'messages':conversation_id => `/conversations/${conversation_id}/messages/`,
    'new-conversation':'/conversations/',
    'users-messages':user_id => `/users/${user_id}/messages/`,
    'post-history':'/users/post-history/',
    'acquistion-articles': '/acquistion-article/',
    'acquistion-article': house_id => `/acquistion-article/${house_id}/`,
    'images-house': house_id => `/acquistion-article/${house_id}/images/`,
    'address-house': house_id => `/acquistion-article/${house_id}/address/`,
    'looking-articles': '/looking-article/',
    'looking-article': house_id => `/looking-article/${house_id}/`,
    'house-articles': '/house-articles/',
    'like-house': house_id => `/house-articles/${house_id}/likes/`,
    'user-like-house': '/like/',
    'follow-user': '/users/follow-user/',
    'user-statistics':'/user-statistics/',
    'comment-article': house_id => `/house-articles/${house_id}/comments/`,
    'house-article': house_id => `/house-articles/${house_id}/`,
}

export const authApis =(token)=>{
    return axios.create({
        baseURL:BASE_URL,
        headers:{
            Authorization:`Bearer ${token}`,
        }
    })
}

export default axios.create({
    baseURL:BASE_URL
})
