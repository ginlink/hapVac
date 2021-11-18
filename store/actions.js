

export function updateUserInfoAction(that) {
  that.$http
    .get('/api/user')
    .then((res) => {
      const data = res.data ?? []

      that.$store.commit('updateUserInfo', data)
    })
    .catch((err) => {
      console.log('err:func(initUserInfo)(user)', err)
    })
}