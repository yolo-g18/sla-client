import axios from 'axios'


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