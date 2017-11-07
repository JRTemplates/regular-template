import menu from "./template/menu/index"
import header from "./template/header/index"
import * as JR from 'jr-ui'
import * as Regular from 'regularjs';
import "./scss/index.scss"
//全局注册ui组件库
JR.install(Regular);
new (Regular.extend(menu))()
new (Regular.extend(header))()  




