import Vue from 'vue'
import Vuex from 'vuex'
import { login as loginApi, logout as logoutApi } from '@/api/auth'
import { getUserInfo, updateUserProfile } from '@/api/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    token: localStorage.getItem('token') || null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    CLEAR_USER(state) {
      state.user = null
    },
    CLEAR_TOKEN(state) {
      state.token = null
      localStorage.removeItem('token')
    },
    UPDATE_USER_PROFILE(state, userData) {
      state.user = { ...state.user, ...userData }
    }
  },
  actions: {
    async login({ commit, dispatch }, loginData) {
      try {
        const response = await loginApi(loginData)
        const { token } = response
        
        commit('SET_TOKEN', token)
        
        // 获取用户信息
        await dispatch('fetchUserInfo')
        
        return { success: true }
      } catch (error) {
        console.error('Login error:', error)
        return { success: false, error }
      }
    },
    
    async logout({ commit }) {
      try {
        await logoutApi()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        commit('CLEAR_USER')
        commit('CLEAR_TOKEN')
      }
    },
    
    async initAuth({ commit, dispatch, state }) {
      if (state.token && !state.user) {
        try {
          await dispatch('fetchUserInfo')
        } catch (error) {
          console.error('Get user info error:', error)
          commit('CLEAR_TOKEN')
        }
      }
    },
    
    async fetchUserInfo({ commit }) {
      try {
        const user = await getUserInfo()
        commit('SET_USER', user)
        return user
      } catch (error) {
        console.error('Fetch user info error:', error)
        throw error
      }
    },
    
    async updateProfile({ commit }, userData) {
      try {
        const response = await updateUserProfile(userData)
        commit('UPDATE_USER_PROFILE', response)
        return response
      } catch (error) {
        console.error('Update profile error:', error)
        throw error
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user
  }
}) 