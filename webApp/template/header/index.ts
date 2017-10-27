// import  html from 'index.html'
import './index.scss'
import * as JR from 'jr-ui'
export default {
    template: `<div class="title f-fl">
        <span class="title-txt">结算系统</span>
        </div>
        <div class="f-fr userinfo">
            <span>欢迎您 {user}</span>
            <a href="javascript:void(0)" style="color:#006cff" on-click={this.exit()}>退出</a>
        </div>
        <div class="top-line f-cl"></div>`,
    data: {
        user: ''
    },
    config: function () {
    },
    init: function () {
        this.supr()
    },
    exit: function () {
        JR.Modal.confirm('确认退出吗?').$on('ok', function () {
        })
    }
}