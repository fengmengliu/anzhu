import axios from "axios";
import { GitServer }  from "./GitServer.js";

const BASE_URL = 'https://gitee.com/api/v5'

/**
 * 说明：gitee不同于github的请求方式，gitee是将token信息在header中传递，而gitee是在参数总传递token
 */
class Gitee extends GitServer {
  constructor() {
    super();

    this.service = axios.create({
      baseURL: BASE_URL,
      timeout: 5000,
    })
    this.service.interceptors.response.use(
      response => {
        return response.data
      },
      error => {
        return Promise.reject(error)
      }
    )
  }

  get(url, params, headers) {
    return this.service({
      url,
      params: {
        ...params,
        access_token: this.token
      },
      method: 'get',
      headers
    })
  }

  searchRepositories(params){
    return this.get('/search/repositories', params)
  }
}

export default Gitee