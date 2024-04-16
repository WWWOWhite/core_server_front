import request from '@/utils/request'

export function nodeQuery(params) {
  return request({
    url: '/node-query',
    method: 'post',
    data: params
  })
}

export function nodeUpdate(nodeId, editedNode) {
  return request({
    url: `/node-update/${nodeId}`,
    method: 'post',
    data: {
      update_form: editedNode
    }
  })
}
