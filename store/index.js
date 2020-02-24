export const actions = {
  nuxtServerInit ({ dispatch }, { route }) {
    let promiseList = [
      dispatch('site/getAdminInfo'),
      dispatch('site/getTagList'),
      dispatch('site/getTopTen'),
      dispatch('site/getTopicList'),
      dispatch('site/getFrindLinkList')
    ]
    return Promise.all(promiseList)
  }
}