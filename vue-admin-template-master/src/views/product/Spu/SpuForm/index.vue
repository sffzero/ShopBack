<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片：action图片上传的地址 list-type:文件列表的类型 on-preview:图片预览模式 on-remove:删除图片时触发 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlerSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}未选择`"
          v-model="attrIdAndAttrName"
        >
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="unselect in unSelectSaleAttr"
            :key="unselect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <!-- 展示的是当前SPU属于自己的销售属性 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <!-- el-tag用于已展示的属性值列表0 -->
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >+ 添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      value: "",
      dialogImageUrl: "",
      dialogVisible: false,
      //存储spu信息属性
      spu: {
        //三级分类id
        category3Id: 0,
        //spu描述
        description: "",
        //spu名称
        spuName: "",
        //品牌id
        tmId: "",
        //收集SPU图片信息
        spuImageList: [
          /* {
            id: 0,
            imgName: "",
            imgUrl: "",
            spuId: 0,
          }, */
        ],
        //平台属性与属性值的收集
        spuSaleAttrList: [
          /*  {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: "",
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: "",
                saleAttrName: "",
                saleAttrValueName: "",
                spuId: 0,
              },
            ],
          }, */
        ],
      },
      //存储品牌信息
      tradeMarkList: [],
      //存储spu图片信息
      spuImageList: [],
      //销售属性数据
      saleAttrList: [],
      //收集未选择的销售属性Id
      attrId: "",
      attrIdAndAttrName: "",
    };
  },
  methods: {
    //照片墙的预览和删除功能
    handleRemove(file, fileList) {
      //file代表删除的图片
      //fileList代表照片墙删除后的照片组
      // console.log(file, fileList);
      //收集照片墙图片的数据【照片墙显示需要name，url字段】，服务器不需要这个数据
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      //对话框显示
      this.dialogVisible = true;
    },
    //照片墙图片上传成功的回调
    handlerSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },
    //初始化SpuForm数据
    async initSpuDate(spu) {
      //获取Spu信息数据
      let result = await this.$API.spu.reqSpu(spu.id);
      if (result.code == 200) {
        //在修改spu时需要向服务器发送请求,把服务器返回的数据赋值给spu属性
        this.spu = result.data;
      }
      //获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取spu图片数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        //由于照片墙显示图片的数据需要数组，数组内元素需要 name,url
        listArr.forEach((item) => {
          (item.name = item.imgName), (item.url = item.imgUrl);
        });
        //把整理好的数据赋值
        this.spuImageList = listArr;
      }
      //获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    //添加新的销售属性
    addSaleAttr() {
      //已经收集到需要添加的销售属性的信息
      //把收集到的销售属性进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      //向spu对象的spuSaleAttrList添加新属性
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      //清空数据
      this.attrIdAndAttrName = "";
    },
    //添加按钮的回调
    addSaleAttrValue(row) {
      //点击添加按钮时，button变为input，由inputVisible控制
      this.$set(row, "inputVisible", true);
      //通过响应式数据inputValue字段收集新增的销售属性值
      this.$set(row, "inputValue", "");
    },
    //el-input失去焦点事件
    handleInputConfirm(row) {
      //解构出销售属性中收集数据
      const { baseSaleAttrId, inputValue } = row;
      //新增的销售属性值不能为空
      if (inputValue.trim() == "") {
        this.$message("属性值不能为空");
        return;
      }
      //属性值不能重复
      let result = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName != inputValue
      );
      if (!result) return;
      //新增的销售属性值
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      //新增
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      //修改inputVisible为false，显示button
      row.inputVisible = false;
    },
    //保存按钮的回调
    async addOrUpdateSpu() {
      //整理参数，需要整理照片墙数据
      //携带参数：图片：imageName与imageUrl
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
      //发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        this.$message({ type: "success", message: "保存成功" });
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spu.id ? "修改" : "添加",
        });
        //清空数据
        Object.assign(this._data, this.$options.data());
      }
    },
    //点击添加spu按钮时，发请求的函数
    async addSpuData(category3Id) {
      //添加spu的时候收集三级分类id
      this.spu.category3Id = category3Id;
      //获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //取消按钮
    cancel() {
      //通知父亲切换场景为0
      this.$emit("changeScene", { scene: 0, flag: "修改" });
      //Object.assign合并对象
      //组件实例this._data
      //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空
      Object.assign(this._data, this.$options.data());
    },
  },
  computed: {
    //还未选择的销售属性
    unSelectSaleAttr() {
      //整个平台的销售属性：颜色，尺寸，版本 ---saleAttrList
      //当前spu属于自己的销售属性
      //filter从已有的数组中过滤出用户需要的元素，返回一个新数组
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
  },
};
</script>

<style scoped>
textarea {
  resize: none;
}
.el-tag + .el-tag {
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