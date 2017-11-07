// import  html from 'index.html'
import './index.scss'
import * as JR from 'jr-ui'
import * as html from './index.html'
import * as params from '../../../package.json'
export default {
    template: html,
    data: {
        user: '',
        description:  (<any>params).description
    },
    config: function () {
    },
    init: function () {
        this.supr()
        this.$inject("#header");
        this.$update();
    },
    exit: function () {
        JR.Modal.confirm('确认退出吗?').$on('ok', function () {
        })
    }
}