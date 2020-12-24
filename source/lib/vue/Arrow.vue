<template>
  <ul class="arrow-box">
    <li v-for="index in [0, 1, 2, 3]" :key="index" :class="value[index] ? 'on': 'off'" @click="handleClick(index)"></li>
    <li class="blank"></li>
    <li v-for="index in [4, 5, 6, 7]" :key="index" :class="value[index] ? 'on': 'off'" @click="handleClick(index)"></li>
  </ul>
</template>

<script>
export default {
  name: 'arrow',
  props: ['value'],
  data() {
    return {}
  },
  methods: {
    handleClick(index) {
      this.$set(this.value, index, 1 - this.value[index]);
      this.$emit('input', [...this.value]);
    }
  }
}
</script>

<style scoped>
.arrow-box {
  list-style: none;
  margin: 0;
  margin-top: 20px;
  padding: 0;
  display: grid !important;
  width: 140px;
  height: 140px;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}
  
.arrow-box li {
  display: block;
  border-radius: 4px;
  border: solid 5px #eee;
  transition: all 0.2s;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.arrow-box li:hover {
  border: solid 5px #ddd;
}

.arrow-box .on {
  background-color: rgb(252, 120, 72);
}

.arrow-box .off {
  background-color: #ddd;
}

.arrow-box .blank {
  background: none;
  cursor: default;
}
</style>>