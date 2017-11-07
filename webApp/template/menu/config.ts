/**
 * 菜单树页面
 * hzxiongxu
 */
export default {
    menulist: [{
        title: '测试父1',
        icon: '',
        open: true,
        children: [{
            title: '测试子11',
            url: '#test1',
            module: require('../page/test1.ts')
        }, {
            title: '测试子2',
            url: '#test2',
            // 进入页面默认选中
            currentSelected:true,
            module: require('../page/test1.ts')
        }]
    },{
        title: '测试父2',
        icon: '',
        open: true,
        children: [{
            title: '测试子3',
            url: '#test3',
            module: require('../page/test1.ts')
        }, {
            title: '测试子4',
            url: '#test4',
            module: require('../page/test1.ts')
        }]
    }]
}