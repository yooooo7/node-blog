## 功能设计

### 注册

1. 注册页：`GET /signup`
2. 注册：`POST /signup`

### 登录

1. 登录页：`GET /signin`
2. 登录：`POST /signin`

### 登出

1. 登出：`GET /signout`

### 查看文章

1. 列表页：`GET /posts`
2. 文章详情页（包含留言）：`GET /posts/:postId`

### 发表文章

1. 发表文章页：`GET /posts/create`
2. 发表文章：`POST /posts/create`

### 修改文章

1. 修改文章页：`GET /posts/:postId/edit`
2. 修改文章：`POST /posts/:postId/edit`

### 删除文章

1. 删除文章：`GET /posts/:postId/remove`

### 留言

1. 创建留言：`POST /comments`
2. 删除留言：`GET /comments/:commentId/remove`
