<style lang="less">
    @import "styles/dataIcon.less";
</style>
<template>
    <Card :padding="0" :bordered="true">
        <div class="item">
            <div class="item-icon" :style="{color: mColor}">
                <Icon :type="iconType" :size="iconSize"></Icon>
            </div>
            <div class="item-info" @click="cardClick" >
                <span>{{introText}}</span>
                <h3 :style="{color: this.mColor}">{{val}}</h3>
            </div>
        </div>
    </Card>
</template>
<script>
    export default {
        name: 'dataIcon',
        data(){
            return{
                mColor:'green',
            }
        },
        props: {
            val: Number,
            color: String,
            iconType: String,
            introText: String,
            alermType:Number,
            countSize: {
                type: String,
                default: '30px'
            },
            countWeight: {
                type: Number,
                default: 700
            },
            iconSize: {
                type: Number,
                default: 40
            }
        },
        methods:{
            cardClick(){
                this.$store.commit('setAlermType', this.alermType);
                this.$router.push({
                    name: 'alerm_index'
                });
            },
        },
        mounted () {
            this.$nextTick(() => {
                this.mColor=this.val>0?'red':'green';
            });
        },
        watch: {
            val:function (v,oldv) {
                this.mColor=v>0?'red':'green';
            }
        }
    };
</script>
