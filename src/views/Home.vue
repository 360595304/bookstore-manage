<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <span style="margin-left:20px;">
                  <img
                          src="../assets/img/timg.gif"
                          width="60px;"
                          style="margin-left:-10px;"
                          height="100%;"
                          alt
                          srcset
                  />
                </span>
            </div>
            <div>
                <span style="color: #FFF; font-size: 22px">网上书店管理系统</span>
            </div>
            <el-dropdown>
                <div class="block">
                    <el-avatar :size="50" :src="userInfo.avatar"  style="cursor: pointer;"></el-avatar>
                </div>
                <el-dropdown-menu slot="dropdown" trigger="click">
                    <el-dropdown-item>
                        <span type="danger" @click=""><span class="el-icon-house"></span> &nbsp;系统首页</span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <span type="danger" @click=""><span class="el-icon-ship"></span> &nbsp;交流讨论</span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <span type="danger" @click="logout"><span class="el-icon-switch-button"></span> &nbsp;退出登入</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>
        <el-container>
            <el-aside :width="isOpen==true?'64px':'200px'">
                <div class="toggle-btn" @click="toggleMenu">|||</div>
                <el-menu
                        :collapse="isOpen"
                        :router="true"
                        :collapse-transition="false"
                        unique-opened
                        @open="handleOpen"
                        @close="handleClose"
                        background-color="#272c33"
                        text-color="#fff"
                        active-text-color="#ffd04b">
                    <Menu :menuData="menuData"></Menu>
                </el-menu>
            </el-aside>
            <!--右边主体-->
            <el-main v-loading="loading">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import Menu from '../components/Menu'
    import {getMenuTree} from '@/api/menu'
    import {getUserInfo,doLogout} from '@/api/login'
    import { mapMutations } from 'vuex'
    import { USERLOGOUT } from '@/store/types'

    export default {
        name: "Home",
        components: {Menu},
        data() {
            return {
                menuData: [],
                isOpen: false,
                userInfo: {},
                loading: true,
            };
        },
        methods: {
            ...mapMutations([USERLOGOUT]),
            toggleMenu() {
                this.isOpen = !this.isOpen;
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            async getTree() {
                console.log("加载菜单信息.........");
                const res = await getMenuTree()
                //获取菜单失败
                if (res.code !== 200) {
                    //展示权限不足的网页
                    this.$router.push("/3001");
                    return this.$message.error({
                        showClose: true,
                        message: res.message,
                        center: true,
                        duration: 1000
                    })
                }
                // 获取菜单成功
                /*this.$message.success({
                    showClose: true,
                    message: res.message,
                    center: true,
                    duration: 1000
                })*/
                this.menuData = res.data.menuTree;
            },
            async getUserInfo() {
                console.log("加载用户信息.........");
                const res = await getUserInfo();
                this.userInfo = res.data.userInfo;
            },
            /**
             *
             * 退出登入
             */
            async logout() {
                var res = await this.$confirm("此操作将退出系统, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消退出登入"
                    });
                });
                if (res === "confirm") {
                    const res = await doLogout();
                    console.log(res)
                    if (res.code === 200){
                        this[USERLOGOUT]()
                        await this.$router.push("/login");
                    }
                }
            }
        },
        mounted(){
            this.getUserInfo();
        },
        created() {
            this.getTree();
            setTimeout(() => {
                this.loading = false;
            }, 500);
        }
    }
</script>

<style scoped>
    .el-header {
        background-color: #272c33;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        font-size: 19px;
        padding-left: 0px;
    }

    .el-aside {
        background-color: #272c33
    }

    .el-main {
        background-color: #eaedf1;
    }

    .home-container {
        width: 100%;
        height: 100% !important;
    }

    .toggle-btn {
        background-color: #2d3a4b !important;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>
