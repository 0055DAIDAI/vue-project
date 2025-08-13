<template>
    <el-row class="home" :gutter="20">
        <el-col :span="8" style="margin-top: 20px">
            <el-card shadow="hover">
                <div class="user">
                    <img :src="getImagerUrl('catoon')" class="user">
                    <div class="user-info">
                        <p class="user-info-admin">Admin</p>
                        <p class="user-info-p">超级管理员</p>
                    </div>
                </div>
                <div class="login-info">
                    <p>上次登录时间:<span>2022-01-01 12:00:00</span></p>
                    <p>上次登录地点:<span>北京</span></p>
                </div>
            </el-card>
            <el-card class="user-table" shadow="hover">
                <el-table :data="tableData">
                    <el-table-column v-for="(value, key) in tableLabel" :key="key" :prop="key" :label="value">

                    </el-table-column>
                </el-table>
            </el-card>
        </el-col>
        <el-col :span="16" style="margin-top: 20px;">
            <div class="num">
                <el-card :body-style="{ display: 'flex', padding: '0' }" v-for="item in countData" :key="item.name">
                    <component :is="item.icon" class="icons" :style="{ background: item.color }"></component>
                    <div class="detail">
                        <p class="num"> ${{ item.value }}</p>
                        <p class="txt"> {{ item.name }}</p>
                    </div>
                </el-card>
            </div>
            <el-card class="top-echart">
                <div ref="echart" style="height:200px"></div>
            </el-card>
            <div class="graph">
                <el-card>
                    <div ref="userEchart" style="height:200px"></div>
                </el-card>
                <el-card>
                    <div ref="videoEchart" style="height:200px"></div>
                </el-card>
            </div>
        </el-col>
    </el-row>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, reactive } from 'vue';
import * as echarts from 'echarts';


//这个是折线图和柱状图两个图表共用的公共配置
// echarts官网
const xoptions = reactive({
    //图例文字颜色
    textstyle: {
        color: "#333",
    },
    legend: {},
    grid: {
        left: "20%",
    },
    //提示框
    tooltip: {
        trigger: "axis",
    },
    xAxis: {
        type: "category",//类目轴
        data: [],
        axisLine: {
            linestyle: {
                color: "#17b3a3",
            },
            axisLabel: {
                interval: 0,
                color: "#333",
            },
        },
    },
    yAxis: {
        type: "value",
        axisLine: {
            linestyle: {
                color: "#17b3a3",
            },
        },
    },
    color: ["#17b3a3", "#f5b041", "#e74c3c", "#8e44ad", "#3498db", "#2ecc71"],
    series: [],
});

const pieoptions = reactive({
    tooltip: {
        trigger: "item"
    },
    legend: {},
    color: [
        "#0f78f4",
        "#dd536b",
        "#9462e5",
        "#a6a6a6",
        "#elbb22",
        "#39c362",
        "#3ed1cf",
    ],
    series: []
})

const { proxy } = getCurrentInstance();

proxy.$api = proxy.$api || {};

const getImagerUrl = (user) => {
    return new URL(`../assets/image/${user}.png`, import.meta.url).href;
}

const tableData = ref([

])

const countData = ref([

])

const tableLabel = ref(
    {
        name: '课程',
        todayBuy: '今日购买',
        monthBuy: '本月购买',
        totalBuy: '总购买'
    }
)

const chartData = ref([

])

const observer = ref(null)

// axios({
//     url: '/api/home/getTableData',
//     method: 'get',
// }).then(res=>{
//     console.log(res.data);
//     // 制造假数据 把交互得请求流程 根据接口文档跑通
//     // 有一种工具 拦截住请求 把我们制造得数据 根据接口文档来 
//     if ( res.data.code ===200){
//         console.log(res.data.data.tableData);
//         tableData.value = res.data.data.tableData;
//     }
// })

const gerTableData = async () => {
    const data = await proxy.$api.getTableData()

    console.log(data);

    tableData.value = data.tableData;


}

const getCountData = async () => {
    const data = await proxy.$api.getCountData()

    console.log(data);

    countData.value = data;
}

const getChartData = async () => {
    const { orderData, userData, videoData } = await proxy.$api.getChartData()
    // 对第一个图表进行x轴和series 赋值
    xoptions.xAxis.data = orderData.date;
    xoptions.series = Object.keys(orderData.data[0]).map(val => {
        return {
            name: val,
            data: orderData.data.map(item => item[val]),
            type: 'line'
        }
    })


    const oneEchart = echarts.init(proxy.$refs['echart'])
    oneEchart.setOption(xoptions);


    // 对第二个图表进行x轴和series 赋值
    xoptions.xAxis.data = userData.map(item => item.date)
    xoptions.series = [
        {
            name: '新增用户',
            data: userData.map(item => item.new),
            type: 'bar'
        },
        {
            name: '活跃用户',
            data: userData.map(item => item.active),
            type: 'bar'
        }
    ]

    const twoChart = echarts.init(proxy.$refs['userEchart'])
    twoChart.setOption(xoptions);

    //  对饼状图进行渲染
    pieoptions.series = [
        {
            data: videoData,
            type: 'pie',
        }
    ]

    const threeChart = echarts.init(proxy.$refs['videoEchart'])
    threeChart.setOption(pieoptions);

    // 监听页面得变化
    // 如果监听的容器大小发生变化，改变后会执行回调函数
    observer.value = new ResizeObserver(() => {
        oneEchart.resize();
        twoChart.resize();
        threeChart.resize();
    })

    // 容器存在
    if(proxy.$refs['echart']){
        observer.value.observe(proxy.$refs['echart']);
        observer.value.observe(proxy.$refs['userEchart']);
        observer.value.observe(proxy.$refs['videoEchart']);
    }

    chartData.value = orderData;
}




onMounted(() => {
    gerTableData();
    getCountData();
    getChartData();
});


</script>

<style lang="less" scoped>
.home {
    height: 100%;
    overflow: hidden;

    .user {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;
        margin-bottom: 20px;

        img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            margin-right: 40px;
        }

        .user-info {
            p {
                line-height: 40px;
            }

            .user-info-p {
                color: #999;
            }

            .user-info-admin {
                font-size: 35px
            }
        }
    }

    .graph {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;

        .el-card {
            width: 48%;
            height: 260px;
        }
    }
}

.login-info {
    p {
        line-height: 30px;
        font-size: 14px;
        color: #999;

        span {
            color: #666;
            margin-left: 60px;
        }

        ;
    }
}

.user-table {
    margin-top: 20px;

}

.num {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .el-card {
        width: 32%;
        margin-bottom: 20px;
    }

    .icons {
        width: 80px;
        height: 80px;
        font-size: 30px;
        text-align: center;
        line-height: 80px;
        color: #fff;
    }

    .detail {
        margin-left: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .num {
            font-size: 30px;
            margin-bottom: 10px;
        }

        .txt {
            font-size: 15px;
            text-align: center;
            color: #999;
        }
    }

}
</style>