import  menu from "./template/menu/index"
import  header from "./template/header/index"
import { install } from 'jr-ui'
import * as Regular from 'regularjs';
import "./scss/index.scss"

//全局注册ui组件库
install(Regular);
//头部
var Header = Regular.extend(header);
(new Header()).$inject("#header")
//菜单
var Menu = Regular.extend(menu);
(new Menu()).$inject("#menu")


