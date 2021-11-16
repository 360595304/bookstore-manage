<template>
  <div id="books">
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 用户列表卡片区 -->
    <el-card class="box-card">
      <!--表单进行查询操作-->
      <el-form :inline="true" ref="form" label-width="70px">
        <el-form-item label="关键字">
          <el-input
              v-model="key"
              clearable
              placeholder="请输入关键字查询"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="reset" icon="el-icon-refresh">重置</el-button>
          <el-button type="primary" @click="getOrderList(1,size,key)" icon="el-icon-search">查询</el-button>
          <!--          <el-button-->
          <!--              type="success"-->
          <!--              icon="el-icon-plus"-->
          <!--              @click="showAdd"-->
          <!--          >添加-->
          <!--          </el-button>-->
        </el-form-item>
      </el-form>
      <!--表格内容显示区域-->
      <el-table
          v-loading="loading"
          :data="orderList"
          border
          :cell-style="{padding: '2px 0'}"
          style="width: 100%;"
      >


        <el-table-column
            label="序号"
            width="50">
          <template slot-scope="scope">
            {{ (current - 1) * size + scope.$index + 1 }}
          </template>
        </el-table-column>
        <!--        <el-table-column-->
        <!--            prop="id"-->
        <!--            label="书籍ID"-->
        <!--            width="110">-->
        <!--        </el-table-column>-->
        <el-table-column
            prop="id"
            label="订单号"
            :show-overflow-tooltip="true"
            width="270">
          <!--            <template slot-scope="scope">-->
<!--                        <div v-show="!isEditing[scope.$index]">-->
<!--                          {{ scope.row.id }}-->
<!--                        </div>-->
          <!--              -->
<!--                        <div v-show="isEditing[scope.$index]">-->
<!--                          <input style="padding: 0;font-size: 14px" v-model="scope.row.id"></input>-->
<!--                        </div>-->
          <!--            </template>-->

          <template slot-scope="scope">
            <el-popover placement="right" :width="1000" trigger="click">
              <template #reference>
                <div >
                  {{ scope.row.id }}
                </div>
              </template>
              <el-table :data="scope.row.goodsList">
                <el-table-column
                    width="150"
                    property="bookId"
                    label="书ID"
                ></el-table-column>
                <el-table-column
                    width="400"
                    property="bookName"
                    label="书名"
                ></el-table-column>
                <el-table-column
                    width="100"
                    property="author"
                    label="作者"
                ></el-table-column>
                <el-table-column
                    width="150"
                    property="press"
                    label="出版社"
                ></el-table-column>
                <el-table-column
                    width="150"
                    property="price"
                    label="单价"
                ></el-table-column>
                <el-table-column
                    width="50"
                    property="count"
                    label="数量"
                ></el-table-column>
              </el-table>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column
            prop="nickname"
            label="用户昵称"
            :show-overflow-tooltip="true"
            width="110">
          <template slot-scope="scope">
              {{ scope.row.nickname }}
          </template>
        </el-table-column>
        <el-table-column
            prop="recName"
            label="收货人"
            width="75">
          <template slot-scope="scope">
            <div v-show="!isEditing[scope.$index]">
              {{ scope.row.recName }}
            </div>
            <div v-show="isEditing[scope.$index]">
              <input style="padding: 0;font-size: 14px" v-model="scope.row.recName"></input>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            prop="recPhone"
            label="电话"
            :show-overflow-tooltip="true"
            width="120">
          <template slot-scope="scope">
            <div v-show="!isEditing[scope.$index]">
              {{ scope.row.recPhone }}
            </div>
            <div v-show="isEditing[scope.$index]">
              <input style="padding: 0;font-size: 14px" v-model="scope.row.recPhone"></input>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            prop="recAddress"
            label="地址"
            width="230">
          <template slot-scope="scope">
            <div v-show="!isEditing[scope.$index]">
              {{ scope.row.recAddress }}
            </div>
            <div v-show="isEditing[scope.$index]">
              <input style="padding: 0;font-size: 14px" v-model="scope.row.recAddress"></input>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            sortable
            prop="createTime"
            label="创建时间"
            :show-overflow-tooltip="true"
            width="120">
          <template slot-scope="scope">
              {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column
            prop="state"
            label="状态"
            width="120">
          <template slot-scope="scope">
            <div v-show="!isEditing[scope.$index]" :class="state[scope.row.state].class">
              {{ state[scope.row.state].label }}
            </div>
            <div v-show="isEditing[scope.$index]">
              <el-select v-model="scope.row.state" placeholder="Select">
                <el-option
                    v-for="item in state"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>

        <el-table-column
            prop="notes"
            label="备注"
            width="80">
          <template slot-scope="scope">
            <div v-show="!isEditing[scope.$index]">
              {{ scope.row.notes }}
            </div>
            <div v-show="isEditing[scope.$index]">
              <input style="padding: 0;font-size: 14px" v-model="scope.row.notes"></input>
            </div>
          </template>
        </el-table-column>

        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button v-show="!isEditing[scope.$index]" type="primary" size="mini" icon="el-icon-edit"
                       @click="edit(scope.$index, scope.row.state)">编辑
            </el-button>
            <el-button v-show="!isEditing[scope.$index]" type="danger" size="mini" icon="el-icon-delete"
                       @click="showDelete(scope.row.id)">删除
            </el-button>
            <el-button v-show="isEditing[scope.$index]" type="success" size="mini" icon="el-icon-check"
                       @click="update(scope.$index, scope.row)">完成
            </el-button>
            <el-button v-show="isEditing[scope.$index]" type="default" size="mini" icon="el-icon-check"
                       @click="cancelEdit(scope.$index)">取消
            </el-button>
          </template>
        </el-table-column>


      </el-table>


      <!--分页控件的使用-->
      <el-pagination
          style="padding-top: 10px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="current"
          :page-sizes="[6, 8, 10, 12]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>

<!--      确认删除弹出框-->
        <el-dialog
            :visible="deleteDialogVisible"
            title="警告"
            width="30%"
        >
          <span>确定要删除吗？</span>
          <template #footer>
          <span class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="remove">确定</el-button>
          </span>
          </template>
        </el-dialog>

    <!--  添加书籍弹出框  -->
    <!--    <el-dialog-->
    <!--        :visible="addDialogVisible"-->
    <!--        title="添加书籍"-->
    <!--        width="50%"-->
    <!--    >-->
    <!--      <el-form style="display: flex;flex-wrap: wrap;justify-content: space-around">-->
    <!--        <el-form-item label="id" label-width="80px">-->
    <!--          <el-col :span="24">-->
    <!--            <el-input v-model="newBook.id" type="number"/>-->
    <!--          </el-col>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="书名" label-width="80px">-->
    <!--          <el-col :span="24">-->
    <!--            <el-input v-model="newBook.name" type="text"/>-->
    <!--          </el-col>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="作者" label-width="80px">-->
    <!--          <el-col :span="24">-->
    <!--            <el-input v-model="newBook.author" type="text"/>-->
    <!--          </el-col>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="类型" label-width="80px">-->
    <!--          <el-col :span="24">-->
    <!--            <el-input v-model="newBook.type" type="text"/>-->
    <!--          </el-col>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="出版时间" label-width="80px">-->
    <!--          <el-col :span="22">-->
    <!--            <el-date-picker-->
    <!--                v-model="newBook.pubDate"-->
    <!--                type="month"-->
    <!--                format="yyyy[年]MM[月]"-->
    <!--                placeholder="选择时间"-->
    <!--            />-->
    <!--          </el-col>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="出版社" label-width="80px">-->
    <!--          <el-col :span="24">-->
    <!--            <el-input v-model="newBook.press" type="text"/>-->
    <!--          </el-col>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="原价" label-width="80px">-->
    <!--          <el-col :span="24">-->
    <!--            <el-input v-model="newBook.originalPrice" type="number"/>-->
    <!--          </el-col>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="折扣价" label-width="80px">-->
    <!--          <el-col :span="24">-->
    <!--            <el-input v-model="newBook.discountPrice" type="number"/>-->
    <!--          </el-col>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="ISBN号" label-width="80px">-->
    <!--          <el-col :span="24">-->
    <!--            <el-input v-model="newBook.isbn" type="number"/>-->
    <!--          </el-col>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="库存" label-width="80px">-->
    <!--          <el-col :span="24">-->
    <!--            <el-input v-model="newBook.inventory" type="number"/>-->
    <!--          </el-col>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="图片链接" label-width="80px">-->
    <!--          <el-col :span="24">-->
    <!--            <el-input v-model="newBook.pictureUrl" type="text"/>-->
    <!--          </el-col>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="简介" label-width="80px">-->
    <!--          <el-col :span="24">-->
    <!--            <el-input v-model="newBook.intro" type="textarea"/>-->
    <!--          </el-col>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="推荐" label-width="80px">-->
    <!--          <el-col :span="24">-->
    <!--            <el-switch v-model="newBook.state" active-color="#13ce66" inactive-color="gray"/>-->
    <!--          </el-col>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="状态" label-width="80px">-->
    <!--          <el-col :span="24">-->
    <!--            <el-switch v-model="newBook.state" active-color="#13ce66" inactive-color="gray"/>-->
    <!--          </el-col>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->

    <!--      <template #footer>-->
    <!--      <span class="dialog-footer">-->
    <!--        <el-button @click="addDialogVisible = false">取消</el-button>-->
    <!--        <el-button type="primary" @click="add">确定</el-button>-->
    <!--      </span>-->
    <!--      </template>-->
    <!--    </el-dialog>-->

  </div>
</template>

<script>
import {getOrderList, updateOrder, deleteOrder} from "@/api/order";

export default {
  name: "Order",
  data() {
    return {
      //当前页
      current: 1,
      size: 8,
      total: 0,
      loading: true,
      orderList: [],
      delOrderId: '',
      isEditing: [],
      state: [
        {
          'label': '创建',
          'value': 1,
          'class': "new"
        },
        {
          'label': '已付款',
          'value': 2,
          'class': "pay"
        },
        {
          'label': '配送中',
          'value': 3,
          'class': "delivery"
        },
        {
          'label': '已收货',
          'value': 4,
          'class': "finish"
        },
        {
          'label': '异常',
          'value': 5,
          'class': "danger"
        }
      ],
      //角色对话框的可见性
      deleteDialogVisible: false,
      addDialogVisible: false,
      editOrder: {},
      key: ''
    }
  },
  created() {
    this.getOrderList(1, this.size, this.key);
    this.isEditing = new Array(this.size)
    for (let i = 0; i < this.size; i++) {
      this.isEditing[i] = false
    }
  },
  methods: {
    handleSizeChange(val) {
      this.size = val;
      this.getOrderList(1, this.size)
      this.isEditing = new Array(this.size)
      for (let i = 0; i < this.size; i++) {
        this.isEditing[i] = false
      }
    },
    handleCurrentChange(current) {
      this.current = current
      this.getBookList(current, this.size)
    },
    //获取用户列表
    async getOrderList(current, size) {
      if (this.editCheck()) {
        this.loading = true
        getOrderList(current, size, this.key).then(res => {
          if (res.code !== 200) {
            return this.$message.error("获取订单列表失败:" + res.message);
          }
          this.orderList = res.data.orderList;
          console.log(this.orderList)
          this.total = res.data.total
          console.log(this.total)
        });
        this.loading = false
      }
    },
    //关闭角色对话框
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
    },
    reset() {
      if (this.editCheck()) {
        this.key = ''
        this.getOrderList(1, this.size, this.key)
      }
    },
    remove() {
      deleteOrder(this.delOrderId).then(res => {
        if (res.code !== 200) {
          return this.$message.error("删除书籍失败:" + res.message);
        }
        setTimeout(() => {
          this.getBookList(this.current, this.size)
        }, 500)
        return this.$message.success("成功删除书籍！");
      })
      this.deleteDialogVisible = false
    },
    update(index, row) {
      this.editOrder = JSON.parse(JSON.stringify(row))
      console.log(this.editOrder)
      updateOrder(this.editOrder).then(res => {
        if (res.code !== 200) {
          return this.$message.error("修改订单失败：" + res.message)
        }
        setTimeout(() => {
          this.getOrderList(this.current, this.size, this.key)
        }, 500)
        return this.$message.success("成功修改订单！");
      })
      this.$set(this.isEditing, index, false)
    },
    edit(index, state) {
      if (state === 4) {
        this.$message.warning("已完成的订单无法修改")
        return
      }
      if (this.editCheck()) {
        this.$set(this.isEditing, index, true)
      }
    },
    editCheck() {
      let n = 0;
      for (let i = 0; i < this.size; i++) {
        if (this.isEditing[i] === true) {
          n++
          if (n > 0) {
            this.$message.error("请先完成当前修改");
            return false
          }
        }
      }
      return true
    },
    showDelete(orderId) {
      if (this.editCheck()) {
        this.delOrderId = orderId
        this.deleteDialogVisible = true
      }
    },
    cancelEdit(index) {
      this.$set(this.isEditing, index, false)
    }
  },


}
</script>

<style scoped>
input {
  height: 50px;
  border: none;
  width: 100%;
  background-color: #d6e8f5;
}

.danger {
  color: red;
}

.new {
  color: orange;
}

.pay {
  color: skyblue;
}

.delivery {
  color: blue;
}

.finish {
  color: green;
}
</style>
