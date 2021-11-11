<template>
  <div id="books">
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>书籍管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 用户列表卡片区 -->
    <el-card class="box-card">
      <!--表单进行查询操作-->
      <el-form :inline="true" ref="form" label-width="70px">
        <el-form-item label="书名">
          <el-input
              clearable
              v-model="condition.name"
              placeholder="请输入书名查询"
          ></el-input>
        </el-form-item>

        <el-form-item label="作者">
          <el-input
              clearable
              v-model="condition.author"
              placeholder="请输入作者查询"
          ></el-input>
        </el-form-item>

        <el-form-item label="类型">
          <el-input
              clearable
              v-model="condition.type"
              placeholder="请输入书籍类型查询"
          ></el-input>
        </el-form-item>

        <el-form-item label="出版社">
          <el-input
              clearable
              v-model="condition.press"
              placeholder="请输入出版社查询"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-left:50px;">
          <el-button @click="reset" icon="el-icon-refresh">重置</el-button>
          <el-button type="primary" @click="getBookList(1,size)" icon="el-icon-search">查询</el-button>
          <el-button
              type="success"
              icon="el-icon-plus"
              @click="addDialogVisible = true"
          >添加
          </el-button>
        </el-form-item>
      </el-form>
      <!--表格内容显示区域-->
      <el-table
          v-loading="loading"
          :data="bookList"
          border
          :cell-style="{padding: '2px 0'}"
          style="width: 100%;">

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
            prop="name"
            label="书名"
            :show-overflow-tooltip="true"
            width="110">
          <template slot-scope="scope">
            <div v-show="!isEditing">
              {{scope.row.name}}
            </div>
            <div v-show="isEditing">
              <el-input v-model="scope.row.name"></el-input>
            </div>
          </template>
<!--          <template slot-scope="scope" v-show="isEditing">-->
<!--            <el-input v-bind="scope.row.name"></el-input>-->
<!--          </template>-->
        </el-table-column>

        <el-table-column
            prop="author"
            label="作者"
            :show-overflow-tooltip="true"
            width="110">
        </el-table-column>
        <el-table-column
            prop="pictureUrl"
            label="封面"
            width="75">
          <template slot-scope="scope">
            <el-popover
                placement="right"
                title="预览图"
                trigger="hover">
              <img :src="scope.row.pictureUrl" alt=""/>
              <img slot="reference" :src="scope.row.pictureUrl" style="max-height: 50px;max-width: 150px" alt="">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
            prop="type"
            label="类别"
            :show-overflow-tooltip="true"
            width="150">
        </el-table-column>
        <el-table-column
            sortable
            prop="pubDate"
            label="出版时间"
            width="120">
        </el-table-column>
        <el-table-column
            prop="press"
            label="出版社"
            :show-overflow-tooltip="true"
            width="120">
        </el-table-column>
        <el-table-column
            prop="originalPrice"
            label="原价"
            width="50">
        </el-table-column>
        <el-table-column
            prop="discount"
            label="折扣"
            width="50">
        </el-table-column>
        <el-table-column
            prop="discountPrice"
            label="折扣价"
            width="80">
        </el-table-column>
        <el-table-column
            prop="isbn"
            label="ISBN号"
            width="130">
        </el-table-column>
        <el-table-column
            prop="inventory"
            label="存货"
            width="50">
        </el-table-column>
        <el-table-column
            prop="state"
            label="状态"
            width="70">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.state" active-color="#13ce66" inactive-color="gray"/>
          </template>
        </el-table-column>
        <el-table-column
            prop="commend"
            label="推荐"
            width="80">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.commend" active-color="#13ce66" inactive-color="gray"/>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(scope.row)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="showDelete(scope.row.id)"></el-button>
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

    <!--  确认删除弹出框  -->
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
    <el-dialog
        :visible="addDialogVisible"
        title="添加书籍"
        width="50%"
    >
      <el-form style="display: flex;flex-wrap: wrap;justify-content: space-around">
        <el-form-item label="id" label-width="80px">
          <el-col :span="24">
            <el-input v-model="newBook.id" type="number"/>
          </el-col>
        </el-form-item>
        <el-form-item label="书名" label-width="80px">
          <el-col :span="24">
            <el-input v-model="newBook.name" type="text"/>
          </el-col>
        </el-form-item>
        <el-form-item label="作者" label-width="80px">
          <el-col :span="24">
            <el-input v-model="newBook.author" type="text"/>
          </el-col>
        </el-form-item>
        <el-form-item label="类型" label-width="80px">
          <el-col :span="24">
            <el-input v-model="newBook.type" type="text"/>
          </el-col>
        </el-form-item>
        <el-form-item label="出版时间" label-width="80px">
          <el-col :span="22">
            <el-date-picker
                v-model="newBook.pubDate"
                type="month"
                format="yyyy[年]MM[月]"
                placeholder="选择时间"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="出版社" label-width="80px">
          <el-col :span="24">
            <el-input v-model="newBook.press" type="text"/>
          </el-col>
        </el-form-item>
        <el-form-item label="原价" label-width="80px">
          <el-col :span="24">
            <el-input v-model="newBook.originalPrice" type="number"/>
          </el-col>
        </el-form-item>
        <el-form-item label="折扣价" label-width="80px">
          <el-col :span="24">
            <el-input v-model="newBook.discountPrice" type="number"/>
          </el-col>
        </el-form-item>
        <el-form-item label="ISBN号" label-width="80px">
          <el-col :span="24">
            <el-input v-model="newBook.isbn" type="number"/>
          </el-col>
        </el-form-item>
        <el-form-item label="库存" label-width="80px">
          <el-col :span="24">
            <el-input v-model="newBook.inventory" type="number"/>
          </el-col>
        </el-form-item>
        <el-form-item label="图片链接" label-width="80px">
          <el-col :span="24">
            <el-input v-model="newBook.pictureUrl" type="text"/>
          </el-col>
        </el-form-item>
        <el-form-item label="简介" label-width="80px">
          <el-col :span="24">
            <el-input v-model="newBook.intro" type="textarea"/>
          </el-col>
        </el-form-item>
        <el-form-item label="推荐" label-width="80px">
          <el-col :span="24">
            <el-switch v-model="newBook.state" active-color="#13ce66" inactive-color="gray"/>
          </el-col>
        </el-form-item>
        <el-form-item label="状态" label-width="80px">
          <el-col :span="24">
            <el-switch v-model="newBook.state" active-color="#13ce66" inactive-color="gray"/>
          </el-col>
        </el-form-item>
      </el-form>

      <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="add">确定</el-button>
      </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import {getBookList, addBook, updateBook, deleteBook} from "@/api/book";

export default {
  name: "Book",
  data() {
    return {
      //当前页
      current: 1,
      size: 8,
      total: 0,
      loading: true,
      bookList: [],
      delBookId: '',
      newBook: {
        id: '',
        name: '',
        author: '',
        type: '',
        pubDate: '',
        press: '',
        originalPrice: '',
        isbn: '',
        discountPrice: '',
        inventory: '',
        pictureUrl: '',
        intro: '',
        discount: 0,
        commend: false,
        state: true,
      },
      //角色对话框的可见性
      deleteDialogVisible: false,
      addDialogVisible: false,
      isEditing: false,
      editBook: {},
      condition: {
        name: '',
        author: '',
        type: '',
        press: ''
      }
    }
  },
  created() {
    this.getBookList(1, this.size);
  },
  methods: {
    handleSizeChange(val) {
      this.size = val;
      this.getBookList(1, this.size)
    },
    handleCurrentChange(current) {
      this.current = current
      this.getBookList(current, this.size)
    },
    //获取用户列表
    async getBookList(current, size) {
      this.loading = true
      getBookList(current, size, this.condition).then(res => {
        if (res.code !== 200) {
          return this.$message.error("获取用户列表失败:" + res.message);
        }
        this.bookList = res.data.bookArr;
        this.total = res.data.total
      });
      this.loading = false
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
      this.condition.name = ''
      this.condition.author = ''
      this.condition.press = ''
      this.condition.type = ''
      this.getBookList(1, this.size)
    },
    add() {
      this.newBook.discount = Math.floor(this.newBook.discountPrice / this.newBook.originalPrice * 100)
      addBook(this.newBook).then(res => {
        if (res.code !== 200) {
          return this.$message.error("添加书籍失败:" + res.message);
        }
        setTimeout(() => {
          this.getBookList(this.current, this.size)
        }, 500)
        return this.$message.success("成功添加书籍！");
      })
      this.addDialogVisible = false
    },
    remove() {
      deleteBook(this.delBookId).then(res => {
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
    edit(row) {
      this.isEditing = true
      this.editBook = JSON.parse(JSON.stringify(row))
      console.log(this.editBook)
    },
    showDelete(bookId) {
      this.delBookId = bookId
      this.deleteDialogVisible = true
    }
  }

}
</script>

<style scoped>

</style>
