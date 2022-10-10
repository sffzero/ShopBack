<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="!isShowTable"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column
            prop="prop"
            label="序号"
            width="80"
            type="index"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0px 20px"
                >{{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              >
              </el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性名称">
            <template slot-scope="{ row, $index }">
              <el-input
                placeholder="请输入属性值名称"
                v-model="row.valueName"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="row.flag = false"
                :ref="$index"
              ></el-input>
              <span v-else @click="toEdit(row, $index)">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm
                :title="`确定删除${row.valueName}吗`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //接收平台属性的字段
      attrList: [],
      //控制table表格的显示与隐藏
      isShowTable: true,
      //收集新增属性|修改属性使用
      attrInfo: {
        //属性名
        attrName: "",
        //属性值，属性值有多个所以用数组，每一个属性值都是一个对象
        attrValueList: [],
        categoryId: 0, //三级分类id
        categoryLevel: 0, //区分几级id
      },
    };
  },
  methods: {
    //自定义事件回调
    getCategoryId(categoryId) {
      //区分三级分类相应的id，以及父组件进行存储
      if (categoryId.level == 1) {
        this.category1Id = categoryId.categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (categoryId.level == 2) {
        this.category2Id = categoryId.categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId.categoryId;
        //发请求获取平台属性
        this.getAttrList();
      }
    },
    //获取平台属性的数据
    //当用户确定了三级分类数据时，可以向服务器发请求获取平台属性进行展示
    async getAttrList() {
      //获取分类的ID
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //添加属性值的回调
    addAttrValue() {
      //向属性值的数组里添加元素
      //attrId相应属性id;valuename属性值名称
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        //给每一个属性添加一个flag标记，切换查看编辑模式
        flag: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //添加属性按钮的回调【重新进入时清空数据】
    addAttr() {
      //切换table的显示与隐藏
      this.isShowTable = false;
      //清除数据
      this.attrInfo = {
        //属性名
        attrName: "",
        //属性值，属性值有多个所以用数组，每一个属性值都是一个对象
        attrValueList: [],
        categoryId: this.category3Id, //三级分类id
        categoryLevel: 3, //区分几级id
      };
    },
    //修改某一个属性
    updateAttr(row) {
      //isShowTable变为false
      this.isShowTable = false;
      //将选中的属性赋值给attrInfo
      this.attrInfo = cloneDeep(row);
      //在修改某一个属性时，将相应的属性值元素添加flag标记
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    //失去焦点的事件---切换为查看模式，显示span
    toLook(row) {
      //判断用户输入的属性值不能是空字符串
      if (row.valueName.trim() == "") {
        this.$message("请输入一个正确的属性值");
        return;
      }
      //新增的属性值不能与已有的属性值重复
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        //需要将row从数组内去除
        //row最新新增的属性值【数组的最后一项元素】
        //判断的时候需要把已有的数组当中新增的这个属性值去除
        if (row != item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepat) {
        this.$message("无法输入相同的属性值");
        return;
      }
      row.flag = false;
    },
    //点击span变为编辑模式
    toEdit(row, index) {
      row.flag = true;
      //获取input节点
      //注意点击span时切换为input，对于浏览器而言页面重绘需要事件
      //$nextTick当节点渲染完毕时执行，保证input已经存在
      this.$nextTick(() => {
        console.log(index);
        //获取相应input表单元素聚焦
        this.$refs[index].focus();
      });
    },
    //气泡确认框确定按钮的回调
    deleteAttrValue(index) {
      //当前删除属性值的操作不需要发送请求
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //保存按钮，进行添加属性或者修改属性操作
    async addOrUpdateAttr() {
      //整理参数：1.如果用户添加了许多属性值，且属性值为空的不应该提交给服务器
      //2.提交给服务器的数据当中不应该出现flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          //过滤掉属性值不为空的
          if (item.valueName != "") {
            //删除flag属性
            delete item.flag;
            return true;
          }
        }
      );
      try {
        //发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        //展示平台属性
        this.isShowTable = true;
        this.$message({ type: "success", message: "保存成功" });
        //保存成功后再次获取平台属性展示
        this.getAttrList();
      } catch (error) {
        this.$message("保存失败");
      }
    },
  },
};
</script>

<style>
</style>
