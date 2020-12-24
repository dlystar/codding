<template>
	<div class="icons">
		<div class="icon-item" v-for="item in iconList" :key="item.icon" v-clipboard="item.clipOptions">
			<div class="icon-content">
				<icons :size="30" :type="item.icon"/>
			</div>
			<div class="icon-code">
				{{item.icon}}
			</div>
		</div>
	</div>
</template>

<script>
import Icons from "_c/icons";
import CommonIcon from "_c/common-icon";
import iconList from "@/assets/icons/iconList.js";
export default {
	name: "icons_pages",
	components: {
		Icons,
		CommonIcon,
	},
	data() {
		return {
			customIconList: ["woman", "man", "smile", "meh", "frown", "bear"],
			iconList: {},
		}
	},
	methods:{
		copy(item){

		}
	},
	created(){
		this.iconList = iconList.map(item =>{
			return {
				icon: item,
				clipOptions: {
					value: `<icons :type="${item}"/>`,
					success: (e) => {
						this.$Message.success('复制成功')
					},
					error: () => {
						this.$Message.error('复制失败')
					}
				}
			}
		})
	},
	mounted(){
		
	}
}
</script>

<style lang="less" scoped>
.icons{
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
		position: relative;
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
