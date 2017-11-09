/**
 * 基础配置页面
 * @autor hzxiongxu
 * @params  参数说明
 */
export default {
    config() {
        this.data = (<any>Object).assign({},this.data, {
            //标题
            title:"",
            //查询内容，按照顺序渲染
            searchForm:[

            ],
            //table列表
            tableList:[
                {
                    title:'1',
                    value:'',
                    isLink:false,
                }
            ],
        })
    }
}