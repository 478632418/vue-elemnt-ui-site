<template>
    <div>
        <!--定义区-->
        <!--面包屑 导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区-->
        <el-card>
            <el-alert title="注意：只允许第三级分类设置相关参数！" type="warning" :closable="false" show-icon> </el-alert>
            <el-row>
                <el-col class="cat_col">
                    <span>请选择商品分类：</span>
                    <el-cascader
                        v-model="categorySelect.selectedValue"
                        :options="categorySelect.options"
                        :props="{ expandTrigger: 'hover', label: 'name', value: 'id', children: 'children' }"
                        @change="handleSelectChange"
                        filterable
                        clearable
                        style="width:250px"
                    ></el-cascader>
                </el-col>
            </el-row>
            <!--选项卡-->
            <el-tabs v-model="tabActiveName" @tab-click="handleTabClick" tab-position="top">
                <!--添加动态参数面板-->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="disableBtn" @click="showCreateDialog()">添加参数</el-button>
                    <!--动态参数表格-->
                    <el-table :data="tabManyTableData" border stripe>
                        <!--展开行列-->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(name, index) in scope.row.attr_vals" :key="index" closable>
                                    {{ name }}
                                </el-tag>
                                <!--输入文本框-->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <!--添加按钮-->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                <!-- {{ scope.row }} -->
                            </template>
                        </el-table-column>
                        <!--索引列-->
                        <el-table-column label="#" type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParamById(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!--添加静态属性面板-->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="disableBtn" @click="showCreateDialog()">添加属性</el-button>
                    <!--静态参数表格-->
                    <el-table :data="tabOnlyTableData" border stripe>
                        <!--展开行列-->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(name, index) in scope.row.attr_vals" :key="index" closable>
                                    {{ name }}
                                </el-tag>
                                <!--输入文本框-->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <!--添加按钮-->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                <!-- {{ scope.row }} -->
                            </template>
                        </el-table-column>
                        <!--索引列-->
                        <el-table-column label="#" type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParamById(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!--添加动态参数、静态属性-->
        <el-dialog :title="'添加' + dialogTitle" :visible.sync="createDialogVisible" width="50%" @close="closeCreateDialog()">
            <el-form :model="createParamForm" :rules="createParamFormRules" ref="createParamFormRef" label-width="100px">
                <el-form-item :label="inputTitle" prop="attr_name">
                    <el-input v-model="createParamForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="createDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitCreateForm()">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!--编辑动态参数、静态属性-->
        <el-dialog :title="'编辑' + dialogTitle" :visible.sync="editDialogVisible" width="50%" @close="closeEditDialog()">
            <el-form :model="editParamForm" :rules="editParamFormRules" ref="editParamFormRef" label-width="100px">
                <el-form-item :label="inputTitle" prop="attr_name">
                    <el-input v-model="editParamForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitEditForm()">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "ParamsList",
    // 数据定义
    data() {
        return {
            // 分类级联选择器
            categorySelect: {
                // 选择的值
                selectedValue: [],
                // 选择器填充值
                options: []
            },
            //tab选中项name,默认选中第一个选项卡
            tabActiveName: "many",
            //tab[name='many']面板中填充值
            tabManyTableData: [],
            //tab[name='only']面板中填充值
            tabOnlyTableData: [],
            // 添加动态参数、静态属性对话框是否显示
            createDialogVisible: false,
            // 添加动态参数、静态属性 form
            createParamForm: {
                attr_name: ""
            },
            // 添加动态参数、静态属性 rules
            createParamFormRules: {
                attr_name: [{ required: true, message: "请输入名称", trigger: "blur" }]
            },
            // 编辑动态参数、静态属性对话框是否显示
            editDialogVisible: false,
            // 编辑动态参数、静态属性 form
            editParamForm: {
                attr_name: ""
            },
            // 编辑动态参数、静态属性 rules
            editParamFormRules: {
                attr_name: [{ required: true, message: "请输入名称", trigger: "blur" }]
            }
        };
    },
    // 声明周期函数created：在初始化创建vue过程中触发的事件
    created() {
        this.loadCategorySelectOptions();
    },
    // 注册方法
    methods: {
        // 填充级联选择器值
        async loadCategorySelectOptions() {
            // const { data: res } = await this.$http.get("/goods/categories", { params: { type: [0, 1, 2] } });
            // if (res.meta.status !== 200) {
            //     this.$message.error("加载商品分类失败！");
            // }

            // this.categorySelect.options=res.data;
            this.categorySelect.options = [
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
        },
        // 级联选择器选择内容发生监听事件
        handleSelectChange() {
            this.loadParamList();
        },
        // tab切换时监听到的事件
        handleTabClick() {
            this.loadParamList();
        },
        async loadParamList() {
            // 设置只有第三层才能选中
            if (this.categorySelect.selectedValue.length != 3) {
                this.categorySelect.selectedValue = [];
                this.tabManyTableData = [];
                this.tabOnlyTableData = [];
                return;
            }

            // console.log(this.categorySelect.selectedValue);
            // // 根据当前选择的三级分类和选项卡选中类型，去请求网络请求填充tab面板中内容
            // const { data: res } = await this.$http.get(`/categories/${this.selectCategoryId}/atrributes`, { params: { sel: this.tabActiveName } });
            // if (res.meta.status !== 200) {
            //     this.$message.error("获取参数列表失败！");
            // }

            // if (this.tabActiveName === "many") {
            //     this.tabManyTableData = res.data;
            // } else {
            //     this.tabOnlyTableData = res.data;
            // }

            if (this.tabActiveName === "many") {
                let items = [
                    // attr_sel only-输入框（唯一），many-后台下拉列表/前台单选框
                    // attr_write manual-手工录入，list-从列表选择
                    // attr_vals 如果attr_write:list，那么有值，该值以逗号分割
                    { attr_id: 1, attr_name: "参数1", cat_id: 1, attr_sel: "many", attr_write: "manual", attr_vals: "1 2 3" },
                    { attr_id: 2, attr_name: "参数2", cat_id: 1, attr_sel: "many", attr_write: "list", attr_vals: "4 5 6" }
                ];
                items.forEach((item) => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
                    // 控制文本输入框是否显示，默认不显示
                    item.inputVisible = false;
                    // 文本框中值
                    item.inputValue = "";
                });
                // 必须items提前扩展属性inputVisible/inputValue，否则会导致后边showInput函数出现错误，同时显示效果也不正常
                this.tabManyTableData = items;
            } else {
                let items = [
                    { attr_id: 1, attr_name: "属性1", cat_id: 1, attr_sel: "only", attr_write: "manual", attr_vals: "1 2 3" },
                    { attr_id: 2, attr_name: "属性2", cat_id: 1, attr_sel: "only", attr_write: "list", attr_vals: "4 5 6" }
                ];
                items.forEach((item) => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
                    // 控制文本输入框是否显示，默认不显示
                    item.inputVisible = false;
                    // 文本框中值
                    item.inputValue = "";
                });
                // 必须items提前扩展属性inputVisible/inputValue，否则会导致后边showInput函数出现错误，同时显示效果也不正常
                this.tabOnlyTableData = items;
            }
        },
        // 显示'添加动态参数、静态属性'对话框
        showCreateDialog() {
            this.createDialogVisible = true;
        },
        // 关闭'添加动态参数、静态属性'对话框
        closeCreateDialog() {
            this.$refs.createParamFormRef.resetFields();
        },
        // 提交'添加动态参数、静态属性'
        submitCreateForm() {
            this.$refs.createParamFormRef.validate(async (valid) => {
                if (!valid) {
                    return;
                }

                // const { data: res } = await this.$http.post(`categories/${this.selectCategoryId}/attributes`, {
                //     attr_name: this.createParamForm.atrr_name,
                //     attr_sel: this.tabActiveName
                // });

                // if(res.meta.status!==200){
                //     this.$message.error("添加"+this.dialogTitle+"失败！");
                // }

                this.$message.success("添加" + this.dialogTitle + "成功！");
                this.createDialogVisible = true;
                this.loadParamList();
            });
        },
        // 显示'编辑动态参数、静态属性'对话框
        async showEditDialog(paramInfo) {
            console.log(paramInfo);

            // // 发起网络请求，根据cat_id,atrr_id,atrr_sel查询参数信息
            // const { data: res } = await this.$$http.get(`/categories/${this.selectCategoryId}/attributes/${paramInfo.attr_id}`, {
            //     params: { attr_sel: this.tabActiveName }
            // });
            // if (res.meta.status !== 200) {
            //     this.$message.error("加载" + this.inputTitle + "失败！");
            // }

            this.editParamForm = paramInfo;
            console.log(this.editParamForm);
            this.editDialogVisible = true;
        },
        // 关闭'编辑动态参数、静态属性'对话框
        closeEditDialog() {
            this.$refs.editParamFormRef.resetFields();
        },
        // 提交'添加动态参数、静态属性'
        submitEditForm() {
            this.$refs.editParamFormRef.validate(async (valid) => {
                if (!valid) {
                    return;
                }

                const { data: res } = await this.$http.post(`categories/${this.selectCategoryId}/attributes/${this.editParamForm.attr_id}`, {
                    attr_name: this.createParamForm.atrr_name,
                    attr_sel: this.tabActiveName
                });

                if (res.meta.status !== 200) {
                    this.$message.error("编辑" + this.dialogTitle + "失败！");
                }

                this.$message.success("编辑" + this.dialogTitle + "成功！");
                this.createDialogVisible = true;
                this.loadParamList();
            });
        },
        // 根据id删除参数
        async removeParamById(attr_id) {
            const confirmResult = await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).catch((err) => err);

            if (confirmResult !== "confirm") {
                return this.$message.info("已经取消操作！");
            }

            const { data: res } = await this.$http.delete(`/categories/${this.selectCategoryId}/attributes/${attr_id}`);
            if (res.meta.status !== 200) {
                this.$message.error("删除" + dialogTitle + "失败！");
            }

            this.$message.success("删除" + this.dialogTitle + "成功！");
            this.loadParamList();
        },
        // 点击+按钮事件，触发显示输入文本框
        showInput(row) {
            row.inputVisible = true;
            // 输入框自动获取焦点
            // $nextTick()函数作用，等待输入框渲染后才调用（上边设置inputVisible=true，并不会立即生效，直接调用$refs.input.focus()会抛出异常）
            this.$nextTick((_) => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 文本框失去焦点、或按下Enter都会触发
        async handleInputConfirm(row) {
            // 如果输入不合法，就置位空
            if (row.inputValue.trim().length === 0) {
                row.inputValue = "";
                row.inputVisible = false;
                return;
            }

            // 不为空，就需要进行保存等后续处理
            // 发起网络请求
            row.attr_vals.push(row.inputValue.trim()); // 在数组的末属添加一个或多个元素
            row.inputValue = "";
            row.inputVisible = false;
            const { data: res } = await this.$http.post(`/categories/${this.selectCategoryId}/attributes/${row.attr_id}`, {
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                attr_vals: row.attr_vals.join(" ")
            });

            if (res.meta.status !== 200) {
                row.attr_vals.pop(); // pop()方法把数组中的最后一个元素删除
                return this.$message.error("添加失败！");
            }

            this.$message.success("添加成功！");
        }
    },
    computed: {
        // 如果选中的商品分类不是第三级，btn就不允许使用、
        disableBtn() {
            if (this.categorySelect.selectedValue.length !== 3) {
                return true;
            }
            return false;
        },
        // 当前所选择的三级分类id
        selectCategoryId() {
            if (this.categorySelect.selectedValue.length === 3) {
                return this.categorySelect.selectedValue[2];
            }
            return null;
        },
        // 添加 动态参数、静态属性 对话框title
        dialogTitle() {
            if (this.tabActiveName === "many") {
                return "动态参数";
            }
            return "静态属性";
        },
        // 添加 动态参数、静态属性 input title
        inputTitle() {
            if (this.tabActiveName === "many") {
                return "参数名称";
            }
            return "属性名称";
        }
    }
};
</script>
<style lang="less" scoped>
.cat_col {
    margin: 15px 0;
    font-size: 14px;
}
.el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>
