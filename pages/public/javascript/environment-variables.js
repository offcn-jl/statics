// 环境变量

if (window.location.href.indexOf("file") !== -1) {
    // 本地环境
    ChaosEnvironmentVariables = {
        Apis: {
            TKE: "http://localhost:8080/test",
            SCF: "https://scf.tencent.jilinoffcn.com/release",
            TSF: "http://localhost:8080"
        }
    }
} else if (window.location.href.indexOf("test.") === -1) {
    // 生产环境
    ChaosEnvironmentVariables = {
        Apis: {
            TKE: "https://api.chaos.jilinoffcn.com/release",
            SCF: "https://scf.tencent.jilinoffcn.com/release",
            TSF: "https://tsf.tencent.jilinoffcn.com/release"
        }
    }
} else {
    // 测试环境
    ChaosEnvironmentVariables = {
        Apis: {
            TKE: "https://api.chaos.jilinoffcn.com/test",
            SCF: "https://scf.tencent.jilinoffcn.com/test",
            TSF: "https://service-13mae2rr-1258962498.bj.apigw.tencentcs.com"
        }
    }
}