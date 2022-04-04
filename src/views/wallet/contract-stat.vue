<template>
  <div class="main">
    <sidebar code="contract" />

    <div class="content">
      <div class="stat">
        <div style="width: 160px;float: left;text-align: center">
          <div>
            昨日收益
          </div>
          <div
            style="margin-top: 5px;font-size: 13px;"
            class="bearish"
          >
            <span style="font-size: 15px;">-$907.22</span>
            <span> / -0.61%</span>
          </div>
        </div>
        <div style="width: 220px;float: left;text-align: center">
          <div>
            总收益
          </div>
          <div
            style="margin-top: 5px;font-size: 13px;"
            class="bullish"
          >
            <span style="font-size: 15px;">+$2907.21</span>
            <span> / +12.62%</span>
          </div>
        </div>
      </div>

      <div style="clear: both">
        <div style="color: var(--app-text-color-light)">
          每日收益
        </div>
        <v-chart
          style="height: 400px;width: 100%;float: left"
          :option="optionDayProfit"
          autoresize
        />
      </div>

      <div style="clear: both">
        <div style="color: var(--app-text-color-light)">
          盈亏分析
        </div>
        <div>
          xxx
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Sidebar from './sidebar'

  export default {
    components: {Sidebar},
    data() {
      return {
        uploading: false,
        loading: false,
        optionDayProfit: {
          color: ['#13b887'],
          xAxis: {
            name: '日期',
            type: 'category',
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14']
          },
          yAxis: {
            type: 'value',
            name: '收益（USDT）'
          },
          series: [
            {
              data: [120, 200, {value: -150, itemStyle: {color: '#eb4d5c'}}, 80, {value: -70, itemStyle: {color: '#eb4d5c'}}, 110, 0, {value: -50, itemStyle: {color: '#eb4d5c'}}, 110, 130, {value: -250, itemStyle: {color: '#eb4d5c'}}, 110, 130, 110],
              type: 'bar'
            }
          ]
        }
      }
    },
    methods: {
    },
    mounted() {
    }
  }
</script>

<style scoped lang="scss">
  .content {
    float: right;
    width: calc(100% - 330px);
  }
</style>
