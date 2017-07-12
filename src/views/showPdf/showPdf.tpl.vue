<div class="result">
    <div class="title">{{ fileName }}</div>
    <div id="theCanvas" v-if="!isNotData.type"></div>
    <div class="no-data" v-else>{{ isNotData.msg }}</div>
    <div class="load-more" @click="getDatas" v-if="isLoadType">点击加载更多</div>
</div>
