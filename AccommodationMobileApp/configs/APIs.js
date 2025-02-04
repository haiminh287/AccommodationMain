import axios from "axios";

const BASE_URL = 'https://2e6b-2402-800-620c-71fe-d8d0-af36-3aca-149b.ngrok-free.app/';
export const endpoints ={
    'login':'/o/token/',
    'register':'/users/',
    'current-user':'/users/current-user/',
    'conversations':user_id => `/users/${user_id}/conversations/`,
    'messages':conversation_id => `/conversations/${conversation_id}/messages/`,
    'new-conversation':'/conversations/',
    'users-messages':user_id => `/users/${user_id}/messages/`,
    'acquistion-articles': '/acquistion-article/',
    'looking-articles': '/looking-article/',
    'house-articles': '/house-articles/',
    'images-house': house_id => `/acquistion-article/${house_id}/images/`,
    'like-house': house_id => `/house-articles/${house_id}/likes/`,
    'user-like-house': '/like/',
    'follow-user': '/users/follow-user/',
    'user-statistics':'/user-statistics/',
    'comment-article': house_id => `/house-articles/${house_id}/comments/`,
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
