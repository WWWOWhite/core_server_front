import request from '@/utils/request'

const MODULE_BASE_URL = '/nodemanage'

export function nodeAdd(params) {
  return request({
    url: `${MODULE_BASE_URL}/node-add/`,
    method: 'post',
    data: params
  })
}
export function nodeLoadConfig(params) {
  return request({
    url: `${MODULE_BASE_URL}/node-load-config/`,
    method: 'post',
    data: params
  })
}



export function nodeQuery(params) {
  return request({
    url: `${MODULE_BASE_URL}/node-query-all/`,
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


export function logQuery(params) {
  return request({
    url: `${MODULE_BASE_URL}/log-query-all/`,
    method: 'post',
    data: params
  })
}