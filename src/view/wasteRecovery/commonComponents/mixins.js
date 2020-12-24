export default{
    data(){
        return{
            isShowSelectCityAgent: false, //市级代理人控制器
            isShowSelectRegionsCounties: false, //区县代理人控制器
            isShowSelectShop: false,
        }
    },
    methods: {
        setCenter(data){
            console.log(data);
            this.detail.longitude = data.lng
            this.detail.latitude = data.lat
            this.$forceUpdate()
            console.log(this.detail);
        },
        //市级
        showSelectCityAgent(){
            this.isShowSelectCityAgent = true
        },
        selectCityAgent(){
            if(!this.$refs.selectCityAgent.currentData.id){
                this.$Message.warning('请选择市级代理人')
                return 
            }
            if(this.isDetail){
                this.detail.cityAgentId = this.$refs.selectCityAgent.currentData.id
                this.detail.cityAgentName = this.$refs.selectCityAgent.currentData.userName
                if(this.$store.state.user.roleNames.indexOf('管理员') > -1){
                    this.detail.province =  this.$refs.selectCityAgent.currentData.province
                    this.detail.city =  this.$refs.selectCityAgent.currentData.city
                    try{
                        this.$refs.cascader.query = this.detail.city
                    }catch(err){
                        console.log('没有三级联动');
                    }
                }
            }else{
                this.params.cityAgentId = this.$refs.selectCityAgent.currentData.id
                this.params.cityAgentName = this.$refs.selectCityAgent.currentData.userName
                if(this.params.city != undefined){
                    this.params.city =  this.$refs.selectCityAgent.currentData.city
                }
            }
            this.isShowSelectCityAgent = false
        },
        clearSelectCityAgent(){
            this.params.cityAgentId = ''
            this.params.cityAgentName = ''
            if(this.params.city != undefined){
                this.params.city =  ''
            }
        },
        //区县
        showSelectRegionsCounties() {
            this.isShowSelectRegionsCounties = true
        },
        selectRegionsCounties() {
            if(!this.$refs.selectRegionsCounties.currentData.id){
                this.$Message.warning('请选择区县所属人')
                return 
            }
            try{
                this.detail.adminId = this.$refs.selectRegionsCounties.currentData.id
                this.detail.regionsCountiesId = this.$refs.selectRegionsCounties.currentData.userName
            }catch(err){
                console.info('详情报错',err);
            }

            try{
                this.params.adminId = this.$refs.selectRegionsCounties.currentData.id
                this.params.regionsCountiesId = this.$refs.selectRegionsCounties.currentData.userName
                if(this.regionsCountiesUseForQuery){
                    this.params.regionsCountiesId = this.$refs.selectRegionsCounties.currentData.id
                    this.params.regionsCountiesName = this.$refs.selectRegionsCounties.currentData.userName
                }
            }catch(err){
                console.info('主页报错',err);
            }
            this.isShowSelectRegionsCounties = false
        },
        clearSelectRegionsCounties(){
            try{
                this.detail.adminId = ''
                this.detail.regionsCountiesId = ''
            }catch(err){
                console.info(err);
            }

            try{
                this.params.adminId = ''
                this.params.regionsCountiesId = ''
                if(this.regionsCountiesUseForQuery){
                    this.params.regionsCountiesName = ''
                }
            }catch(err){
                console.info(err);
            }
        },
        //店铺
        showSelectShop(){
            this.isShowSelectShop = true
        },
        selectShop(){
            this.params.shopId = this.$refs.selectShop.currentData.id
            this.params.shopName = this.$refs.selectShop.currentData.shopName
            this.isShowSelectShop = false
        },
        clearShop(){
            this.params.shopId = ''
            this.params.shopName = ''
        },
        //匹配省市区
        matchCity(){
            this.$set(this.detail,'cityData',[])
            console.log(this.cityData);
            this.cityData.forEach(item =>{
                if(this.detail.province.indexOf(item.label) > -1){
                    this.detail.cityData.push(item.value)
                    if(item.children.length > 0){
                        item.children.forEach(jtem =>{
                            if(this.detail.city.indexOf(jtem.label) > -1 || this.detail.regionsAndCounties.indexOf(jtem.label) > -1){
                                this.detail.cityData.push(jtem.value)
                                this.$forceUpdate()
                                 if(jtem.children && jtem.children.length > 0){
                                    jtem.children.forEach(ktem =>{
                                        if(ktem.label == this.detail.regionsAndCounties){
                                            this.detail.cityData.push(ktem.value)
                                            this.$forceUpdate()
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            })
        }
        
    }
}