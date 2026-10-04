<script setup lang="ts">
import { ref, watch, type Ref } from "vue"
import { NConfigProvider, darkTheme } from 'naive-ui'
import { NInputNumber, NFlex, NButton } from "naive-ui"

import exporter from "./components/exporter";

const PREVIEW_SIZE = 60;

const row = ref(1); // 行数
const col = ref(1); // 列数

const heightList: Ref<number[]> = ref([1]);//行高
const widthList: Ref<number[]> = ref([1]);//列宽

const border: Ref<number> = ref(0.03);

watch(row, (nRow) => {
  heightList.value = [];
  const defaultGap = 1 / nRow;
  for (let i = 0; i < nRow; ++i) {
    heightList.value.push(defaultGap);
  }
});
watch(col, (nCol) => {
  widthList.value = [];
  const defaultGap = 1 / nCol;
  for (let i = 0; i < nCol; ++i) {
    widthList.value.push(defaultGap);
  }
});

function calcMaxSize(gaps: Array<number>, index: number) {
  const used = gaps.reduce((acc, curr) => acc + curr, 0) - gaps[index];
  return 1 - used;
}

</script>

<template>
  <n-config-provider :theme="darkTheme">

    <h1 style="text-align: center;">生成配置</h1>

    <div id="counters">

      <n-flex align="center" justify="space-between" class="ipt">
        <span>行：</span>
        <n-input-number min="1" v-model:value="row" />
      </n-flex>

      <n-flex align="center" justify="space-between" class="ipt">
        <span>列：</span>
        <n-input-number min="1" v-model:value="col" />
      </n-flex>

      <n-flex align="center" justify="space-between" class="ipt">
        <span>边框：</span>
        <n-input-number max="0.5" v-model:value="border" />
      </n-flex>

    </div>

    <div class="preview">
      <n-flex v-for="h, hIndex in heightList" :size="[0, 0]" align="stretch">
        <n-flex v-for="w, wIndex in widthList" align="stretch" :size="[0, 0]"
          :style="{ height: h * PREVIEW_SIZE + 'vh' }" vertical>
          <div class="zone" :style="{ width: w * PREVIEW_SIZE + 'vw' }">

            <div>{{ hIndex }},{{ wIndex }}</div>
            <n-input-number min="0" :max="calcMaxSize(widthList, wIndex)" :step="0.01"
              v-model:value="widthList[wIndex]" />
            <n-input-number min="0" :max="calcMaxSize(heightList, hIndex)" :step="0.01"
              v-model:value="heightList[hIndex]" />

          </div>
        </n-flex>
      </n-flex>
    </div>

    <div style=" text-align: center;">
      <n-button strong secondary @click="() => exporter(heightList, widthList, border)"> 导出 </n-button>
    </div>

  </n-config-provider>
</template>

<style scoped>
.ipt {
  width: 15vw;
  margin: 3vh auto;

  .n-input-number {
    width: 10vw;
  }
}

.preview {
  width: v-bind(PREVIEW_SIZE + "vw");
  height: v-bind(PREVIEW_SIZE + "vh");
  background-color: #28292f;
  margin: 3vh auto;
}

.zone {
  box-sizing: border-box;
  border-width: v-bind(PREVIEW_SIZE * border + "vh") v-bind(PREVIEW_SIZE * border + "vw");
  border-color: #002f58;
  border-style: solid;
  height: 100%;
  color: #ccc;
  text-align: center;

  >* {
    margin: 2em;
  }

  >.n-input-number {
    text-align: left;
  }

}
</style>