<template>
    <div>
        <div v-for="(item, index) in menuData" :key="index">
            <!--&lt;!&ndash; 思路: 有子元素使用el-submenu 没有子元素使用el-menu-item &ndash;&gt;
            <el-submenu :index="item.id+''" v-if="item.childMenus && item.childMenus.length > 0">
                <template slot="title" style="padding-left:30px">
                    <i :class="item.icon"></i>
                    <span>{{item.menuName}}</span>
                </template>
                &lt;!&ndash;递归调用&ndash;&gt;
                <Menu :menuData="item.childMenus"></Menu>
            </el-submenu>
            <el-menu-item :index="item.id+''" v-else style="padding-left: 50px;">
                <i :class="item.icon"></i>
                <span>{{item.menuName}}</span>
            </el-menu-item>-->
            <el-submenu  :index="item.id+''" v-if="item.childMenus && item.childMenus.length > 0" :key="item.id+''">
                <template slot="title">
                    <i :class="item.icon"></i>
                    <span slot="title">{{ item.menuName}}</span>
                </template>
                <Menu :menuData="item.childMenus"></Menu>
            </el-submenu>
            <el-menu-item
                    v-else
                    :index="item.routerUrl+''"
                    :route="item.routerUrl"
                    :key="item.id+''"
            >
                <i :class="item.icon"></i>
                <span>{{item.menuName}}</span>
            </el-menu-item>
        </div>
    </div>
</template>

<script>
    export default {
        //递归 这个名称要保持驼峰转短横线链接规则
        name: "Menu",
        props: {
            menuData: {
                type: Array,
                default: () => {
                    return [];
                }
            }
        },
        components: {},
        data() {
            return {};
        },
        created() {
        },
        mounted() {},
        methods: {}
    };
</script>
<style lang='less' scoped>
    .el-menu--collapse span,
    .el-menu--collapse i.el-submenu__icon-arrow {
        height: 0;
        width: 0;
        overflow: hidden;
        visibility: hidden;
        display: inline-block;
    }
</style>

