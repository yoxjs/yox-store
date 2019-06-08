
let Yox

export class Store {

  constructor() {
    this.$store = new Yox()
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
    let instance = this
    let value = instance.$store.get(key)
    if (readFromStorage) {
      return value === undefined
        ? instance.read(
            key,
            function (value) {
              instance.set(key, value)
              callback(value)
            }
          )
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

  prepend(key, data) {
    this.$store.prepend(key, data)
  }

  append(key, data) {
    this.$store.append(key, data)
  }

  /**
   * 通过索引移除数组中的元素
   *
   * @param {string} keypath
   * @param {number} index
   * @return {?boolean} 是否移除成功
   */
  removeAt(keypath, index) {
    return this.$store.removeAt(keypath, index)
  }

  /**
   * 直接移除数组中的元素
   *
   * @param {string} keypath
   * @param {*} item
   * @return {?boolean} 是否移除成功
   */
  remove(keypath, item) {
    return this.$store.remove(keypath, item)
  }

  increase(key, step, max) {
    this.$store.increase(key, step, max)
  }

  decrease(key, step, min) {
    this.$store.decrease(key, step, min)
  }

  /**
   * 更新对象类型的数据
   *
   * @param {string} key
   * @param {Object} value
   */
  extend(key, value) {
    if (Yox.is.object(value)) {
      let oldValue = this.get(key)
      if (Yox.is.object(oldValue)) {
        value = Yox.object.extend(
          Yox.object.extend({}, oldValue),
          value
        )
      }
      this.set(key, value)
    }
  }

  /**
   * 尝试设值
   *
   * @param {string} key
   * @param {string|number|boolean} value
   * @return {Function} 返回异步回调，传入是否失败
   */
  setting(key, value) {

    let instance = this
    let oldValue = instance.get(key)
    instance.set(key, value)

    return function (error) {
      if (error) {
        instance.set(key, oldValue)
      }
    }

  }

  increasing(key, step, max) {

    let instance = this
    let oldValue = instance.get(key)
    instance.increase(key, step, max)

    return function (error) {
      if (error) {
        instance.set(key, oldValue)
      }
    }

  }

  decreasing(key, step, min) {

    let instance = this
    let oldValue = instance.get(key)
    instance.decrease(key, step, min)

    return function (error) {
      if (error) {
        instance.set(key, oldValue)
      }
    }

  }

  /**
   * 数据监听
   *
   * @param {string} key
   * @param {Function} watcher
   * @param {boolean} immediate
   */
  watch(key, watcher, immediate) {
    this.$store.watch(key, watcher, immediate)
  }

  /**
   * 取消数据监听
   *
   * @param {string} key
   * @param {Function} watcher
   */
  unwatch(key, watcher) {
    this.$store.unwatch(key, watcher)
  }

  nextTick(fn) {
    this.$store.nextTick(fn)
  }

}

/**
 * 版本
 */
export const version = process.env.NODE_VERSION

/**
 * 安装插件
 */
export function install(Class) {
  Yox = Class
}
