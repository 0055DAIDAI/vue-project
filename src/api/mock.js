import Mock from 'mockjs';
import homeAPI from './mockData/home'
import userApi from './mockData/user'
import menuApi from './mockData/permission'
// 1.拦截路径 2 方法 3 制造出的假数据
// 局部路径匹配进行拦截

Mock.mock(/api\/home\/getTableData/, "get", homeAPI.getTableData)
Mock.mock(/api\/home\/getCountData/, "get", homeAPI.getCountData)
Mock.mock(/api\/home\/getChartData/, "get", homeAPI.getChartData)
Mock.mock(/api\/home\/getUserData/, "get", userApi.getUserList)
Mock.mock(/api\/user\/deleteUser/, "get", userApi.deleteUser)
Mock.mock(/api\/user\/addUser/, "post", userApi.createUser)
Mock.mock(/api\/user\/editUser/, "post", userApi.updateUser)
Mock.mock(/api\/permission\/getMenu/, "post", menuApi.getMenu)




