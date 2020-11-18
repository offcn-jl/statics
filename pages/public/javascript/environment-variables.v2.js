// 环境变量

if (window.location.href.indexOf("file") !== -1) {
    // 本地环境
    环境变量 = {
        接口: {
            盖亚: "http://localhost:8080/test"
        }
    }
} else if (window.location.href.indexOf("test.") === -1) {
    // 生产环境
    环境变量 = {
        接口: {
            盖亚: "https://api.gaea.jilinoffcn.com/release"
        }
    }
} else {
    // 测试环境
    环境变量 = {
        接口: {
            盖亚: "https://api.gaea.jilinoffcn.com/release"
        }
    }
}