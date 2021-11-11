<template>
    <div id="users">
        <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 用户列表卡片区 -->
        <el-card class="box-card">
            <!--表单进行查询操作-->
            <el-form :inline="true" ref="form" :model="userVO" label-width="70px">
                <el-form-item label="用户名">
                    <el-input
                            clearable
                            v-model="userVO.username"
                            placeholder="请输入用户名查询"
                    ></el-input>
                </el-form-item>

                <el-form-item label="邮箱">
                    <el-input
                            clearable
                            v-model="userVO.email"
                            placeholder="请输入邮箱查询"
                    ></el-input>
                </el-form-item>

                <el-form-item label="性别">
                    <el-radio v-model="userVO.sex" label="1">男</el-radio>
                    <el-radio v-model="userVO.sex" label="0">女</el-radio>
                    <el-radio v-model="userVO.sex" label>全部</el-radio>
                </el-form-item>

                <el-form-item label="昵称">
                    <el-input clearable v-model="userVO.nickname" placeholder="请输入昵称查询"></el-input>
                </el-form-item>
                <el-form-item style="margin-left:50px;">
                    <el-button  @click="" icon="el-icon-refresh">重置</el-button>
                    <el-button type="primary" @click="getUserList" icon="el-icon-search">查询</el-button>
                    <el-button
                            type="success"
                            icon="el-icon-plus"
                            @click=""
                    >添加</el-button>
                    <el-button @click="" icon="el-icon-download">导出</el-button>
                </el-form-item>
            </el-form>
            <!--表格内容显示区域-->
            <el-table
                    v-loading="loading"
                    :data="userList"
                    border
                    :cell-style="{padding: '2px 0'}"
                    style="width: 100%;">
                <el-table-column
                        label="序号"
                        width="50">
                 <template slot-scope="scope">
                  {{scope.$index+1}}
                 </template>
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="用户名"
                        width="110">
                </el-table-column>
                <el-table-column
                        prop="nickname"
                        label="昵称"
                        width="110">
                </el-table-column>
                <el-table-column
                        prop="avatar"
                        label="头像"
                        width="110">
                    <template slot-scope="scope">
                        <el-popover
                                placement="right"
                                title="用户头像"
                                trigger="hover">
                            <img :src="scope.row.avatar"/>
                            <img slot="reference" :src="scope.row.avatar"  style="max-height: 50px;max-width: 150px">
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="sex"
                        label="性别"
                        width="60">
                    <template slot-scope="scope">
                        <span class="el-tag el-tag--success el-tag--mini el-tag--light">{{scope.row.sex===1?'帅哥':(scope.row.sex===0?'美女':'保密')}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        sortable
                        prop="birth"
                        label="生日"
                        width="100">
                    <template slot-scope="scope">
                        {{scope.row.birth}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="phoneNumber"
                        label="电话"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="是否禁用"
                        width="100">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.status===1"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
                        <!--分配角色-->
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
    </div>
</template>

<script>
    import {getUserList,assignRoles,doAssignRoles} from "@/api/user";

    export default {
        name: "Users",
        data(){
            return {
                //当前页
                current: 1,
                size: 6,
                total:100,
                loading: true,
                userVO:{
                    username: '',
                    email: '',
                    sex: '',
                    nickname: ''
                },
                userList: [],
                //角色对话框的可见性
                dialogVisible: false,
                //角色
                roles: [],
                //用户拥有的角色
                hasRoleIds: [],
                //保存当前授权的用户ID
                uid: '',
            }
        },
        created() {
            this.getUserList(1,this.size);
            setTimeout(() => {
                this.loading = false;
            }, 500);
        },
        methods:{
            handleSizeChange(val) {
                this.size = val;
                this.getUserList(1,this.size)
            },
            handleCurrentChange(current) {
                this.getUserList(current, this.size)
            },
            //获取用户列表
            async getUserList(current, size){
                const res = await getUserList(this.userVO, current, size);
                if (res.code !== 200) {
                    return this.$message.error("获取用户列表失败:"+res.message);
                }
                this.userList = res.data.pageInfo.records;
                this.total = res.data.pageInfo.total;
            },
            //关闭角色对话框
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            //分配角色(这里只是实现分配角色时弹框查询里面的数据)
            async assignRoles(id){
                const loading = this.$loading({
                    lock: true,
                    text: "Loading",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)"
                });
                //弹出分配角色的显示框
                this.dialogVisible = true;
                const res = await assignRoles(id);
                if (res.code === 200) {
                    this.roles = res.data.roles;
                    this.hasRoleIds = res.data.hasRoleIds;
                    this.uid = id;
                    setTimeout(() => {
                        loading.close();
                        this.dialogVisible = true;
                    }, 400);
                }
            },
            //完成真正的分配角色操作
            doAssignRoles(){
                this.dialogVisible = true;

            }
        }
    }
</script>

<style scoped>

</style>
