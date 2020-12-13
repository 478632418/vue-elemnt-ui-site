<template>
    <div>
        <!--面包屑 导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
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
                <el-col :span="4">
                    <el-button type="primary" @click="gotoCreateGood">添加商品</el-button>
                </el-col>
            </el-row>

            <!--商品列表区-->
            <el-table :data="goodsList" stripe border>
                <!--索引-->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="name" label="商品名称"></el-table-column>
                <el-table-column prop="price" label="商品价格(元)" width="90px">
                    <template slot-scope="scope">
                        {{ scope.row.price | moneyFormat }}
                    </template>
                </el-table-column>
                <el-table-column prop="weight" label="商品质量" width="90px"></el-table-column>
                <el-table-column label="创建时间" width="140px">
                    <template slot-scope="scope">
                        {{ scope.row.createTime | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.id)"></el-button>
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
    </div>
</template>
<script>
export default {
    name: "GoodsList",
    // 数据定义
    data() {
        return {
            // 查询参数
            queryInfo: {
                pageSize: 10,
                pageNum: 1,
                query: ""
            },
            // 总商品记录数
            total: 0,
            // 商品列表
            goodsList: []
        };
    },
    // 声明周期函数created：在初始化创建vue过程中触发的事件
    created() {
        // 加载商品列表
        this.loadGoodsList();
    },
    // 注册方法
    methods: {
        // 加载商品列表
        async loadGoodsList() {
            // const { data: res } = await this.$http.get("", { params: this.queryInfo });
            // if (res.meta.status !== 200) {
            //     this.$message.error("加载商品列表失败！");
            // }

            // this.goodsList = res.data;
            this.goodsList = [
                {
                    id: 1,
                    name: "TCL 55L8 55英寸 4K超高清电视 智慧语音 超薄机身 杜比+DTS双解码 智能网络液晶电视",
                    price: 1999.0,
                    weight: "10kg",
                    state: 0,
                    createTime: 1607607525000,
                    updateTime: 1607607525000
                },
                {
                    id: 2,
                    name: "海信（Hisense）60E3F 60英寸 4K超高清 智慧语音 超薄悬浮全面屏大屏精致圆角液晶电视机 教育电视 人工智能",
                    price: 2299.0,
                    weight: "10kg",
                    state: 0,
                    createTime: 1607607525000,
                    updateTime: 1607607525000
                },
                {
                    id: 3,
                    name: "海信 VIDAA 43V1F-R 43英寸 全高清 海信电视 全面屏电视 智慧屏 1G+8G 教育电视 人工智能液晶平板电视",
                    price: 1299.0,
                    weight: "10kg",
                    state: 0,
                    createTime: 1607607525000,
                    updateTime: 1607607525000
                },
                {
                    id: 4,
                    name: "TCL 50L2 50英寸 4K超高清电视 健康护眼 超薄机身 杜比+DTS双解码 影视教育 智能网络液晶平板电视机",
                    price: 1699.0,
                    weight: "10kg",
                    state: 0,
                    createTime: 1607607525000,
                    updateTime: 1607607525000
                },
                {
                    id: 5,
                    name: "TCL 50L2 50英寸 4K超高清电视 健康护眼 超薄机身 杜比+DTS双解码 影视教育 智能网络液晶平板电视机",
                    price: 1699.0,
                    weight: "10kg",
                    state: 0,
                    createTime: 1607607525000,
                    updateTime: 1607607525000
                },
                {
                    id: 6,
                    name: "TCL 50L2 50英寸 4K超高清电视 健康护眼 超薄机身 杜比+DTS双解码 影视教育 智能网络液晶平板电视机",
                    price: 1699.0,
                    weight: "10kg",
                    state: 0,
                    createTime: 1607607525000,
                    updateTime: 1607607525000
                },
                {
                    id: 7,
                    name: "TCL 50L2 50英寸 4K超高清电视 健康护眼 超薄机身 杜比+DTS双解码 影视教育 智能网络液晶平板电视机",
                    price: 1699.0,
                    weight: "10kg",
                    state: 0,
                    createTime: 1607607525000,
                    updateTime: 1607607525000
                },
                {
                    id: 8,
                    name: "TCL 50L2 50英寸 4K超高清电视 健康护眼 超薄机身 杜比+DTS双解码 影视教育 智能网络液晶平板电视机",
                    price: 1699.0,
                    weight: "10kg",
                    state: 0,
                    createTime: 1607607525000,
                    updateTime: 1607607525000
                },
                {
                    id: 9,
                    name: "TCL 50L2 50英寸 4K超高清电视 健康护眼 超薄机身 杜比+DTS双解码 影视教育 智能网络液晶平板电视机",
                    price: 1699.0,
                    weight: "10kg",
                    state: 0,
                    createTime: 1607607525000,
                    updateTime: 1607607525000
                },
                {
                    id: 10,
                    name: "TCL 50L2 50英寸 4K超高清电视 健康护眼 超薄机身 杜比+DTS双解码 影视教育 智能网络液晶平板电视机",
                    price: 1699.0,
                    weight: "10kg",
                    state: 0,
                    createTime: 1607607525000,
                    updateTime: 1607607525000
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
            this.loadGoodsList();
        },
        // 根据id删除
        async removeById(id) {
            const confirmResult = await this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).catch((err) => err);
            if (confirmResult !== "confirm") {
                return this.$message.info("已经取消删除操作！");
            }

            const { data: res } = await this.$http.delete(`/goods/${id}`);
            if (res.meta.status !== 200) {
                return this.$message.error("删除商品失败！");
            }

            this.$message.error("删除商品成功！");
            this.loadGoodsList();
        },
        // 跳转到添加商品页面
        gotoCreateGood(){
            this.$router.push("/goods/add");
        }
    }
};
</script>
<style lang="less" scoped></style>
