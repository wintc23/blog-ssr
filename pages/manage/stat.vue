<template>
  <div class="stat-manage-container">
    <div class="container">
      <div class="toolbar">
        <DatePicker
          class="date-picker"
          type="daterange"
          split-panels
          :value="dateRange"
          @on-change="changeDateRange"
          placement="bottom-end"
          placeholder="选择统计日期范围">
        </DatePicker>
        <RadioGroup :value="granularity" type="button" @on-change="changeGranularity">
          <Radio label="day">按天</Radio>
          <Radio label="week">按周</Radio>
        </RadioGroup>
      </div>
      <div class="summary">
        <div class="summary-item">
          <div class="label">总 PV</div>
          <div class="value">{{ summary.totalPv || 0 }}</div>
        </div>
        <div class="summary-item">
          <div class="label">总 UV</div>
          <div class="value">{{ summary.totalUv || 0 }}</div>
        </div>
      </div>
      <div class="stat-table" ref="container">
        <div class="table-container">
          <Table :height="tableHeight" stripe border :columns="columns" :data="statList"></Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSiteStatReport } from '@/api/stat'

export default {
  data () {
    return {
      tableHeight: 0,
      granularity: 'day',
      statList: [],
      dateRange: [],
      summary: {
        totalPv: 0,
        totalUv: 0,
      },
      columns: [{
        title: '周期',
        key: 'bucket'
      },
      {
        title: 'PV',
        key: 'pv',
        align: 'center'
      },
      {
        title: 'UV',
        key: 'uv',
        align: 'center'
      }]
    }
  },
  mounted () {
    this.getStatReport()
    this.calTableHeight()
    window.addEventListener('resize', this.calTableHeight)
    this.$bus.$on('site-stat-summary', this.handleSiteStatSummary)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.calTableHeight)
    this.$bus.$off('site-stat-summary', this.handleSiteStatSummary)
  },
  methods: {
    calTableHeight () {
      if (!this.$refs.container) return
      let rect = this.$refs.container.getBoundingClientRect()
      this.tableHeight = rect.height
    },
    getParams () {
      let params = {
        granularity: this.granularity
      }
      if (this.dateRange && this.dateRange.length === 2) {
        params.startTime = new Date(`${this.dateRange[0]} 00:00:00`).getTime() / 1000
        params.endTime = new Date(`${this.dateRange[1]} 23:59:59`).getTime() / 1000
      }
      return params
    },
    getStatReport () {
      getSiteStatReport(this.getParams()).then(res => {
        if (res.status === 200) {
          this.statList = res.data.list
          this.summary = res.data.summary || {
            totalPv: 0,
            totalUv: 0,
          }
        }
      })
    },
    changeGranularity (granularity) {
      this.granularity = granularity
      this.getStatReport()
    },
    changeDateRange (value) {
      this.dateRange = value || []
      this.getStatReport()
    },
    handleSiteStatSummary () {
      this.getStatReport()
    }
  }
}
</script>

<style lang="stylus" scoped>
.stat-manage-container
  position relative
  background #C9C9C9
  .container
    position absolute
    top .5rem
    bottom .5rem
    left .5rem
    right .5rem
    background white
    border-radius 4px
    display flex
    flex-direction column
  .toolbar
    flex-shrink 0
    padding .5rem
    display flex
    justify-content space-between
    align-items center
    border-bottom 1px solid #A9A9A9
    .date-picker
      width 320px
  .summary
    flex-shrink 0
    display flex
    padding .5rem
    gap 10px
    .summary-item
      min-width 120px
      padding .75rem 1rem
      border-radius 4px
      background #f5f7f9
      .label
        color #999
        font-size 12px
      .value
        margin-top .25rem
        color #2d8cf0
        font-size 24px
        font-weight bold
  .stat-table
    flex auto
    overflow auto
    padding .5rem
    position relative
    .table-container
      position absolute
      left 0
      right 0
      top 0
      bottom 0
</style>
