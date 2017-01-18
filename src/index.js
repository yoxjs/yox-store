
const Yox = typeof require === 'function'
  ? require('yox')
  : window.Yox

export default class Store {

  constructor(shares) {
    this.$store = new Yox({ })
    this.$locked = { }
    if (shares) {
      this.register(shares)
    }
  }

  register(shares) {
    let instance = this
    Yox.array.each(
      shares,
      function (type) {
        instance[ type ] = function () {
          let args = arguments
          let key = `${type}.${args[ 0 ]}`
          if (args.length === 1 && Yox.is.string(args[ 0 ])) {
            return instance.get(key, args[ 1 ])
          }
          instance.set(key, args[ 1 ], args[ 2 ])
        }
      }
    )
  }

  /**
   * 从本地存储读取，需自行实现
   *
   * @param {string} key 数据的 key
   * @param {Function} callback
   */
  read(key, callback) {

  }

  /**
   * 把数据写到本地存储
   *
   * @param {string} key
   * @return {string|number|boolean} value 可以是字符串、数字、布尔，但从本地存储读取出来的都是字符串
   */
  write(key, value) {

  }

  /**
   * 内存中的取值
   *
   * @param {string} key
   * @param {?boolean} readFromStorage 如果内存没有取到值，是否从本地存储尝试取值
   * @param {?Function} callback 如果 readFromStorage 为 true，则必须传入回调函数
   */
  get(key, readFromStorage, callback) {
    let value = this.$store.get(key)
    if (readFromStorage) {
      return value === undefined
        ? this.read(key, callback)
        : Yox.nextTick(
            function () {
              callback(value)
            }
          )
    }
    return value
  }

  /**
   * 内存中的设值
   *
   * @param {string} key
   * @param {string|number|boolean} value
   * @param {?boolean} writeToStorage 是否写到本地存储中
   */
  set(key, value, writeToStorage) {
    this.$store.set(key, value)
    if (writeToStorage) {
      this.write(key, value)
    }
  }

  /**
   * 更新对象数据
   *
   * @param {string} key
   * @param {Object} value
   */
  extend(key, value) {
    if (Yox.is.object(value)) {
      let oldValue = this.get(key)
      if (Yox.is.object(oldValue)) {
        Yox.object.extend(oldValue, value)
        value = oldValue
      }
      this.set(key, value)
    }
  }

  /**
   * 尝试设值
   *
   * @param {string} key
   * @param {string|number|boolean} value
   * @param {Function} 返回失败时的处理函数
   */
  trying(key, value, promise) {

    let instance = this
    let oldValue = instance.get(key)
    instance.set(key, value)
    instance.lock(key)

    return function () {
      instance.unlock(key)
      instance.set(key, oldValue)
    }

  }

  /**
   * 数据是否加锁，如果已加锁，则在 UI 上应该禁止修改
   *
   * @param {string} key
   * @return {?boolean}
   */
  locked(key) {
    return this.$locked[ key ]
  }

  /**
   * 数据加锁
   *
   * @param {string} key
   */
  lock(key) {
    this.$locked[ key ] = true
  }

  /**
   * 数据解锁
   *
   * @param {string} key
   */
  unlock(key) {
    let { $locked } = this
    if ($locked[ key ]) {
      delete $locked[ key ]
    }
  }

  /**
   * 数据监听
   *
   * @param {string} key
   * @param {Function} listener
   */
  watch(key, listener) {
    this.$store.watch(key, listener)
  }

  /**
   * 取消数据监听
   *
   * @param {string} key
   * @param {Function} listener
   */
  unwatch(key, listener) {
    this.$store.unwatch(key, listener)
  }

}
