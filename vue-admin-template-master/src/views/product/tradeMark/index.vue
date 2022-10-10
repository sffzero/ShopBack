<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="showDialog"
      >添加</el-button
    >
    <!-- 
      表格组件 
      data:表格组件将要展示的数据---数组类型
      border:添加边框属性
      column属性
      label:显示标题
      width:对应列的宽度
      align:标题的对齐方式
      prop:展示数组中的属性
      注意1：elementUi当中的table组件，展示的数据是以一列一列进行展示数据

      -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="品牌logo" width="width">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--
       分页器
       当前第几页 current-page，数据总条数 total、一页内展示多少数据 page-size 、连续页码数
       layout:实现分页器布局
       pager-count:页码按钮数量
     -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      layout="prev, pager, next,jumper,->,sizes,total"
      :total="total"
      :current-page="page"
      :pager-count="5"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 
      对话框 
      :visible.sync:控制对话框显示与隐藏
      :label-width:标题宽度
      -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- 
        form表单 
        model属性：收集表单数据到指定对象身上,将来表单验证也需要这个属性
      Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。
      -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
          <!-- 添加图片框
            action:设置图片上传地址
            :on-success:可以检测到图片上传成功，会执行一次
            :before-upload:在图片上传前执行一次 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    //自定义校验规则
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称2-10位"));
      } else {
        callback();
      }
    };
    return {
      //分页器第几页
      page: 1,
      //当前页数展示数据条数
      limit: 3,
      //总共数据条数
      total: 0,
      //列表展示数据
      list: [],
      //对话框显示与隐藏
      dialogFormVisible: false,
      //上传图片使用的属性
      imageUrl: "",
      //收集品牌信息
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      //表单验证规则
      rules: {
        //品牌名称验证规则
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            validator: validateTmName,
            trigger: "change",
          },
        ],
        //品牌logo验证规则
        logoUrl: [{ required: true, message: "请选择品牌图片" }],
      },
    };
  },
  //组件挂载完毕发请求
  mounted() {
    this.getPageList();
  },
  methods: {
    //获取列表数据方法
    async getPageList() {
      //结构参数
      const page = this.page;
      const limit = this.limit;
      //获取品牌列表接口
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    //点击页码按钮挑战页数
    handleCurrentChange(pager) {
      this.page = pager;
      this.getPageList();
    },
    //当分页器某一页需要展示数据条数发生变化的时候会出发
    handleSizeChange(limit) {
      //整理参数
      this.limit = limit;
      this.getPageList();
    },
    //显示添加品牌对话框
    showDialog() {
      this.dialogFormVisible = true;
      //清除数据
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
    },
    //修改某一个品牌
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      //row:当前用户选中的品牌信息
      //将已有的品牌信息赋值给tmForm
      //tmForm存储即为服务器返回的品牌信息4
      this.tmForm = { ...row };
    },
    //上传图片相关回调
    //图片上传成功的回调
    handleAvatarSuccess(res, file) {
      //res:上传成功后返回给前端的数据
      //file:上传成功之后服务器返回给前端的数据
      this.tmForm.logoUrl = res.data;
    },
    //图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //添加品牌确定按钮
    addOrUpdateTradeMark() {
      //当全部验证的字段通过再去书写业务逻辑
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          //发请求（添加品牌|修改品牌）
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            this.dialogFormVisible = false;
            //弹出一个信息
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            //添加或者修改品牌成功后，需要再次获取品牌列表展示
            //如果添加品牌停留在第一页，如果修改品牌应该留在当前页
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          return false;
        }
      });
    },
    //删除品牌操作
    deleteTradeMark(row) {
      //弹框
      this.$confirm(`你确定删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //当用户点击确定按钮时触发
          //向服务器发出请求
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            //再次获取品牌列表数据
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1);
          }
        })
        .catch(() => {
          //当用户点击取消按钮时触发
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style >
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>