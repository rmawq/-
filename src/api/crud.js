import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/travel/',
    method: 'get',
    params
  })
}

export function getDetail(id) {
  return request({
    url: `/travel/${id}/`,
    method: 'get'
  })
}

export function createTravel(data) {
  return request({
    url: '/travel/',
    method: 'post',
    data
  })
}

export function updateTravel(id, data) {
  return request({
    url: `/travel/${id}/`,
    method: 'put',
    data
  })
}

export function deleteTravel(id) {
  return request({
    url: `/travel/${id}/`,
    method: 'delete'
  })
} 