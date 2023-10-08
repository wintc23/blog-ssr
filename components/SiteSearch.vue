<template>
  <div
    class="global-search"
    v-click-outside="clearResult"
    @scroll.stop>
    <Input
      @on-search="search"
      class="keyword-input"
      placeholder="输入关键词搜索"
      search
      v-model="keyword" />
    <div class="search-result fp" v-if="showResult">
      <template v-if="loading">
        <div class="loading">
          <div class="balls">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </template>
      <template v-else-if="resultList.length">
        <div
          v-for="result of resultList"
          :key="result.id"
          class="result">
          <nuxt-link
            @click.native="clearResult"
            class="link"
            :to="`/article/${result.id}`">
            {{ result.title }}
          </nuxt-link>
        </div>
      </template>
      <template v-else>
        <div class="noresult">未检索到相关结果</div>
      </template>
    </div>
  </div>
</template>

<script>
import algoliasearch from 'algoliasearch'
import { ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY, ALGOLIA_INDEX_NAME } from '@/config.js'
export default {
  data () {
    return {
      keyword: '',
      searchIndex: null,
      loading: false,
      resultList: [],
      showResult: false,
    }
  },
  created () {
    this.initSearchIndex()
  },
  methods: {
    initSearchIndex () {
      const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY)
      this.searchIndex = client.initIndex(ALGOLIA_INDEX_NAME)
    },
    search () {
      if (!this.searchIndex) return
      if (!this.keyword) {
        this.$Message.warning('请输入关键词搜索')
        return
      }
      this.showResult = true
      this.resultList = []
      this.loading = true
      this.searchIndex.search(this.keyword, {
        attributesToRetrieve: ['id', 'title']
      }).then(({ hits }) => {
        this.resultList = hits || []
        if (!this.resultList.length) {
          this.$Message.warning('未检索到相关结果')
        }
      }).finally(() => {
        this.loading = false
      })
    },
    clearResult () {
      this.resultList = []
      this.showResult = false
    }
  },
}
</script>

<style lang="stylus" scoped>
.global-search
  position relative
  .keyword-input
    >>>
      input
        border-radius 20px
        padding 0 15px
        width 200px
        border-color rgba(64, 158, 255, 1)
  .search-result
    position absolute
    background #f5f5f5
    top calc(100% + 5px)
    padding 10px 0
    max-height 60vh
    overflow auto
    width 300px
    max-width 90vw
    right 0
    border-radius 4px
    line-height 1.5
    opacity .95
    font-size 14px
    .result
      padding 5px 10px
      &+.result
        border-top 1px solid #e2e2e3
      .link
        user-select none
        &:hover
          text-decoration underline
    .noresult
      padding 5px 10px
      text-align center
      color #A9A9A9

.loading
  height 2.5em
  padding 5px 10px
  display flex
  justify-content center
  .balls
    width 3.5em
    display flex
    flex-flow row nowrap
    align-items center
    justify-content space-between

  .balls div
    width 0.8em
    height 0.8em
    border-radius 50%
    background-color #04cc91
    transform translateY(-100%)
    animation wave 0.8s ease-in-out alternate infinite

  .balls div:nth-of-type(1)
    animation-delay -0.4s

  .balls div:nth-of-type(2)
    animation-delay -0.2s

  @keyframes wave {
    from {
      transform 2(-100%)
    }
    to {
      transform translateY(100%)
    }
  }
</style>