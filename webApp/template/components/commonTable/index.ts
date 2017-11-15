/**
 * @author hzxiongxu
 * @description 基础table
 * 默认为占满全屏，根据内容分配列宽
 */
import './index.html'
import * as rgl from 'regularjs'
export default (<any>rgl).extend({
    data: {
    },
    config() {
        this.data = (<any>Object).assign({}, this.data, {
            // 对齐方式
            align: 'left',
            //是否有分页
            pager: true,
            //是否固定表头
            fixedHeader: false,
            //加载中
            loading: false,
            //是否可多选
            enableCheckAll: false,
            // 分页信息
            paging: {
                pageSize: 20,
                sumTotal: 100,
                current: 1
            },
            //文件内容
            source: [{
                // 标题
                name: "",
                //内容
                key: '',
                //链接地址，如果为空则无链接
                link: '',
                // 过滤器
                filter: '',
            }],
        })
    },
    //复选框事件
    onCheck(e) {
       this.$emit(e);
    }
})