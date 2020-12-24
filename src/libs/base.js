exports.install = function (Vue, options) {
    Vue.prototype.showPrint = function (){
        this.isShowPrint = true
        // this.$store.commit('setIsShowPrint',true)
    };
    Vue.prototype.closePrint = function (){
        this.isShowPrint = false
        // this.$store.commit('setIsShowPrint',false)
    };
};