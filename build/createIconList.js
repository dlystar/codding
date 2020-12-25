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

//读取iview内置图标
const iviewIconsContent = fs.readFileSync('./node_modules/iview/src/styles/common/iconfont/_ionicons-icons.less','utf-8')
let ivewIconList = iviewIconsContent.match(/\.ivu-icon\-(\S*):/g).join(',').replace(/(\.ivu-icon\-|:)/g,'').split(',')
let iviewIconstr = 'export default' + ' ' + JSON.stringify(ivewIconList)
fs.writeFile('./src/assets/icons/iviewIconList.js',iviewIconstr,function(err){
    if (err) {
        err.status(500).send('Server is error...')
    }else{
        console.log('\n已自动生成icon图标列表文件\n');
    }
})
