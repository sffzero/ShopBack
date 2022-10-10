<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="scene == 0">
        <!-- 展示spu列表结构 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column align="center" label="序号" type="index" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></HintButton>
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></HintButton>
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="handler(row)"
              ></HintButton>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  >删除
                </HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          v-show="records.length != 0"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next,jumper,->,sizes,total"
          :total="total"
          style="text-align: center"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuForm>
      <SkuForm
        v-show="scene == 2"
        ref="sku"
        @changeScenes="changeScenes"
      ></SkuForm>
    </el-card>
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="close"
    >
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{ row, $index }">
            <img
              :src="row.skuDefaultImage"
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
//引入子组件
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  data() {
    return {
      //分类id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //分页器当前第几页
      page: 1,
      //每一页展示多少数据
      limit: 3,
      total: 0,
      records: [], //spu列表数据
      //0代表展示SPU列表数据  1代表添加|修改SPU  2代表添加SKU
      scene: 0,
      //控制对话框显示与隐藏
      dialogVisible: false,
      spu: {},
      //存储sku列表数据
      skuList: [],
      loading: true,
    };
  },
  components: {
    SpuForm,
    SkuForm,
  },
  methods: {
    //三级联动的自定义事件，可以把子组件的相应id传递给父组件
    getCategoryId(data) {
      //categoryId:获取1，2，3三级分类id；level区分几级id
      if (data.level == 1) {
        this.category1Id = data.categoryId;
        //清除2，3级分类id
        (this.category2Id = ""), (this.category3Id = "");
      } else if (data.level == 2) {
        this.category2Id = data.categoryId;
        this.category3Id = "";
      } else if (data.level == 3) {
        this.category3Id = data.categoryId;
        //获取spu类列表展示
        this.getSpuList();
      }
    },
    //获取spu列表数据方法
    async getSpuList() {
      const { page, limit, category3Id } = this;
      //携带参数：page，limit，三级分类id
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    //点击分页器按钮的回调
    handleCurrentChange(page) {
      this.page = page;
      this.getSpuList();
    },
    //分页器的展示数据条数发生变化
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    //点击添加Spu的回调
    addSpu() {
      this.scene = 1;
      this.$refs.spu.addSpuData(this.category3Id);
    },
    //修改Spu的回调
    updateSpu(row) {
      this.scene = 1;
      //获取子组件SpuForm
      this.$refs.spu.initSpuDate(row);
    },
    //spuform自定义事件回调
    changeScene({ scene, flag }) {
      //flag为了区分保存数据还是添加数据
      if (flag == "修改") {
        console.log(1);
        this.getSpuList(this.page);
      } else {
        this.getSpuList((this.page = 1));
      }
      this.scene = scene;
      //子组件通知父组件切换场景，需要再次获取SPU列表
    },
    //删除Spu按钮回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        if (this.records.length > 1) {
          this.getSpuList(this.page);
        } else {
          this.getSpuList((this.page = this.page - 1));
        }
      }
    },
    //添加sku按钮的回调
    addSku(row) {
      //切换场景为2
      this.scene = 2;
      //父组件调用子组件方法，让子组件发请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    //添加SKU的取消按钮
    changeScenes(scene) {
      this.scene = scene;
    },
    //查看sku按钮的回调
    async handler(spu) {
      //点击按钮对话框可见
      this.dialogVisible = true;
      //保存spu信息
      this.spu = spu;
      //获取sku列表数据进行展示
      let result = await this.$API.sku.reqSkuList(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        //loading隐藏
        this.loading = false;
      }
    },
    //关闭对话框的回调
    close(done) {
      //loading属性再次变为真
      this.loading = true;
      //关闭对话框
      done();
      //清除sku列表的数据
      this.skuList = [];
    },
  },
};
</script>

<style>
</style>