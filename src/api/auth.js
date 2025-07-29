import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/users/login/',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/users/register/',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/users/logout/',
    method: 'post'
  })
}

export function changePassword(data) {
  return request({
    url: '/users/change_password/',
    method: 'post',
    data
  })
}

export function resetPassword(data) {
  return request({
    url: '/users/reset_password/',
    method: 'post',
    data
  })
} 