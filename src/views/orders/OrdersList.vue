<template>
    <div>
        <!--面包屑 导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图区-->
        <el-card>
            <!--搜索框-->
            <el-row :gutter="10">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="search()">
                        <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!--商品列表区-->
            <el-table :data="orderList" stripe border>
                <!--索引-->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="number" label="订单编号"></el-table-column>
                <el-table-column prop="price" label="订单价格(元)" width="90px">
                    <template slot-scope="scope">
                        {{ scope.row.price | moneyFormat }}
                    </template>
                </el-table-column>
                <el-table-column prop="ispay" label="是否付款" width="90px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.ispay === 1" type="success" size="mini">已付款</el-tag>
                        <el-tag v-else type="danger" size="mini">未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="issend" label="是否发货" width="90px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.issend === 1" type="success" size="mini">已发货</el-tag>
                        <el-tag v-else type="danger" size="mini">未发货</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="下单时间" width="140px">
                    <template slot-scope="scope">
                        {{ scope.row.createTime | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editOrderDialogVisible=true"></el-button>
                        <el-button type="success" icon="el-icon-setting" size="mini" @click="loadProgressInfoList(scope.row.id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="this.queryInfo.pageNum"
                :page-sizes="[10, 20, 50, 100, 200]"
                :page-size="this.queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="this.total"
                background
            >
            </el-pagination>
        </el-card>

        <!--物流进度对话框-->
        <el-dialog title="物流进度" :visible.sync="progressDialogVisible" width="50%">
            <el-timeline>
                <el-timeline-item v-for="(activity, index) in progressInfoList" :key="index" :timestamp="activity.createTime">
                    {{ activity.content }}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
        <!--编辑订单地址对话框-->
        <el-dialog title="添加分类" :visible.sync="editOrderDialogVisible" width="50%" @close="editOrderDialogClosed">
            <!--内容主题区-->
            <el-form :model="editOrderForm" :rules="editOrderFormRules" ref="editOrderFormRef">
                <el-form-item label="省市区/县" prop="address1">
                     <el-cascader
                        v-model="editOrderForm.address1"
                        :options="cascaderPCDOptions"
                        :props="{ expandTrigger: 'hover', label: 'label', value: 'value', children: 'children' }"
                        @change="cascaderHandleChange"
                        filterable
                        clearable 
                        style="width:100%"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="editOrderForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <!--内容底部按钮区-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editOrderDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitEditOrderForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
    </div>
</template>
<script>
// 导入省市区数据
import { regionData } from "element-china-area-data";

export default {
    name: "OrdersListView",
    // 数据定义
    data() {
        return {
            // 查询参数
            queryInfo: {
                query: "",
                pageSize: 10,
                pageNum: 0
            },
            // 订单列表
            orderList: [],
            // 总订单数
            total: 0,
            // 物流进度
            progressDialogVisible: false,
            // 物流进度信息列表
            progressInfoList: [],
            // 省市区多级选择器-可选值
            cascaderPCDOptions: regionData,
            // 省市区多级选择器-选择值
            cascaderPCDSelectValue: [],
            editOrderDialogVisible: false,
            editOrderForm: {
                // 省市区/县
                address1: [],
                // 详细地址
                address2: ""
            },
            editOrderFormRules: {
                address1: [{ required: true, message: "请输入省市区/县", trigger: "blur" }],
                address2: [{ required: true, message: "请输入详细地址", trigger: "blur" }]
            }
        };
    },
    // 声明周期函数created：在初始化创建vue过程中触发的事件
    created() {
        this.loadOrderList();
    },
    // 注册方法
    methods: {
        // 加载订单列表
        async loadOrderList() {
            // const { data: res } = await this.$http.get("orders", { params: this.queryInfo });
            // if (res.meta.status !== 200) {
            //     return this.$message.error("加载订单失败！");
            // }
            // this.orderList = res.data;
            this.orderList = [
                {
                    id: 1,
                    number: "order-0000-0000-0000-0000",
                    price: "33.30",
                    ispay: 1,
                    issend: 1,
                    invoiceTitle: "个人",
                    invoiceCompany: "",
                    invoiceContent: "",
                    consigneeAddr: "",
                    payStatus: "1",
                    createTime: new Date().getTime(),
                    updateTime: new Date().getTime()
                },
                {
                    id: 2,
                    number: "order-0000-0000-0000-0001",
                    price: "34.00",
                    ispay: 0,
                    issend: 0,
                    invoiceTitle: "公司",
                    invoiceCompany: "",
                    invoiceContent: "",
                    consigneeAddr: "",
                    payStatus: "1",
                    createTime: new Date().getTime(),
                    updateTime: new Date().getTime()
                },
                {
                    id: 3,
                    number: "order-0000-0000-0000-0002",
                    price: "133.30",
                    ispay: 0,
                    issend: 1,
                    invoiceTitle: "个人",
                    invoiceCompany: "",
                    invoiceContent: "",
                    consigneeAddr: "",
                    payStatus: "1",
                    createTime: new Date().getTime(),
                    updateTime: new Date().getTime()
                },
                {
                    id: 4,
                    number: "order-0000-0000-0000-0003",
                    price: "1033.30",
                    ispay: 1,
                    issend: 1,
                    invoiceTitle: "个人",
                    invoiceCompany: "",
                    invoiceContent: "",
                    consigneeAddr: "",
                    payStatus: "1",
                    createTime: new Date().getTime(),
                    updateTime: new Date().getTime()
                },
                {
                    id: 5,
                    number: "order-0000-0000-0000-0004",
                    price: "23900.30",
                    ispay: 1,
                    issend: 0,
                    invoiceTitle: "个人",
                    invoiceCompany: "",
                    invoiceContent: "",
                    consigneeAddr: "",
                    payStatus: "1",
                    createTime: new Date().getTime(),
                    updateTime: new Date().getTime()
                },
                {
                    id: 6,
                    number: "order-0000-0000-0000-0005",
                    price: "9839.30",
                    ispay: 1,
                    issend: 0,
                    invoiceTitle: "个人",
                    invoiceCompany: "",
                    invoiceContent: "",
                    consigneeAddr: "",
                    payStatus: "1",
                    createTime: new Date().getTime(),
                    updateTime: new Date().getTime()
                },
                {
                    id: 7,
                    number: "order-0000-0000-0000-0006",
                    price: "313.30",
                    ispay: 1,
                    issend: 0,
                    invoiceTitle: "个人",
                    invoiceCompany: "",
                    invoiceContent: "",
                    consigneeAddr: "",
                    payStatus: "1",
                    createTime: new Date().getTime(),
                    updateTime: new Date().getTime()
                },
                {
                    id: 8,
                    number: "order-0000-0000-0000-0007",
                    price: "133.30",
                    ispay: 1,
                    issend: 0,
                    invoiceTitle: "个人",
                    invoiceCompany: "",
                    invoiceContent: "",
                    consigneeAddr: "",
                    payStatus: "1",
                    createTime: new Date().getTime(),
                    updateTime: new Date().getTime()
                },
                {
                    id: 9,
                    number: "order-0000-0000-0000-0008",
                    price: "331.30",
                    ispay: 1,
                    issend: 1,
                    invoiceTitle: "个人",
                    invoiceCompany: "",
                    invoiceContent: "",
                    consigneeAddr: "",
                    payStatus: "1",
                    createTime: new Date().getTime(),
                    updateTime: new Date().getTime()
                },
                {
                    id: 10,
                    number: "order-0000-0000-0000-0010",
                    price: "1133.30",
                    ispay: 1,
                    issend: 1,
                    invoiceTitle: "个人",
                    invoiceCompany: "",
                    invoiceContent: "",
                    consigneeAddr: "",
                    payStatus: "1",
                    createTime: new Date().getTime(),
                    updateTime: new Date().getTime()
                }
            ];
            this.total = 100;
        },
        // 每页记录数修改
        handleSizeChange(newPageSize) {
            this.queryInfo.pageSize = newPageSize;
            this.loadGoodsList();
        },
        // 当前页切换
        handleCurrentChange(newPageNum) {
            this.queryInfo.pageNum = newPageNum;
            this.loadGoodsList();
        },
        // 搜索
        search() {
            this.loadOrderList();
        },
        // 根据id加载物流进度
        async loadProgressInfoList(id) {
            // const { data: res } = await this.$http.delete(`/orders/progress/${id}`);
            // if (res.meta.status !== 200) {
            //     return this.$message.error("物流进度失败！");
            // }
            // this.progressInfoList = res.data;

            this.progressInfoList = [
                { id: 1, content: '已签收[北京市]在官网"运单资料&签收图",可查看签收人信息', createTime: "2020-11-15/周日08:56:48" },
                { id: 2, content: "[北京市]快件到达 【北京海淀北大营业点】", createTime: "2020-11-15/周日05:21:42" },
                { id: 3, content: "[北京市]快件到达 【北京临时中转场】", createTime: "2020-11-15/周日00:11:58" },
                { id: 4, content: "[北京市]快件在【北京临时中转场】已装车,准备发往 【北京南法信中转场】", createTime: "2020-11-14/周六21:25:33" },
                { id: 5, content: "[无锡市]快件已发车", createTime: "2020-11-13/周五14:37:45" },
                { id: 6, content: "[无锡市]顺丰速运 已收取快件", createTime: "2020-11-13/周五20:11:37" },
                { id: 7, content: "您的订单由第三方卖家拣货完成，待出库交付顺丰快递，运单号为322786947164", createTime: "2020-11-13/周五20:11:37" },
                { id: 8, content: "已下单，您提交了订单，请等待第三方卖家系统确认", createTime: "2020-11-13/周五12:39:10" },
                { id: 9, content: "您的订单已进入第三方卖家仓库，准备出库", createTime: "2020-11-13/周五12:39:21" }
            ];
            this.progressDialogVisible = true;
        },
        // 编辑订单地址对话框
        editOrderDialogClosed(){
            this.$refs.editOrderFormRef.resetFields();
        },
        // 省市区/县 选择时间
        cascaderHandleChange(){
            if(this.editOrderForm.address1.length!==3){
                this.editOrderForm.address1=[];
                return false;
            }
        },
        // 提交编辑订单地址
        submitEditOrderForm(){
            this.$refs.editOrderFormRef.validate(async (valid)=>{
                if(!valid){
                    return;
                }

                // 执行动作
            });
        }
    }
};
</script>
<style lang="less" scoped>
.el-form-item__label {
    width:120px !important;
}
</style>
