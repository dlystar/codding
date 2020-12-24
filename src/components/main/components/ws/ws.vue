<template>
    <div class="ws">
        <Tooltip :content="value ? '点击关闭语音播报功能' : '点击开启语音播报功能'" placement="bottom">
            <Icon :type="value ? LinkType : unLinkType" :size="23" style="cursor: pointer;" @click="linkOrUnLick()" />
        </Tooltip>
        <div class="video" style="display: none; overflow: hidden; opacity: 0; width: 0; height: 0;">
            <audio id="bgmusic" name="media"
                :src="voice+audioText">
            </audio>
        </div>
        <!-- <span @click="ws.send('hello hxy2')">
            发消息
        </span> -->
    </div>
</template>

<script>
    import config from '@/config'
    const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
    const url = baseUrl + 'ring/websocket/'
    export default{
        data(){
            return{
                value: false,
                unLinkType: 'ios-mic-off',
                LinkType: 'ios-mic',
                accountName: this.$store.state.user.accountName,
                wsUrl: '',
                ws: null,
                voice: 'http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=301&tex=',
                audioText: '',
                isOpen: false,
                isRefalsh: false,
            }
        },
        watch:{
            isOpen(val){
                let saveArr = []
                let num = 0
                console.log(localStorage.isLinkWebSocket);
                if(localStorage.isLinkWebSocket != undefined){
                    let isHasRecord = false
                    saveArr = JSON.parse(localStorage.isLinkWebSocket)
                    saveArr.forEach(item =>{
                        if(item.accountName == this.accountName){
                            item.isLinkWebSocket = val
                            isHasRecord = true
                        }
                    })
                    if(!isHasRecord) num++
                }else{
                    num++
                }
                console.log(num);
                if(num > 0){
                    saveArr.push({
                        accountName: this.accountName,
                        isLinkWebSocket: val
                    })
                }
                localStorage.setItem('isLinkWebSocket',JSON.stringify(saveArr))
            }
        },
        methods:{
            linkOrUnLick(){
                if(!this.ws && !this.value){
                    console.log(this.wsUrl);
                    this.ws = new WebSocket(this.wsUrl)
                }else{
                    this.ws.send('语音播报关闭')
                    // setTimeout(()=>{
                    //     this.ws.close()
                    // },2000)
                }
                if(this.isOpen) return //关闭不执行这里
                this.ws.onopen = (evt)=> {
                    this.value = true
                    this.isOpen = true
                    // if(isRefalsh) return
                    this.$Message.success('已为您开启语音播报功能')
                    this.ws.send('连接成功，测试语音播报，语音播报成功')
                }
                this.ws.onmessage = (evt)=> {
                    console.log( "Received Message: " + evt.data);
                    this.audioText = evt.data
                    this.$nextTick(()=>{
                        if(this.audioText == '连接成功，测试语音播报，语音播报成功' && this.isRefalsh){
                            this.isRefalsh = false
                            return
                        }
                        document.getElementById("bgmusic").play()
                        if(this.audioText == '语音播报关闭'){
                            this.ws.close()
                        }
                    })
                }
                this.ws.onclose = (evt)=> {
                    this.$Message.success('已为您关闭语音播报功能')
                    this.value = false
                    this.ws = null
                    this.isOpen = false
                }
            },
            handelSave(boo){
                //boo是存还是删 true存，false删
                let handel = bool ? 'setItem' : 'removeItem'
                localStorage[handel]()
            }
        },
        created(){
            this.wsUrl = url + this.accountName
            if(this.wsUrl.indexOf('https://') > -1){
                this.wsUrl = this.wsUrl.replace('https://','wss://')
            }else{
                this.wsUrl = this.wsUrl.replace('http://','ws://')
            }
            // this.ws.onopen = (evt)=>{
            //     console.log('接受成功');
            // }
        },
        mounted(){
            if(localStorage.isLinkWebSocket != undefined){
                JSON.parse(localStorage.isLinkWebSocket).forEach(item =>{
                    console.log('是否开启过',item.isLinkWebSocket);
                    if(item.accountName == this.accountName && item.isLinkWebSocket == true){
                        this.isRefalsh = true
                        this.linkOrUnLick()
                    }
                })
            }
        },
        beforeDestroy(){
            console.log('我要被销毁啦');
            if(this.ws){
                this.ws.send('退出登录,语音播报关闭')
                this.ws.close()
            }
        }
    }
</script>

<style lang="less" scoped>
    .ws{
        margin-right: 10px;
    }
</style>