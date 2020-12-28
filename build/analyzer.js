const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; 
module.exports = { 
    plugins: [ 
        // 开启 BundleAnalyzerPlugin 
        new BundleAnalyzerPlugin(), 
    ], 
}; 