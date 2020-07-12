<<<<<<< HEAD
# Vue电商


### 功能分析
##### 1. 项目初始化
##### 2. 登录/退出功能
##### 3. 主页布局
##### 4. 用户管理模块
##### 5. 权限管理模块
##### 6. 分类管理模块
##### 7. 参数管理模块
##### 8. 商品管理模块
##### 9. 订单管理模块
##### 10. 数据统计模块



### 1. 电商业务概述

客户使用的功能：PC端，小程序，移动web，移动app
管理员使用的功能：PC后台管理端。
PC后台管理端的功能：管理用户账号（登录，退出，用户管理，权限管理），商品管理（商品分类，分类参数，商品信息，订单），数据统计
电商后台管理系统采用前后端分离的开发模式
前端项目是基于Vue的SPA（单页应用程序）项目

##### 1-1前端技术栈:

- Vue
- Vue-router
- Element-UI
- Axios
- Echarts

##### 1-2 后端项目技术栈

- Node.js
- Express
- Jwt(模拟session)
- Mysql
- Sequelize(操作数据库的框架)



### 2. 前端项目初始化步骤

1. 安装Vue脚手架    --  npm install -g vue-cli
2. 通过Vue脚手架创建项目  -- vue ui （可视化界面安装）
3. 配置Vue路由  
4. 配置Element-UI组件库  -- 搜索vue-cli-plugin-element
5. 配置axios库
6. 初始化git远程仓库
7. 将本地项目托管到GitHub中


### 3.登录/退出功能
##### 3.1登录概述
###### 1.登录业务流程
1. 在登录页面输出用户名和密码
2.调用后台接口进行验证
3.通过验证之后，根据后台的响应状态跳转到项目主页

###### 2.相关技术
- http是无状态的
- 通过cookie在客户端记录状态
- 通过session在服务器端记录状态
- 通过token方式维持状态

###### 3.使用token原理分析

![image-20200513134535828](C:\Users\史荣辉\AppData\Roaming\Typora\typora-user-images\image-20200513134535828.png)
=======
# vue_shop

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
 
>>>>>>> rights
