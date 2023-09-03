<template>
    <div>
        <el-row>
            <el-col :span="12">
                <div class="block">
                    <span class="demonstration">请选择日期</span>
                    <el-date-picker v-model="lineChartDate" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </div>
                <div id="lineChart" class="lineChart"></div>
            </el-col>
            <el-col :span="12">
                <div id="pieChart" class="pieChart"></div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { getSalesChart } from '@/api/order'
import { getCategorySalesChart } from '@/api/goods'
export default {

    data() {
        return {
            lineChartDate: null,
            msg: 'Welcome use Echarts',
            date: [],
            SaleChart: [],
            pieChart: [],
            pieChartName: ["玩具", '保健', "主粮"],
            test: [1, 2, 3],
        };
    },
    mounted() {
        //划分日期
        let year = new Date().getFullYear(); //获取当前时间的年份
        let month = new Date().getMonth() + 1; //获取当前时间的月份
        let day = new Date().getDate(); //获取当前时间的天数

        let endDate = new Date(); // 获取当前日期对象
        endDate.setDate(endDate.getDate() - 7); // 将日期减去7天

        let begin_year = endDate.getFullYear(); // 获取年份
        let begin_month = endDate.getMonth() + 1; // 获取月份（注意要加1，因为月份是从0开始的）
        let begin_day = endDate.getDate(); // 获取日期

        let end = year + '.' + month + '.' + day;
        let begin = begin_year + '.' + begin_month + '.' + begin_day
        console.log("begin",begin)

        this.lineChartDate = [begin, end]

        getSalesChart("/order/getSalesChart", { begin, end }).then((response) => {
            console.log(response.data.data)
            this.SaleChart = response.data.data
            this.date = response.data.data.goodsTime
            this.drawLine();
        })

        getCategorySalesChart("/goods/getCategorySalesChart", {}).then((response) => {
            console.log(response.data.data)
            //0-玩具 1-保健  2-主粮
            this.pieChart = response.data.data.map((value, index) => {
                return {
                    value: value,
                    name: this.pieChartName[index]
                };
            });
            this.drawPie()
        })

    },
    watch: {
        lineChartDate(newValue, oldValue) {
            if (newValue.length === 2) {
                const startDate = new Date(newValue[0]);
                const endDate = new Date(newValue[1]);

                const year = startDate.getFullYear()
                const startMonth = startDate.getMonth() + 1; // 月份从0开始，需要加1
                const startDay = startDate.getDate();
                const end_year = endDate.getFullYear(); // 获取年份
                const endMonth = endDate.getMonth() + 1;
                const endDay = endDate.getDate();
                const begin = year+'.'+startMonth + '.' + startDay
                const end = end_year+'.'+endMonth + '.' + endDay
                console.log(begin + '到' + end)
                getSalesChart("/order/getSalesChart", { begin, end }).then((response) => {
                    console.log(response.data.data)
                    this.SaleChart = response.data.data
                    this.date = response.data.data.goodsTime
                    this.drawLine();
                })
            }
        }
    },
    methods: {
        drawLine() {
            // 基于准备好的dom，初始化echarts实例
            let lineChart = this.$echarts.init(document.getElementById('lineChart'))
            // 绘制图表
            lineChart.setOption({
                title: {
                    text: '商品分类售卖分析',
                    // subtext: 'Fake Data',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['goods', 'pet'],
                    top: 30
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.date
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: 'goods',
                        type: 'line',
                        data: this.SaleChart.goods
                    },
                    {
                        name: 'pet',
                        type: 'line',
                        data: this.SaleChart.pet
                    },

                ]
            });
        },
        drawPie() {
            // 基于准备好的dom，初始化echarts实例
            let pieChart = this.$echarts.init(document.getElementById('pieChart'))
            // 绘制图表
            pieChart.setOption({
                title: {
                    text: '商品分类售卖分析',
                    // subtext: 'Fake Data',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: '50%',
                        data: this.pieChart,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            })
        }
    }
}
</script>

<style>
.demonstration {
    margin-left: 25px;
}

.lineChart {
    width: 500px;
    height: 500px;
    display: inline-block;
    margin-left: auto;
    margin-right: auto;
}

.pieChart {
    width: 600px;
    height: 600px;
    display: inline-block;
    margin-left: auto;
    margin-right: auto;
    margin-top: 44px;
}
</style>