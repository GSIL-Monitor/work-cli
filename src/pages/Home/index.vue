<template>
    <div @click="IncreaseCount()">{{count}}</div>
</template>

<style lang="less" scoped>

</style>

<script>
import { mapActions, mapMutations } from "vuex";

export default {
  computed: {
    count () {
      return this.$store.state.count
    }
  },
   methods: {
    ...mapMutations(["IncreaseCount"]),
  },

}
</script>
