import Urls from './parts/Urls'

export default {
  install (Vue, options) {
    // 1. 전역 메소드 또는 속성 추가
    Vue.prototype.Const = {
      ROUTER_URLS: {
        login: Urls.login,
        register: Urls.register.path
      },
      API_URL: {
        // local: 'http://192.168.0.13:8080/api/v1',
        local: 'http://back-vote.herokuapp.com/api/v1',
        dev: 'https://back-vote.herokuapp.com/api/v1',
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
