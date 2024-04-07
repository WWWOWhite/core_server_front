import request from '@/utils/request'

export function nodeQuery(params) {
  return request({
    url: '/node-query',
    method: 'post',
    data: params
  })
}

export function nodeUpdate(params) {
  return request({
    url: '/node-update',
    method: 'post',
    data: params
  })
}
