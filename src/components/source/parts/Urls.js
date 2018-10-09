export default {
  main: {
    path: '/'
  },
  test: {
    path: '/test'
  },
  login: {
    path: '/login'
  },
  register: {
    path: '/register'
  },
  vote: {
    main: {
      path: '/vote/dashboard'
    },
    create: {
      path: '/vote/create'
    },
    path: '/vote/:id'
  }
}
