import request from '@/utils/request'

export function entityQuery(params) {
  return request({
    url: '/entity-query',
    method: 'post',
    data: params
  })
}
