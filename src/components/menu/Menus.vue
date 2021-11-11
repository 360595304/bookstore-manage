<template>
    <div id="roles" v-loading="loading">
        <!-- 面包导航 -->
        <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片主体 -->
        <el-card class="box-card">
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Menus",
        data(){
            return {
                loading: true,
            }
        },
        created() {
            setTimeout(() => {
                this.loading = false;
            }, 500);
        }
    }
</script>

<style scoped>

</style>