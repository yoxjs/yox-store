/**
 * yox-store.js v0.10.0
 * (c) 2017-2019 musicode
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.YoxStore = {}));
}(this, function (exports) { 'use strict';

  var Yox;

  var Store = function Store() {
    this.$store = new Yox();
  };

  /**
   * 从本地存储读取，需自行实现
   *
   * @param {string} key 数据的 key
   * @param {Function} callback
   */
  Store.prototype.read = function read (key, callback) {

  };

  /**
   * 把数据写到本地存储
   *
   * @param {string} key
   * @return {string|number|boolean} value 可以是字符串、数字、布尔，但从本地存储读取出来的都是字符串
   */
  Store.prototype.write = function write (key, value) {

  };

  /**
   * 内存中的取值
   *
   * @param {string} key
   * @param {?boolean} readFromStorage 如果内存没有取到值，是否从本地存储尝试取值
   * @param {?Function} callback 如果 readFromStorage 为 true，则必须传入回调函数
   */
  Store.prototype.get = function get (key, readFromStorage, callback) {
    var instance = this;
    var value = instance.$store.get(key);
    if (readFromStorage) {
      return value === undefined
        ? instance.read(
            key,
            function (value) {
              instance.set(key, value);
              callback(value);
            }
          )
        : Yox.nextTick(
            function () {
              callback(value);
            }
          )
    }
    return value
  };

  /**
   * 内存中的设值
   *
   * @param {string} key
   * @param {string|number|boolean} value
   * @param {?boolean} writeToStorage 是否写到本地存储中
   */
  Store.prototype.set = function set (key, value, writeToStorage) {
    this.$store.set(key, value);
    if (writeToStorage) {
      this.write(key, value);
    }
  };

  Store.prototype.prepend = function prepend (key, data) {
    this.$store.prepend(key, data);
  };

  Store.prototype.append = function append (key, data) {
    this.$store.append(key, data);
  };

  /**
   * 通过索引移除数组中的元素
   *
   * @param {string} keypath
   * @param {number} index
   * @return {?boolean} 是否移除成功
   */
  Store.prototype.removeAt = function removeAt (keypath, index) {
    return this.$store.removeAt(keypath, index)
  };

  /**
   * 直接移除数组中的元素
   *
   * @param {string} keypath
   * @param {*} item
   * @return {?boolean} 是否移除成功
   */
  Store.prototype.remove = function remove (keypath, item) {
    return this.$store.remove(keypath, item)
  };

  Store.prototype.increase = function increase (key, step, max) {
    this.$store.increase(key, step, max);
  };

  Store.prototype.decrease = function decrease (key, step, min) {
    this.$store.decrease(key, step, min);
  };

  /**
   * 更新对象类型的数据
   *
   * @param {string} key
   * @param {Object} value
   */
  Store.prototype.extend = function extend (key, value) {
    if (Yox.is.object(value)) {
      var oldValue = this.get(key);
      if (Yox.is.object(oldValue)) {
        value = Yox.object.extend(
          Yox.object.extend({}, oldValue),
          value
        );
      }
      this.set(key, value);
    }
  };

  /**
   * 尝试设值
   *
   * @param {string} key
   * @param {string|number|boolean} value
   * @return {Function} 返回异步回调，传入是否失败
   */
  Store.prototype.setting = function setting (key, value) {

    var instance = this;
    var oldValue = instance.get(key);
    instance.set(key, value);

    return function (error) {
      if (error) {
        instance.set(key, oldValue);
      }
    }

  };

  Store.prototype.increasing = function increasing (key, step, max) {

    var instance = this;
    var oldValue = instance.get(key);
    instance.increase(key, step, max);

    return function (error) {
      if (error) {
        instance.set(key, oldValue);
      }
    }

  };

  Store.prototype.decreasing = function decreasing (key, step, min) {

    var instance = this;
    var oldValue = instance.get(key);
    instance.decrease(key, step, min);

    return function (error) {
      if (error) {
        instance.set(key, oldValue);
      }
    }

  };

  /**
   * 数据监听
   *
   * @param {string} key
   * @param {Function} watcher
   * @param {boolean} immediate
   */
  Store.prototype.watch = function watch (key, watcher, immediate) {
    this.$store.watch(key, watcher, immediate);
  };

  /**
   * 取消数据监听
   *
   * @param {string} key
   * @param {Function} watcher
   */
  Store.prototype.unwatch = function unwatch (key, watcher) {
    this.$store.unwatch(key, watcher);
  };

  Store.prototype.nextTick = function nextTick (fn) {
    this.$store.nextTick(fn);
  };

  /**
   * 版本
   */
  var version = "0.10.0";

  /**
   * 安装插件
   */
  function install(Class) {
    Yox = Class;
  }

  exports.Store = Store;
  exports.install = install;
  exports.version = version;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=yox-store.js.map
