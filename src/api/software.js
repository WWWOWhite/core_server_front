import request from '@/utils/request'

export function softwareQuery(params) {
  return request({
    url: '/software-query',
    method: 'post',
    data: params
  })
}
