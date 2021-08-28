import axios from 'axios'
import dayjs from 'dayjs';
import { PARAMS } from '../common/params';
import { convertTimeToMySQl } from '../components/schedule/convertTime';




axios.interceptors.response.use(async (response) => {
  return response
}, function (err) {
  const expireAt = localStorage.getItem('expiresAt');
  const dateNow = new Date();
  const refreshToken = localStorage.getItem('refresh-token')
  if(new Date(convertTimeToMySQl(expireAt)) < dateNow && expireAt && refreshToken) {
    console.log("co vao day ko");
    axios.post(`${PARAMS.ENDPOINT}auth/refresh/token`, 
        {
          refreshToken: localStorage.getItem("refresh-token"), 
          username: localStorage.getItem("username")
        }).then(res => {
          if(res.status === 200) {
            console.log("vao tan day co ah");
            localStorage.setItem('access-token', res.data.authenticationToken);
            localStorage.setItem('refresh-token', res.data.refreshToken);
            localStorage.setItem('expiresAt', res.data.expiresAt);
          }
        }).catch(function(err) {
          console.log("loi roi");
            localStorage.setItem('access-token', "");
            localStorage.setItem('refresh-token', "");
            localStorage.setItem('expiresAt', "");
            localStorage.setItem('username', "");
        })

  }
  return Promise.reject(err);
}
);

export const getAPI = async (url: string) => {

  const access_token = localStorage.getItem("access-token");
  const config = {
    headers: {
        Authorization: `Bearer ${access_token}`
    }
  };
  return axios.get(url, config);
}

export const postAPI = async (url: string, body: object) => {
  const access_token = localStorage.getItem("access-token");
    const config = {
      headers: {
      Authorization: `Bearer ${access_token}`
    }
  };
  return axios.post(url, body, config);
}

export const postAPIWithoutHeaders = async (url: string, body: object) => {
  return axios.post(url, body);
}

export const putAPI = async (url: string, body: object) => {
  const access_token = localStorage.getItem("access-token");
    const config = {
      headers: {
      Authorization: `Bearer ${access_token}`
    }
  };
  return axios.put(url, body, config);
}

export const deleteAPI = async (url: string) => {
  const access_token = localStorage.getItem("access-token");
  const config = {
    headers: {
        Authorization: `Bearer ${access_token}`
    }
  };
  return axios.delete(url, config);
}

// export const postFile = async (url:string, body: object) => {
//   const access_token = localStorage.getItem("access-token");
//   return axios({
//     method: 
//   })
// }