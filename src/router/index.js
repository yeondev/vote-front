import Vue from 'vue'
import Router from 'vue-router'
import TestForm from '@/components/TestForm'
import MainBoard from '@/components/MainBoard'

import LogIn from '@/components/auth/LogIn'
import Register from '@/components/auth/Register'
import Urls from '@/components/source/parts/Urls'

import VoteBoard from '@/components/vote/VoteBoard'
import VoteMakeBoard from '@/components/vote/VoteMakeBoard'
import VotePage from '@/components/vote/VotePage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: Urls.main.path,
      name: 'MainBoard',
      component: MainBoard
    },
    {
      path: Urls.test.path,
      name: 'TestForm',
      component: TestForm
    },
    {
      path: Urls.login.path,
      name: 'LogIn',
      component: LogIn
    },
    {
      path: Urls.register.path,
      name: 'Register',
      component: Register
    },
    {
      path: Urls.vote.main.path,
      name: 'VoteBoard',
      component: VoteBoard
    },
    {
      path: Urls.vote.create.path,
      name: 'VoteMakeBoard',
      component: VoteMakeBoard
    },
    {
      path: Urls.vote.path,
      name: 'VotePage',
      component: VotePage
    }
  ]
})
