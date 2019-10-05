<template>
    <div class="notfound">
        <label for>{{time}}后即将返回登陆页面 ... </label>
        <img src="../assets/404.png" alt />
    </div>
</template>

<script>
export default {
    data() {
        return {
            time: 5
        };
    },
    created() {
        var timer = setInterval(() => {
            this.time--;
            if (this.time <= 0) {
                clearInterval(timer);
                this.$router.replace("/");
            }
        }, 1000);
    }
};
</script>

<style lang="less" scoped>
.notfound {
    width: 100%;
    height: 100%;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
    };
    label{
        width:300px;
        height:80px ;
        text-align: center;
        line-height: 80px;
        border-radius:5px;
        opacity: 0.9;
        position:absolute;
        top:30%;
        left:50%;
        margin-top:-40px;
        margin-left:-150px;
        background-color:rgb(63, 56, 56);
        font-weight:bold;
        color: white;
    }
}
</style>