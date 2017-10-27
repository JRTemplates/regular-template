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
            title: '测试子1',
            url: '#test1',
            module: require('../page/test1.ts')
        }, {
            title: '测试子2',
            url: '#test2',
            module: require('../page/test1.ts')
        }]
    },{
        title: '测试父2',
        icon: '',
        open: true,
        children: [{
            title: '测试子3',
            url: '#test3',
            module: ''
        }, {
            title: '测试子4',
            url: '#test4',
            module: ''
        }]
    }]
}