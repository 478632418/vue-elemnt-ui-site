<template>
    <div>
        <!--面包屑 导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
            <el-breadcrumb-item>分类列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区-->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showCreateCategoryDialog()">添加分类</el-button>
                </el-col>
            </el-row>
            <!--
                show-header	是否显示表头	Boolean	-	默认：true
                show-row-hover	鼠标悬停时，是否高亮当前行
                stripe	是否显示间隔斑马纹
                border	是否显示纵向边框
                expand-type	是否为展开行类型表格（为 True 时，需要添加名称为 '$expand' 的作用域插槽, 它可以获取到 row, rowIndex)  
                selection-type	是否为多选类型表格	Boolean	-	false  
            -->
            <tree-table
                class="treeTable"
                ref="categoryZkTableRef"
                border
                stripe
                show-index
                index-text="#"
                :selection-type="false"
                :expand-type="false"
                :data="categoryList"
                :columns="categoryZkTableColumns"
            >
                <template slot="deleted" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.deleted === false" style="color:lightgreen;"></i>
                    <i class="el-icon-success" v-else style="color:red;"></i>
                </template>
                <template slot="level" slot-scope="scope">
                    <el-tag v-if="scope.row.level === 0" type="info" size="mini">一级</el-tag>
                    <el-tag v-else-if="scope.row.level === 1" type="success" size="mini">二级</el-tag>
                    <el-tag v-else type="warning" size="mini">三级</el-tag>
                </template>
                <template slot="operation">
                    <!--修改按钮-->
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <!--删除按钮-->
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </tree-table>
            <!---分页-->
            <el-pagination
                background
                :page-sizes="[10, 20, 50, 100, 200]"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-size="queryInfo.pageSize"
                :current-page="queryInfo.pageNum"
                :total="this.total"
                layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination>
        </el-card>

        <!--添加分类对话框-->
        <el-dialog title="添加分类" :visible.sync="createCategoryDialogVisible" width="50%" @close="createCategoryDialogClosed">
            <!--内容主题区-->
            <el-form :model="createCategoryForm" :rules="createCategoryFormRules" ref="createCategoryFormRef" label-width="70px">
                <el-form-item label="分类名" prop="name">
                    <el-input v-model="createCategoryForm.name"></el-input>
                </el-form-item>
                <el-form-item label="父分类" prop="parentId">
                    <el-cascader
                        v-model="createCategoryForm.cascaderSelectedValue"
                        :options="categoryCascaderOptions"
                        :props="{ expandTrigger: 'hover', checkStrictly: 'true', label: 'name', value: 'id', children: 'children' }"
                        @change="cascaderHandleChange"
                        filterable
                        clearable 
                        style="width:100%"
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <!--内容底部按钮区-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="createCategoryDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitCreateCategoryForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 商品分类列表
            categoryList: [],
            categoryZkTableColumns: [
                {
                    label: "分类名称",
                    prop: "name"
                },
                {
                    label: "是否有效",
                    // 标识当前列定义为模板
                    type: "template",
                    template: "deleted"
                },
                {
                    label: "排序",
                    // 标识当前列定义为模板
                    type: "template",
                    template: "level"
                },
                {
                    label: "操作",
                    // 标识当前列定义为模板
                    type: "template",
                    template: "operation",
                    width: "185px"
                }
            ],
            // 商品分类总记录数
            total: 0,
            // 查询网络接口参数
            queryInfo: {
                pageSize: 10,
                pageNum: 1
            },
            // 添加分类对话框是否显示
            createCategoryDialogVisible: false,
            // 添加分类对话框中父级分类级联选择项
            categoryCascaderOptions: [],
            // 添加分类表单
            createCategoryForm: {
                name: "",
                parentId: 0,
                level: 0,
                cascaderSelectedValue: null
            },
            // 添加分类提交时，校验规则
            createCategoryFormRules: {
                name: [
                    { required: true, message: "请输入分类名称", trigger: "blur" },
                    { min: 2, max: 32, message: "分类名称长度在2到32之间", trigger: "blur" }
                ]
            }
        };
    },
    // 生命周期函数created，加载商品分裂
    created() {
        // 加载商品分类列表
        this.getCategoryList();
    },
    mounted() {
        // 去掉el-cascader中的radio，参考：https://blog.csdn.net/weixin_42333170/article/details/104007876?utm_medium=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.control&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.control
        setInterval(function() {
            document.querySelectorAll(".el-cascader-node__label").forEach((el) => {
                el.onclick = function() {
                    if (this.previousElementSibling) this.previousElementSibling.click();
                };
            });
        }, 1000);
    },
    methods: {
        async getCategoryList() {
            // const { data: res } = await this.$http.get("goolds/categories/list");
            // if (res.meta.status !== 200) {
            //     this.$message.error("加载商品分类失败！");
            // }
            // this.categoryList=res.data;

            this.categoryList = [
                {
                    id: 1,
                    name: "家用电器",
                    parentId: 0,
                    deleted: false,
                    level: 0,
                    children: [
                        // 电视  超薄电视 全面屏电视 智能电视 教育电视 OLED电视 智慧屏4K 超清电视 55英寸 65英寸 电视配件
                        {
                            id: 1001,
                            name: "电视",
                            parentId: 1,
                            deleted: false,
                            level: 1,
                            children: [
                                { id: 1001001, name: "超薄电视", parentId: 1001, deleted: false, level: 2 },
                                { id: 1001002, name: "全面屏电视", parentId: 1001, deleted: false, level: 2 },
                                { id: 1001003, name: "智能电视", parentId: 1001, deleted: false, level: 2 },
                                { id: 1001004, name: "教育电视", parentId: 1001, deleted: false, level: 2 },
                                { id: 1001005, name: "OLED电视", parentId: 1001, deleted: false, level: 2 },
                                { id: 1001006, name: "智慧屏4K", parentId: 1001, deleted: false, level: 2 },
                                { id: 1001007, name: "超清电视", parentId: 1001, deleted: false, level: 2 },
                                { id: 1001008, name: "电视配件", parentId: 1001, deleted: false, level: 2 }
                            ]
                        },
                        // 空调  空调挂机 空调柜机 中央空调 变频空调 一级能效 移动空调 以旧换新
                        {
                            id: 1002,
                            name: "空调",
                            parentId: 1,
                            deleted: false,
                            level: 1,
                            children: [
                                { id: 1002001, name: "空调挂机", parentId: 1002, deleted: false, level: 2 },
                                { id: 1002002, name: "空调柜机", parentId: 1002, deleted: false, level: 2 },
                                { id: 1002003, name: "中央空调", parentId: 1002, deleted: false, level: 2 },
                                { id: 1002004, name: "变频空调", parentId: 1002, deleted: false, level: 2 },
                                { id: 1002005, name: "一级能效", parentId: 1002, deleted: false, level: 2 },
                                { id: 1002006, name: "移动空调", parentId: 1002, deleted: false, level: 2 },
                                { id: 1002007, name: "以旧换新", parentId: 1002, deleted: false, level: 2 }
                            ]
                        },
                        // 冰箱  多门 对开门 三门 双门 冷柜/冰吧 酒柜 冰箱配件
                        {
                            id: 1003,
                            name: "冰箱",
                            parentId: 1,
                            deleted: false,
                            level: 1,
                            children: [
                                { id: 1003001, name: "多门", parentId: 1003, deleted: false, level: 2 },
                                { id: 1003002, name: "对开门", parentId: 1003, deleted: false, level: 2 },
                                { id: 1003003, name: "三门", parentId: 1003, deleted: false, level: 2 },
                                { id: 1003004, name: "双门", parentId: 1003, deleted: false, level: 2 },
                                { id: 1003005, name: "冷柜/冰吧", parentId: 1003, deleted: false, level: 2 },
                                { id: 1003006, name: "酒柜", parentId: 1003, deleted: false, level: 2 },
                                { id: 1003007, name: "冰箱配件", parentId: 1003, deleted: false, level: 2 }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    name: "电脑/办公",
                    parentId: 0,
                    deleted: false,
                    level: 0,
                    children: [
                        // 电脑整机  笔记本 游戏本 平板电脑 台式机 一体机 服务器/工作站
                        {
                            id: 2001,
                            name: "电脑整机",
                            parentId: 2,
                            deleted: false,
                            level: 1,
                            children: [
                                { id: 2001001, name: "笔记本", parentId: 2001, deleted: false, level: 2 },
                                { id: 2001002, name: "游戏本", parentId: 2001, deleted: false, level: 2 },
                                { id: 2001003, name: "平板电脑", parentId: 2001, deleted: false, level: 2 },
                                { id: 2001004, name: "台式机", parentId: 2001, deleted: false, level: 2 },
                                { id: 2001005, name: "一体机", parentId: 2001, deleted: false, level: 2 },
                                { id: 2001006, name: "服务器/工作站", parentId: 2001, deleted: false, level: 2 }
                            ]
                        },
                        // 游戏设备  游戏机 游戏耳机 手柄/方向盘 游戏软件 游戏周边
                        {
                            id: 2002,
                            name: "游戏设备",
                            parentId: 2,
                            deleted: false,
                            level: 1,
                            children: [
                                { id: 2002001, name: "游戏机", parentId: 2001, deleted: false, level: 2 },
                                { id: 2002002, name: "游戏耳机", parentId: 2001, deleted: false, level: 2 },
                                { id: 2002003, name: "手柄/方向盘", parentId: 2001, deleted: false, level: 2 },
                                { id: 2002004, name: "游戏软件", parentId: 2001, deleted: false, level: 2 },
                                { id: 2002005, name: "游戏周边", parentId: 2001, deleted: false, level: 2 }
                            ]
                        }
                    ]
                }
            ];

            this.total = 100;
        },
        // 每页显示记录数修改时
        handleSizeChange(val) {
            this.queryInfo.pageSize = val;
            this.getCategoryList();
        },
        // 当前分页索引页修改时
        handleCurrentChange(val) {
            this.queryInfo.pageNum = val;
            this.getCategoryList();
        },
        // 显示‘添加分类’对话框
        async showCreateCategoryDialog() {
            // // 网络请求加载分类
            // const { data: res } = await this.$http.get("goods/categories", { params: { level: [0, 1] } });
            // if (res.meta.status !== 200) {
            //     this.$message.error("加载商品分类失败！");
            // }
            // this.categoryCascaderOptions = res.data;
            this.categoryCascaderOptions = [
                {
                    id: 1,
                    name: "家用电器",
                    parentId: 0,
                    deleted: false,
                    level: 0,
                    children: [
                        // 电视  超薄电视 全面屏电视 智能电视 教育电视 OLED电视 智慧屏4K 超清电视 55英寸 65英寸 电视配件
                        {
                            id: 1001,
                            name: "电视",
                            parentId: 1,
                            deleted: false,
                            level: 1
                        },
                        // 空调  空调挂机 空调柜机 中央空调 变频空调 一级能效 移动空调 以旧换新
                        {
                            id: 1002,
                            name: "空调",
                            parentId: 1,
                            deleted: false,
                            level: 1
                        },
                        // 冰箱  多门 对开门 三门 双门 冷柜/冰吧 酒柜 冰箱配件
                        {
                            id: 1003,
                            name: "冰箱",
                            parentId: 1,
                            deleted: false,
                            level: 1
                        }
                    ]
                },
                {
                    id: 2,
                    name: "电脑/办公",
                    parentId: 0,
                    deleted: false,
                    level: 0,
                    children: [
                        // 电脑整机  笔记本 游戏本 平板电脑 台式机 一体机 服务器/工作站
                        {
                            id: 2001,
                            name: "电脑整机",
                            parentId: 2,
                            deleted: false,
                            level: 1
                        },
                        // 游戏设备  游戏机 游戏耳机 手柄/方向盘 游戏软件 游戏周边
                        {
                            id: 2002,
                            name: "游戏设备",
                            parentId: 2,
                            deleted: false,
                            level: 1
                        }
                    ]
                }
            ];

            this.createCategoryDialogVisible = true;
        },
        // 点击‘添加分类’对话框中‘确定’按钮
        async submitCreateCategoryForm() {
            this.$refs.createCategoryForm.validate(async (valid) => {
                if (!valid) {
                    return;
                }
                // //console.log(this.createCategoryForm);
                // const { data: res } = await this.$http.post("/goods/categoryies/save", this.createCategoryForm);
                // if (res.meta.status !== 200) {
                //     this.$message.error("添加商品分类失败！");
                // }

                this.$message.success("添加商品分类成功！");
                this.getCategoryList();
                this.createCategoryDialogVisible = false;
            });
        },
        // 关闭‘添加分类’对话框监听事件
        createCategoryDialogClosed() {
            this.$refs.createCategoryFormRef.resetFields();
            this.createCategoryForm.level = 0;
            this.createCategoryForm.parentId = 0;
            this.createCategoryForm.cascaderSelectedValue = [];
        },
        // cascader空间选择内容发生变化时，触发事件
        cascaderHandleChange() {
            // console.log(this.createCategoryForm.cascaderSelectedValue);
            if (this.createCategoryForm.cascaderSelectedValue != undefined && this.createCategoryForm.cascaderSelectedValue.length > 0) {
                this.createCategoryForm.parentId = this.createCategoryForm.cascaderSelectedValue[this.createCategoryForm.cascaderSelectedValue.length - 1];
                this.createCategoryForm.level = this.createCategoryForm.cascaderSelectedValue.length;
            } else {
                this.createCategoryForm.parentId = 0;
                this.createCategoryForm.level = 0;
            }
        }
    }
};
</script>
<style lang="less" scoped>
.treeTable {
    margin-top: 15px;
}
</style>
