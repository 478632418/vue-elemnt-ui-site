import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import "./plugins/element.js";
import "./assets/css/global.css";
import TreeTable from "vue-table-with-tree-grid";

// 导入NProgress进度条
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import VueQuillEditor from "vue-quill-editor";

import "quill/dist/quill.core.css"; // import styles
import "quill/dist/quill.snow.css"; // for snow theme
import "quill/dist/quill.bubble.css"; // for bubble theme

Vue.use(VueQuillEditor /* { default global options } */);

// 在requeset拦截中，打开进度条NProgress.start()
axios.interceptors.request.use((config) => {
    //console.log(config);
    // 开始进度条
    NProgress.start();
    config.headers.Authorization = window.sessionStorage.getItem("token");
    return config;
});

// 在response拦截中，隐藏进度条NProgress.done()
axios.interceptors.response.use((config) => {
    //console.log(config);
    NProgress.done();
    return config;
});

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

Vue.component("tree-table", TreeTable);

Vue.filter("dateFormat", function(value) {
    // orignalVal时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const dateTime = new Date(value);
    const yyyy = dateTime.getFullYear();
    const mm = (dateTime.getMonth() + 1 + "").padStart(2, "0");
    const dd = (dateTime.getDate() + "").padStart(2, "0");
    const hours = (dateTime.getHours() + "").padStart(2, "0");
    const minutes = (dateTime.getMinutes() + "").padStart(2, "0");
    const seconds = (dateTime.getSeconds() + "").padStart(2, "0");

    return `${yyyy}-${mm}-${dd} ${hours}:${minutes}:${seconds}`;
});
Vue.filter("moneyFormat", function(value) {
    if (!value) return "0.00";
    value = value + "";
    var intPart = Number(value).toFixed(0); //获取整数部分
    var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); //将整数部分逢三一断
    var floatPart = ".00"; //预定义小数部分
    var value2Array = value.split(".");
    //=2表示数据有小数位
    if (value2Array.length == 2) {
        floatPart = value2Array[1].toString(); //拿到小数部分
        if (floatPart.length == 1) {
            //补0,
            return intPartFormat + "." + floatPart + "0";
        } else {
            return intPartFormat + "." + floatPart;
        }
    } else {
        return intPartFormat + floatPart;
    }
});

var vue = new Vue({
    router,
    render: (h) => h(App)
});

vue.$mount("#app");
