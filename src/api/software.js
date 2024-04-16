import request from '@/utils/request'

export function softwareRegistrationReview(softwareId, isApproved) {
  return request({
    url: `/approve-software-register/${softwareId}/${isApproved}`,
    method: 'post'
  })
}

export function RegisteredSoftwareQuery(params) {
  return request({
    url: '/registered-software-query',
    method: 'post',
    data: params
  })
}

export function softwareQuery(params) {
  return request({
    url: '/software-query',
    method: 'post',
    data: params
  })
}

export function softwareUpdate(softwareId, editedSoftware) {
  return request({
    url: `/update-software/${softwareId}`,
    method: 'post',
    data: {
      update_form: editedSoftware
    }
  })
}
