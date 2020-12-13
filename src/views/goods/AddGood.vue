<template>
    <div>
        <!--定义区-->
        <!--面包屑 导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区-->
        <el-card>
            <!--警示信息-->
            <el-alert title="添加商品信息" type="info" :closable="false" center show-icon> </el-alert>
            <!--
                进度条区
                tabStepActiveIndex-0:代表将值转化为int类型
            -->
            <el-steps :active="tabStepActiveIndex - 0" align-center finish-status="success">
                <el-step title="基本步骤" description=""></el-step>
                <el-step title="商品参数" description=""></el-step>
                <el-step title="商品属性" description=""></el-step>
                <el-step title="商品图片" description=""></el-step>
                <el-step title="商品内容" description=""></el-step>
                <el-step title="完成" description=""></el-step>
            </el-steps>
            <!--
                tab选项卡区
                el-form:label-position='top'代表form表单控件对应label显示在form表单控件上边
            -->
            <el-form :model="addGoodForm" :rules="addGoodFormRules" ref="addGoodFormRef" label-width="100px" label-position="top">
                <el-tabs :tab-position="'left'" v-model="tabStepActiveIndex" :before-leave="tabBeforeLeave" @tab-click="tabClick">
                    <el-tab-pane label="基本步骤" name="0">
                        <el-form-item label="商品名称" prop="name">
                            <el-input v-model="addGoodForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格（元）" prop="price">
                            <el-input v-model="addGoodForm.price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品质量" prop="weight" type="number">
                            <el-input v-model="addGoodForm.weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="number" type="number">
                            <el-input v-model="addGoodForm.number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="catId">
                            <el-cascader v-model="addGoodForm.catId" :options="catOptions" :props="catProps" @change="handleCascaderChange" style="width:100%;"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <!--渲染表单item项-->
                        <el-form-item :label="item.attr_name" v-for="item in tabManyData" :key="item.attr_id">
                            <!--复选框组-->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox v-for="(cb, idx) in item.attr_vals" :label="cb" :key="idx" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <!--渲染表单item项-->
                        <el-form-item :label="item.attr_name" v-for="item in tabOnlyData" :key="item.attr_id">
                            <!--文本输入框-->
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!--
                            action 上传文件服务接口地址
                        -->
                        <el-upload
                            :action="uploadURL"
                            :headers="uploadHeaders"
                            :on-preview="handleUploadPreview"
                            :on-remove="handleUploadRemove"
                            :on-success="handleUploadSuccess"
                            :on-error="handleUploadError"
                            :file-list="uploadFileList"
                            list-type="picture"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!--富文本编辑器-->
                        <quill-editor v-model="addGoodForm.introduce" />
                        <el-button type="primary" class="addGoodBtn" @click="addGood">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!--对话提示框-->
        <el-dialog title="图片预览" :visible.sync="picPreviewDialogVisible" width="50%">
            <el-image :src="picPreviewUrl"></el-image>
        </el-dialog>
    </div>
</template>
<script>
import _ from "lodash";

export default {
    name: "",
    // 数据定义
    data() {
        return {
            // tab 选中的step index和 tab index
            tabStepActiveIndex: "0",
            // 商品动态参数数据
            tabManyData: [],
            // 商品静态属性数据
            tabOnlyData: [],
            // 上传图片服务器地址
            uploadURL: "/api/upload",
            // 上传图片headers
            uploadHeaders: {
                Authorization: window.sessionStorage.getItem("token")
            },
            // mock图片信息用
            uploadFileList: [],
            // 图片预览dialog是否显示
            picPreviewDialogVisible: false,
            // 图片预览图片url
            picPreviewUrl: "",
            // 添加商品form
            addGoodForm: {
                name: "",
                price: 0,
                weight: 0,
                number: 0,
                // 商品分类
                catId: [],
                // 商品图片
                pics: [],
                // 商品详情
                introduce: ""
            },
            catProps: {
                label: "name",
                value: "id",
                children: "children",
                expandTrigger: "hover"
            },
            catOptions: [],
            // 添加商品form验证规则
            addGoodFormRules: {
                name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
                price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
                weight: [{ required: true, message: "请输入商品重量", trigger: "blur" }],
                number: [{ required: true, message: "请输入商品数量", trigger: "blur" }],
                catId: [{ required: true, message: "请输入商品分类", trigger: "blur" }]
            }
        };
    },
    // 声明周期函数created：在初始化创建vue过程中触发的事件
    created() {
        this.loadCatList();
    },
    // 注册方法
    methods: {
        // 加载商品分类数据，用来填充多级选择器
        async loadCatList() {
            // const { data: res } = await this.$http.get("categories");
            // if (res.meta.data != 200) {
            //     return this.$message.error("加载商品分类失败！");
            // }

            // this.catOptions = res.data;

            this.catOptions = [
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
        // 商品分类选择切换事件
        handleCascaderChange() {
            if (this.addGoodForm.catId.length !== 3) {
                this.addGoodForm.catId = [];
                return;
            }
        },
        // tab切换前触发事件
        tabBeforeLeave(newActiveName, oldActiveName) {
            console.log("catId.length=" + this.addGoodForm.catId.length + "->newActiveName:" + newActiveName + "->oldActiveName:" + oldActiveName);
            if (this.addGoodForm.catId.length !== 3) {
                this.$message.error("请选择商品分类！");
                // 返回false，会导致取消tab切换动作
                return false;
            }
        },
        // tab 切换点击时触发事件
        async tabClick() {
            // 商品动态参数（attr_sel=many）
            if (this.tabStepActiveIndex === "1") {
                console.log("加载动态参数：" + this.tabStepActiveIndex);
                // const { data: res } = await this.$http.get(`/categories/${this.selectCatId}/attributes`, { params: { attr_sel: "many" } });
                // if (res.meta.status !== 200) {
                //     return this.$message.error("加载商品动态参数失败！");
                // }
                // this.tabManyData = res.data;

                let manyData = [
                    { attr_id: 1, attr_name: "板式", cat_id: 1, attr_sel: "many", attr_write: "manual", attr_vals: "人工智能55时4K观影曲面 30核HDR_55时4K超薄曲面 人工智能65时4K超薄曲面 人工智能" },
                    { attr_id: 2, attr_name: "颜色", cat_id: 1, attr_sel: "many", attr_write: "list", attr_vals: "黄色 黑色" }
                ];
                manyData.forEach((item) => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
                });
                this.tabManyData = manyData;
            }
            // 商品静态属性（attr_sel=only）
            else if (this.tabStepActiveIndex === "2") {
                console.log("加载静态属性：" + this.tabStepActiveIndex);
                // const { data: res } = await this.$http.get(`/categories/${this.selectCatId}/attributes`, { params: { attr_sel: "only" } });
                // if (res.meta.status !== 200) {
                //     return this.$message.error("加载商品静态属性失败！");
                // }
                // this.tabOnlyData = res.data;

                let onlyData = [
                    { attr_id: 1, attr_name: "主题-商品名称", cat_id: 1, attr_sel: "many", attr_write: "manual", attr_vals: "TCL电视 55A950C" },
                    { attr_id: 2, attr_name: "显示-曲面", cat_id: 1, attr_sel: "many", attr_write: "list", attr_vals: "是" },
                    { attr_id: 3, attr_name: "系统-智能电视", cat_id: 1, attr_sel: "many", attr_write: "list", attr_vals: "智能电视" },
                    { attr_id: 4, attr_name: "外观-壁挂安装", cat_id: 1, attr_sel: "many", attr_write: "list", attr_vals: "支持" },
                    { attr_id: 5, attr_name: "功耗-整机功耗（W）", cat_id: 1, attr_sel: "many", attr_write: "list", attr_vals: "120W" },
                    { attr_id: 6, attr_name: "端口-模拟RF接口", cat_id: 1, attr_sel: "many", attr_write: "list", attr_vals: "支持" },
                    { attr_id: 7, attr_name: "音频-扬声器数量", cat_id: 1, attr_sel: "many", attr_write: "list", attr_vals: "2" },
                    { attr_id: 8, attr_name: "交互设备-无线鼠标", cat_id: 1, attr_sel: "many", attr_write: "list", attr_vals: "支持" },
                    { attr_id: 9, attr_name: "互联互通-多屏互动", cat_id: 1, attr_sel: "many", attr_write: "list", attr_vals: "支持" }
                ];
                this.tabOnlyData = onlyData;
            }
        },
        // 上传图片预览
        handleUploadPreview(file) {
            console.log(file);
            this.picPreviewDialogVisible = true;
            this.picPreviewUrl = file.url;
        },
        // 上传图片移除
        handleUploadRemove(file, fileList) {
            console.log(file);
            console.log("file:" + file + ",file.url:" + file.url);
            // 1）获取将要删除的图片的tmp_path
            const tmpPath = file.url;
            // 2)从form#pics中找到pic=tmp_path的索引值
            const idx = this.addGoodForm.pics.findIndex((path) => path === tmpPath);
            console.log("tempPath:" + tmpPath + ",idx:" + idx + ",this.addGoodForm.pics.length:" + this.addGoodForm.pics.length);
            // 3)根据索引值从form#pics中移除
            this.addGoodForm.pics.splice(idx, 1);
        },
        // 上传图片成功
        handleUploadSuccess(response, file, fileList) {
            console.log("response");
            console.log(response);
            console.log("file");
            console.log(file);
            // 1)拼接得到一个图片信息对象
            const picObj = { pic: response.data.tmp_path };
            // 2)将上传图片成功的temp_path封装存储到form的pics中。
            this.addGoodForm.pics.push(picObj);
        },
        // 目前是mock阶段为了能通过上传，就要改写上传失败事件
        handleUploadError(err, file, fileList) {
            console.log(file);

            // TODO 临时代码
            // 1)拼接得到一个图片信息对象
            const time = new Date();
            const fileInfo = { name: "pic-" + time.getTime() + ".jpeg", url: file.url };
            // 2)将上传图片成功的temp_path封装存储到form的pics中。
            this.uploadFileList.push(fileInfo);
        },
        // 添加商品
        addGood() {
            this.$refs.addGoodFormRef.validate(async (valid) => {
                if (!valid) {
                    return this.$message.error("请填写必要的表单项！");
                }
                // 验证通过，执行添加
                // 如果是直接执行 this.addGoodForm.catId=this.addGoodForm.catId.join(",");会抛出异常
                // 此时解决方案是使用 lodash 进行 cloneDeep()
                const goodForm = _.cloneDeep(this.addGoodForm);
                goodForm.catId = goodForm.catId.join(",");

                // 动态参数
                const attrs = [];
                this.tabManyData.forEach((item) => {
                    const attrInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(" ") };
                    attrs.push(attrInfo);
                });

                // 静态属性
                this.tabOnlyData.forEach((item) => {
                    const attrInfo = { attr_id: item.attr_id, attr_value: item.attr_vals };
                    attrs.push(attrInfo);
                });

                goodForm.attrs = attrs;

                console.log(goodForm);

                // const { data: res } = await this.$http.post("/goods", goodForm);
                // if (res.meta.status !== 200) {
                //     return this.$message.error("添加商品失败！");
                // }

                this.$message.success("添加商品成功！");
                this.$router.push("/goods/list")
            });
        }
    },
    computed: {
        // 下拉复选框选中项
        selectCatId() {
            if (this.addGoodForm.catId.length === 3) {
                return this.addGoodForm.catId[3];
            }
            return null;
        }
    }
};
</script>
<style lang="less" scoped>
.el-checkbox {
    margin: 0 5px 0 0 !important;
}
.el-image {
    width: 100%;
}
.addGoodBtn {
    margin-top: 15px;
}
</style>
