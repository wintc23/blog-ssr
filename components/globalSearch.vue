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
    <div class="search-result" v-if="resultList.length">
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
      resultList: []
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
      if (this.keyword.length < 2) {
        this.$Message.warning('请输入关键词搜索，不少于2字符')
        return
      }
      this.dataList = []
      this.searchIndex.search(this.keyword, {
        attributesToRetrieve: ['id', 'title']
      }).then(({ hits }) => {
        this.resultList = hits || []
        if (!this.resultList.length) {
          this.$Message.warning('未检索到相关结果')
        }
      })
    },
    clearResult () {
      this.resultList = []
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
        background transparent
        border-radius 20px
        color #fff
        padding 0 15px
        width 200px
  .search-result
    position absolute
    background #f5f5f5
    top calc(100% + 5px)
    padding 10px 0
    box-shadow 0 0 10px 0 rgba(0, 0, 0, .3)
    max-height 60vh
    overflow auto
    width 400px
    max-width 90vw
    right 0
    border-radius 4px
    line-height 1.5
    opacity .95
    .result
      padding 10px 20px
      &+.result
        border-bottom 1px solid #e2e2e3
      .link
        user-select none
        &:hover
          text-decoration underline

</style>