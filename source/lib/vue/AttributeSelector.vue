<template>
  <ul class="attribute-box">
    <li
      v-for="attribute in AttributeList"
      :key="attribute"
      :style="{ backgroundColor: AttributeColor[attribute], opacity: value === attribute ? 1 : 0.3 }"
      @click="select(attribute)"
    >
      {{ AttributeCn[attribute] }}
    </li>
  </ul>
</template>
<script>
import { AttributeCn, AttributeColor, AttributeList } from "../utils/const";

export default {
  props: ["value"],
  data() {
    return {
      AttributeCn,
      AttributeColor,
      AttributeList,
    };
  },
  methods: {
    select(attri) {
      this.value = attri;
      this.$emit('input', attri);
    },
  }
};
</script>

<style>
.attribute-box {
  display: flex;
  justify-content: space-between;
  list-style: none;
  padding: 8px;
  color: #fff;
  background-color: #f7f7f7;
}

.attribute-box li {
  width: 32px;
  height: 32px;
  line-height: 32px;
  margin-right: 8px;
  text-align: center;
  transition: opacity 0.3s;
  cursor: pointer;
}

.attribute-box li:last-child {
  margin-right: 0;
}

.attribute-box .select {
  opacity: 1;
}

.attribute-box .unselect {
  opacity: 0.3;
}
</style>