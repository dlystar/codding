import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isShowPrint: false
    },
    mutations: {
        setIsShowPrint(state,value){
            state.isShowPrint = value
        }
    },
    actions: {

    },
    modules: {
        user,
        app
    }
})