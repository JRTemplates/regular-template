/**
 * fetch基类，主要是fetch方法
 * hzxiongxu
 */
import 'whatwg-fetch'
export default {
    pCache: {},
    types: {
        html: {
            type: 'text/html',
            serializer: function(v) {
                return v
            }
        },
        json: {
            type: 'application/json',
            serializer: JSON.stringify
        },
        xml: {
            type: 'application/xml',
            serializer: function(v) {
                return v
            }
        },
        form: {
            type: 'application/x-www-form-urlencoded',
            serializer: this.serialize
        }
    },
    // fetch: function(url, options) {
    //     if (!window.merchantId) {
    //         return this.fetchResult('/currentUser.htm').then(function(data) {
    //             if (data.success) {
    //                 window.merchantId = data.result.merchantId
    //                 return this.fetchResult(url, options)
    //             }
    //         }.bind(this))
    //     } else {
    //         return this.fetchResult(url, options)
    //     }
    // },
    /**
     * 创建一个fetch请求
     * @param   {String}    url 请求url
     * @param   {Object}    options 请求参数
     * @param   {String}    options.method 请求方法
     * @param   {any}       options.data 请求数据，会根据dataType做相应的处理
     * @param   {String}    options.dataType 请求数据类型，可选 html|json|xml|form
     * @param   {Object}    options.headers 可设置请求头
     * @param   {Boolean/String}    options.cache 是否使用缓存.
     *                      当该参数为非空字符串时，清空缓存(clearCache)时若传入该字符串则只清空该字符串对应的缓存。
     */
    fetch: function(url, options) {
        options = options || {}
        options = this._getRequestOption(url, options)
        var crtCache = this.pCache
            // 缓存处理
        if (options.cache) {
            if (typeof options.cache === 'string') {
                var cacheKey = options.cache
                if (!this.pCache[cacheKey]) {
                    this.pCache[cacheKey] = {}
                }
                crtCache = this.pCache[cacheKey]
            }
            var pKey = this._getRequestKey(url, options)
            if (crtCache[pKey]) {
                return crtCache[pKey].then(function(res) {
                    return JSON.parse(JSON.stringify(res))
                })
            }
        }
        let pro = fetch(options.url, options)
            .then(function(result) {
                if (result.ok) {
                    switch (options.type) {
                        case 'json':
                            return result.json()
                        default:
                            return result.text()
                    }
                } else {}
            })
            .then(function(data) {
                if (data) {
                    // 部分返回字符串形式，需要转换成JSON
                    if (data.result && typeof data.result === 'string') {
                        data.result = JSON.parse(data.result)
                    }
                    if (data.code && data.code === '201') {
                        window.location.href = '/index.htm'
                        return null
                    }
                    if (data.success || data.code) {
                        return data
                    }
                }
                // 可以在此处拦截一些错误信息的处理
                var error = new Error()
                error.result = data
                throw error
            })
            .catch(function(error) {
                if (options.cache) {
                    delete crtCache[pKey]
                }
                const errorMsg = error.message || '网络或浏览器出现问题,请稍后再试'
                window.JRUI.Notify['error'](errorMsg)
                return Promise.reject(error.result)
            })
        if (options.cache) {
            crtCache[pKey] = Promise
        }
        return pro
    },
    _getRequestKey: function(url, options) {
        return (
            url +
            '-' +
            options.method +
            '-' +
            JSON.stringify(options.data).replace(/["{}:]/g, '')
        )
    },
    /**
     * 生成请求参数
     * @private
     */
    _getRequestOption: function(url, options) {
        var defaults = {
            url: url,
            type: 'json',
            method: 'POST',
            timeout: 30000,
            headers: {
                'Content-Type': 'text/plain; charset=UTF-8',
                'Cache-Control': 'no-cache',
                Pragma: 'no-cache',
                'If-Modified-Since': '0'
            },
            credentials: 'same-origin'
        }
        var requestOption = Object.assign(defaults, options)
        requestOption.method = requestOption.method.toUpperCase()
        if (options && options.data) {
            // 默认传入的数据
            // if (window.merchantId) {
            //     options.data.merchantId = window.merchantId
            // }
            var type = this.types[requestOption.dataType] || this.types.json
            requestOption.headers['Content-Type'] = type.type + '; charset=UTF-8'
            if (requestOption.method === 'GET' || requestOption.method === 'DELETE') {
                requestOption.url += '?' + this.serialize(requestOption.data)
            } else {
                requestOption.body = type.serializer(requestOption.data)
            }
        }
        return requestOption
    },
    isObject: function(obj) {
        return obj instanceof Object
    },
    // 格式化数据
    serialize: function(obj) {
        if (!this.isObject(obj)) {
            return obj
        }
        var pairs = []
        for (var key in obj) {
            this.pushEncodedKeyValuePair(pairs, key, obj[key])
        }
        return pairs.join('&')
    },
    pushEncodedKeyValuePair: function(pairs, key, val) {
        if (val !== null && val !== undefined) {
            if (Array.isArray(val)) {
                val.forEach(function(v) {
                    this.pushEncodedKeyValuePair(pairs, key, v)
                })
            } else if (this.isObject(val)) {
                for (var subkey in val) {
                    this.pushEncodedKeyValuePair(
                        pairs,
                        key + '[' + subkey + ']',
                        val[subkey]
                    )
                }
            } else {
                pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(val))
            }
        } else if (val === null) {
            pairs.push(encodeURIComponent(key))
        }
    },
    // 清空缓存
    clearCache: function(key) {
        if (typeof key === 'string') {
            delete this.pCache[key]
        } else {
            this.pCache = {}
        }
    }
}