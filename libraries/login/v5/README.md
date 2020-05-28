# 第五代登陆模块

- [x] 前后端完全开源
- [x] 后端完全迁移到 Serverless 架构
- [x] 与哈士齐营销平台完全解耦
- [x] 与 ZG99 综合活动系统完全解耦
- [x] 提供会话管理功能
- [x] 提供表单导出功能
- [x] 对已注册用户进行缓存 ( 用户侧实现了一处注册多处通行, 平台侧实现了短信下发资源的节约 )
- [x] 优化数据结构, 精简导出的全局变量
- [x] 在部署阶段增加了代码压缩步骤 ( 提升了用户侧的加载时间, 节约了平台侧的流量消耗 )
- [x] 移除 ES6 代码, 加强了旧的浏览器内核的兼容性