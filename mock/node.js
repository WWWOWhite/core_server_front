const Mock = require('mockjs')

const data = Mock.mock({
  'items|100': [{
    node_id: '@string("lower", 8)',
    'node_ip|1': '@ip',
    'node_desc|1': '@cparagraph(1, 5)',
    create_time: '@datetime',
    update_time: '@datetime'
  }]
})

module.exports = [
  {
    url: '/node-query',
    type: 'post',
    response: config => {
      const { page, limit } = config.body
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const items = data.items.slice(startIndex, endIndex)
      const total = data.items.length
      return {
        code: 20000,
        data: {
          total: total,
          items: items
        }
      }
    }
  }
]
