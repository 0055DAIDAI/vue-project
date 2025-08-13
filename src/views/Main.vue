<template>
    <div class="common-layout">
        <el-container class="lay-container"> 
            <!-- 自定义左侧组件 -->
             <common-aside />
             <el-container>
                <el-header class ='el-header'>
                    <common-header />
                </el-header>
                <CommonTag></CommonTag>
                <el-main class="right-main">
                    <router-view></router-view>
                </el-main>
             </el-container>
        </el-container>
    </div>
</template>

<script setup>
import  CommonAside  from '@/components/CommonAside.vue';
import  CommonHeader  from '@/components/CommonHeader.vue';
import  CommonTag  from '@/components/CommonTag.vue';


</script>

<style lang="less" scoped>
 .common-layout {
    height: 100%;
    
 }
 .lay-container {
    height: 100%;
    display: flex;
  
 }
 .el-header {
    background-color: #333;
 }

</style>