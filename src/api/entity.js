import request from '@/utils/request'

export function entityWithdraw(entityId) {
  return request({
    url: `/withdraw-entity/${entityId}`,
    method: 'post'
  })
}

export function entityQuery(params) {
  return request({
    url: '/entity-query',
    method: 'post',
    data: params
  })
}

