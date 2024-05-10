import request from '@/utils/request'

const MODULE_BASE_URL = '/entitymanage'

export function entityWithdraw(entityId) {
  return request({
    url: `${MODULE_BASE_URL}/withdraw-entity/`,
    method: 'post',
    data: {
      entity_id: entityId
    }
  })
}

export function entityQuery(params) {
  return request({
    url: `${MODULE_BASE_URL}/entity-query-all`,
    method: 'post',
    data: params
  })
}

