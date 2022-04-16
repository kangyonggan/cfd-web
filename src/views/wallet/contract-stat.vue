<template>
  <div class="main">
    <sidebar code="contract" />

    <div class="content">
      <div class="stat">
        <div class="item">
          <div>
            净盈利
            <el-tooltip
              content="近30天总盈利减去总亏损"
              placement="top"
            >
              <el-icon>
                <question-filled />
              </el-icon>
            </el-tooltip>
          </div>
          <div
            style="margin-top: 5px;font-size: 13px;"
            :class="statData.totalProfit > 0 ? 'bullish' : statData.totalProfit < 0 ? 'bearish' : ''"
          >
            <span style="font-size: 15px;">
              {{ statData.totalProfit >= 0 ? '+' : '' }}{{ NumberUtil.formatUsdt(statData.totalProfit) }} USDT
            </span>
          </div>
        </div>
        <div class="item">
          <div>
            平均净盈利
            <el-tooltip
              content="近30天平均每天的盈利减去亏损"
              placement="top"
            >
              <el-icon>
                <question-filled />
              </el-icon>
            </el-tooltip>
          </div>
          <div
            style="margin-top: 5px;font-size: 13px;"
            :class="statData.avgProfit > 0 ? 'bullish' : statData.avgProfit < 0 ? 'bearish' : ''"
          >
            <span style="font-size: 15px;">
              {{ statData.totalProfit >= 0 ? '+' : '' }}{{ NumberUtil.formatUsdt(statData.avgProfit) }} USDT
            </span>
          </div>
        </div>
        <div class="item">
          <div>
            胜率
            <el-tooltip
              content="近30天盈利天数与总天数比"
              placement="top"
            >
              <el-icon>
                <question-filled />
              </el-icon>
            </el-tooltip>
          </div>
          <div
            style="margin-top: 5px;font-size: 13px;"
          >
            <span style="font-size: 15px;">
              {{ NumberUtil.formatUsdt(statData.winRate * 100) }}%
            </span>
          </div>
        </div>
        <div class="item">
          <div>
            盈亏比
            <el-tooltip
              content="近30天平均每天的盈利与平均每天的亏损比"
              placement="top"
            >
              <el-icon>
                <question-filled />
              </el-icon>
            </el-tooltip>
          </div>
          <div
            style="margin-top: 5px;font-size: 13px;"
          >
            <span
              style="font-size: 15px;"
              v-if="statData.profitLossRate !== -1 "
            >
              {{ statData.profitLossRate }}
            </span>
            <span
              v-else
              style="font-size: 18px;"
            >
              +∞
            </span>
          </div>
        </div>
      </div>

      <div style="clear: both">
        <v-chart
          style="height: 400px;width: 100%;float: left"
          :option="optionDayProfit"
          autoresize
        />
      </div>

      <div style="clear: both" />
    </div>
  </div>
</template>

<script>
  import Sidebar from './sidebar'
  import { QuestionFilled } from '@element-plus/icons'

  export default {
    components: {Sidebar, QuestionFilled},
    data() {
      return {
        uploading: false,
        loading: false,
        statData: {},
        optionDayProfit: {
          color: ['#13b887'],
          tooltip: {
            show: true
          },
          xAxis: {
            name: '日期',
            type: 'category',
            data: []
          },
          yAxis: {
            type: 'value',
            name: '盈利（USDT）'
          },
          series: [
            {
              data: [],
              type: 'bar'
            }
          ]
        }
      }
    },
    methods: {
      getProfitLossStat() {
        let endDay = this.DateTimeUtil.format(new Date().getTime() - 24 * 60 * 60 * 1000, 'yyyy-MM-dd')
        let beginDay = this.DateTimeUtil.format(new Date().getTime() - 29 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd')
        this.axios.get('/v1/user/profitLossStat?beginDay=' + beginDay + '&endDay=' + endDay).then(data => {
          this.statData = data
          this.optionDayProfit.xAxis.data = data.dayList

          let seriesData = []
          for (let i = 0; i < data.profitList.length; i++) {
            seriesData[i] = {
              value: this.NumberUtil.formatUsdt(data.profitList[i]),
              color: data.profitList[i] >= 0 ? '' : 'eb4d5c'
            }
          }

          this.optionDayProfit.series[0].data = seriesData
        }).catch(res => {
          console.log(res)
          this.$error(res.msg)
        })
      }
    },
    mounted() {
      this.getProfitLossStat()
    }
  }
</script>

<style scoped lang="scss">
  .content {
    float: right;
    width: calc(100% - 330px);

    .stat {
      .item {
        width: 25%;
        float: left;
        text-align: center;
      }
    }
  }
</style>
