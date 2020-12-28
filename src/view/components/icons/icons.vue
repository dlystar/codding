<template>
	<div class="icons">
		<!-- 自定义 -->
		<div class="iconheader">
			<h2>自定义图标</h2>
			<Input search placeholder="可以搜索关键字，比如：shanchu" @on-search="searchIcon" @on-change="clear"/>
		</div>
		<div class="iconList" v-show="!isDoSearch">
			<div class="icon-item" v-for="item in allList" :key="item.icon" v-clipboard="item.clipOptions">
				<div class="icon-content">
					<Icon v-if="item.type=='iconfont'" :custom="`iconfont icon-${item.icon}`" size="24" />
					<Icon v-else :type="item.icon" size="24" />
				</div>
				<div class="icon-code">
					{{item.icon}}
				</div>
			</div>
		</div>
		<div class="iconList" v-show="isDoSearch">
			<div class="icon-item" v-for="item in searchList" :key="item.icon" v-clipboard="item.clipOptions">
				<div class="icon-content">
					<Icon v-if="item.type=='iconfont'" :custom="`iconfont icon-${item.icon}`" size="24" />
					<Icon v-else :type="item.icon" size="24" />
				</div>
				<div class="icon-code">
					{{item.icon}}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import iconList from "@/assets/icons/iconList.js"; //文件运行项目时自动生成
import iviewIconList from "@/assets/icons/iviewIconList.js"; //文件运行项目时自动生成
export default {
	name: "icons_pages",
	data() {
		return {
			customIconList: ["woman", "man", "smile", "meh", "frown", "bear"],
			iconList: {},
			iviewIconList: {},
			allList: [],
			searchList: [],
			isDoSearch: false,
		}
	},
	methods:{
		searchIcon(value){
			if(value) this.isDoSearch = true
			this.searchList = this.allList.filter(item => item.icon.indexOf(value) > -1)
		},
		clear(e){
			if(e.target.value == ''){
				this.isDoSearch = false
			}
		},
		createOptions(item,type){
			return {
				icon: item,
				type,
				clipOptions:{
					value: type == 'ivu' ? `<Icon type="${item}" />` : `<Icon custom="iconfont icon-${item}" size="24" />`,
					success: (e) => {
						this.$Message.success('复制成功')
					},
					error: () => {
						this.$Message.error('复制失败')
					}
				}
			}
		}
	},
	created(){
		this.allList = this.allList.concat(iviewIconList.map(item => this.createOptions(item,'ivu')),iconList.map(item => this.createOptions(item,'iconfont')))
		this.searchList = JSON.parse(JSON.stringify(this.allList))
	},
	mounted(){
		
	}
}
</script>

<style lang="less" scoped>
.icons{
	.iconList{
		overflow: hidden;
	}
	h2{text-align: center;}
	.icon-item {
		float: left;
		margin: 6px 6px 6px 0;
		width: 145px;
		text-align: center;
		list-style: none;
		cursor: pointer;
		height: 100px;
		color: #5c6b77;
		transition: all .2s ease;
		// position: relative;
		padding-top: 10px;
		.icon-content{
			display: block;
			margin-bottom: 10px;
		}
		.icon-code{
			padding-top: 10px;
			margin: 5px;
			font-size: 14px;
		}
	}
}
</style>
