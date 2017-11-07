/**
 * 前端单页路由，基于hash
 * api:http://leeluolee.github.io/stateman/?API-zh=undefined&doc=API&lang=zh
 */
import * as stateman from "stateman"
import menuConfig from './config'
import * as Regular from "regularjs"
export default {
    template: "<jr-sidebar uniqueOpened={uniqueOpened} showRetract={false} top={ '15px'} menus={menus} ref='slider' />",
    config() {
        this.data.menus = menuConfig.menulist
        this.routerObj = {};
        this.createRoute(menuConfig.menulist);
        this.stateMan.state(this.routerObj).start();
    },
    init(){
        let hash = window.location.hash
        hash = hash.length > 0 ? hash.substr(1) : hash
        if (hash.indexOf('?') !== -1) {
            hash = hash.substr(0, hash.indexOf('?'))
        }
        if (!this.routerObj[hash]) {
             window.location.href = '#'+this.m;
        }
        this.supr();
        this.$inject("#menu");
        this.$update();
    },
    currentModule: null,
    stateMan:null,
    /**
     * 创建路由
     */
    createRoute(list) {
        this.stateMan = new stateman()
        list.forEach(item => {
            if (item.children) {
                this.createRoute(item.children);
                return;
            }
            var m = item.url.slice(1)
            if(item.currentSelected){
                this.m = m;
            }
            this.routerObj[m] = {
                enter: () => {
                    if (!item.module) {
                        return
                    }
                    var Module = Regular.extend(item.module.default)
                    this.currentModule = new Module()
                    this.changeView(item)
                },
                leave: () => {
                    if (this.currentModule) {
                        this.currentModule.$inject(false)
                        this.currentModule.destroy()
                    }
                },
                update: () => {
                    console.log("update the view: " + m)
                }
            }
        })
    },
    // 更改内容
    changeView: function (item) {
        this.currentModule.$inject('#main')
        window.setTimeout(() => {
            this.$refs.slider && this.$refs.slider.selecteItem(item.url)
            this.$update()
        }, 0)

    }
}


