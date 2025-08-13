<template>
    <div class="header">
        <div class="l-content">
            <el-button size="small" @click="handleCollapse">
                <component class="icons" is="Menu"></component>
            </el-button>
            <el-breadcrumb :separator-icon="ArrowRight" class='bread'>
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-if="current" :to="current.path">{{ current.label }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="r-content">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <img :src="getImageUrl('head')" class="user">
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>个人中心</el-dropdown-item>
                        <el-dropdown-item @click="hadnleLoginOut">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAllDataStore } from '../stores';
import { computed } from 'vue';
const router = useRouter();

// import.meta.url表示当前模块的URL的绝对路径
const getImageUrl = (user) => { return new URL(`../assets/image/${user}.png`,import.meta.url).href; }
const store = useAllDataStore();
const handleCollapse = ()=>{
    store.state.isCollapse = !store.state.isCollapse;
}
const hadnleLoginOut = () =>{
    store.clean()
    router.push('/login')
}
const current = computed(()=>store.state.currentMenu)

</script>

<style lang="less" scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 60px;
    padding: 0 20px;
    background-color: #333;
    color: #fff;
}

.icons {
    width: 20px;
    height: 20px;
    margin-right: 10px;
}

.l-content {
    display: flex;
    align-items: center;
    .el-button {
        margin-right: 20px;

    }
}

.r-content{
    .user {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
}

:deep(.bread span){
    color: #fff !important;
    cursor: pointer !important;
}

</style>
