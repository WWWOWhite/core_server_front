import request from '@/utils/request'

const MODULE_BASE_URL = '/nodemanage'

export function nodeQuery(params) {
  return request({
    url: `${MODULE_BASE_URL}/node-query-all`,
    method: 'post',
    data: params
  })
}

export function nodeUpdate(editedNode) {
  return request({
    url: `${MODULE_BASE_URL}/node-update/`,
    method: 'post',
    data: editedNode
  })
}
