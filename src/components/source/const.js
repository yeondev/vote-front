import Urls from './parts/Urls'

export default {
  install (Vue, options) {
    // 1. 전역 메소드 또는 속성 추가
    Vue.prototype.Const = {
      ROUTER_URLS: {
        login: Urls.login,
        register: Urls.register.path,
        main: Urls.main.path
      },
      API_URL: {
        local: 'http://localhost:8081/api',
        // local: 'http://back-vote.herokuapp.com/api/v1',
        // dev: 'https://back-vote.herokuapp.com/api/v1',
        dev: '/api/',
        prod: this.dev
      },
      MESSAGE_LEVEL: {
        SUCCESS: 'success',
        WARNING: 'warning',
        ERROR: 'error'
      }
    }
  }
}
