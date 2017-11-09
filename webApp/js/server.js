/**
 * fetch基类，主要是fetch方法
 * hzxiongxu
 */
import * as JR from 'jr-ui'
export default function (method, api, body): Promise<any>  {
  let fetching;
  if (method === 'post') {
    fetching = fetch(api, {
      method: 'post',
      credentials: 'include',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
      headers: new Headers({ 'content-type': 'application/json' ,'Accept': 'application/json',}),
      body: JSON.stringify(body)
    })
  } else {
    const toString = body ? Object.keys(body).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(body[key])
    }).join('&') : ''
    fetching = fetch(`${api}?${toString}`, {
      method: 'get',
      credentials: 'include',
    //   headers: {
    //     'Accept': 'application/json'
    //   }
      headers: new Headers({ 'content-type': 'application/json' })
    })
  }
  return fetching.then(res => res.json())
    .then(res => {
        switch (('' +res.resultCode).toUpperCase()) {
            //成功
          case 'SUCCESS':
           //参数交易失败
          case 'PARAM_ERROR':
          // 无数据
          case 'NOT_FOUND':
          //未授权
          case 'UNAUTHORIZED':
            return Promise.resolve(res)
            //程序异常
          case 'SERVER_ERROR':
            new JR.JRModal({
                data: {
                    okButton: '确定',
                    content: res.message||'程序异常'
                }
            })
            return Promise.reject(res)
            //登录超时
          case 'SESSION_TIMEOUT':
            //未登录
          case 'NO_AUTHENTICATION':
            window.location.href="/index.htm"
            return Promise.reject(res)
          default:
            return Promise.resolve(res)
        }
      })
}
