// 读取iconfont.css 生成iconfont图标class数组js文件
const fs = require('fs');

const fileContent = fs.readFileSync('./src/assets/icons/iconfont.css','utf-8')
let iconList = fileContent.match(/\.icon\-(\S*):/g).join(',').replace(/(\.icon\-|:)/g,'').split(',')
let str = 'export default' + ' ' + JSON.stringify(iconList)
fs.writeFile('./src/assets/icons/iconList.js',str,function(err){
    if (err) {
        err.status(500).send('Server is error...')
    }else{
        console.log('\n已自动生成icon图标列表文件\n');
    }
})
