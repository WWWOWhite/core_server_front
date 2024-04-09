import request from '@/utils/request'

export function userDelete(userId) {
  return request({
    url: `/delete-user/${userId}`,
    method: 'post'
  })
}

export function userUpdate(userId, editedUser) {
  return request({
    url: `/update-user/${userId}`,
    method: 'post',
    data: {
      update_form: editedUser
    }
  })
}

export function userQuery(params) {
  return request({
    url: '/user-query',
    method: 'post',
    data: params
  })
}

export function login(data) {
  return request({
    url: '/user-login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user-info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user-logout',
    method: 'post'
  })
}
