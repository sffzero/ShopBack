<template>
  <div>
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{ row, $index }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="重量" width="100"> </el-table-column>
      <el-table-column prop="prop" label="价格" width="100"> </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="success"
            icon="el-icon-sort-up"
            size="mini"
            v-if="row.isSale != 1"
            @click="skuOnSale(row)"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-sort-down"
            size="mini"
            v-else-if="(row.isSale = 1)"
            @click="skuCancelSale(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="showSkuDetail(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="text-align: center"
      layout="prev,pager,next,jumper,->,sizes,total"
      :current-page="1"
      :page-sizes="[3, 5, 10]"
      :page-size="10"
      :total="20"
      @current-change="getSkuList"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 商品详情展示抽屉 -->
    <el-drawer
      :visible.sync="drawer"
      :show-close="false"
      size="50%"
      :before-close="drawerClose"
    >
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16" style="margin-top: 5px">
          <el-tag
            type="success"
            v-for="skuSaleAttr in skuInfo.skuSaleAttrValueList"
            :key="skuSaleAttr.id"
            style="margin-right: 5px"
            >{{ skuSaleAttr.saleAttrName }}-{{
              skuSaleAttr.saleAttrValueName
            }}</el-tag
          ></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel indicator-position="outside">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img
                :src="item.imgUrl"
                alt=""
                style="width: 100%; height: 100%"
              />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 10,
      //存储sku列表数据
      records: [],
      //分页器一次展示数据
      total: 0,
      drawer: false,
      //存储sku信息
      skuInfo: {},
    };
  },
  //组件挂载完毕
  mounted() {
    //获取sku列表方法
    this.getSkuList();
  },
  methods: {
    //获取sku列表数据的方法
    async getSkuList(pages = 1) {
      this.page = pages;
      const { page, limit } = this;
      let result = await this.$API.sku.reqskuList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    //控制页面展示数据数量
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    //控制商品上架
    async skuOnSale(row) {
      let result = await this.$API.sku.reqonSale(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "上架成功" });
        this.getSkuList();
      } else {
        this.$message({ type: "danger", message: "上架失败" });
      }
    },
    //控制商品下架
    async skuCancelSale(row) {
      console.log(1);
      let result = await this.$API.sku.reqcancelSale(row.id);
      console.log(result);
      if (result.code == 200) {
        this.$message({ type: "success", message: "下架成功" });
        this.getSkuList();
      } else {
        this.$message({ type: "danger", message: "下架失败" });
      }
    },
    //编辑按钮
    edit() {
      this.$message("功能开发中");
    },
    //展示sku商品详细信息
    async showSkuDetail(row) {
      //展示抽屉
      this.drawer = true;
      //获取商品详细信息
      let result = await this.$API.sku.reqSkuDetail(row.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
    drawerClose(done) {
      done();
      this.skuInfo = {};
    },
  },
};
</script>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
  font-weight: 700;
}
.el-col {
  margin: 10px 10px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>