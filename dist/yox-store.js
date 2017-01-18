(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.YoxStore = factory());
}(this, (function () { 'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Yox = typeof require === 'function' ? require('yox') : window.Yox;

var Store = function () {
  function Store(shares) {
    classCallCheck(this, Store);

    this.$store = new Yox({});
    this.$locked = {};
    if (shares) {
      this.register(shares);
    }
  }

  createClass(Store, [{
    key: 'register',
    value: function register(shares) {
      var instance = this;
      Yox.array.each(shares, function (type) {
        instance[type] = function () {
          var args = arguments;
          var key = type + '.' + args[0];
          if (args.length === 1 && Yox.is.string(args[0])) {
            return instance.get(key, args[1]);
          }
          instance.set(key, args[1], args[2]);
        };
      });
    }
  }, {
    key: 'read',
    value: function read(key, callback) {}
  }, {
    key: 'write',
    value: function write(key, value) {}
  }, {
    key: 'get',
    value: function get$$1(key, readFromStorage, callback) {
      var value = this.$store.get(key);
      if (readFromStorage) {
        return value === undefined ? this.read(key, callback) : Yox.nextTick(function () {
          callback(value);
        });
      }
      return value;
    }
  }, {
    key: 'set',
    value: function set$$1(key, value, writeToStorage) {
      this.$store.set(key, value);
      if (writeToStorage) {
        this.write(key, value);
      }
    }
  }, {
    key: 'extend',
    value: function extend(key, value) {
      if (Yox.is.object(value)) {
        var oldValue = this.get(key);
        if (Yox.is.object(oldValue)) {
          Yox.object.extend(oldValue, value);
          value = oldValue;
        }
        this.set(key, value);
      }
    }
  }, {
    key: 'trying',
    value: function trying(key, value, promise) {

      var instance = this;
      var oldValue = instance.get(key);
      instance.set(key, value);
      instance.lock(key);

      return function () {
        instance.unlock(key);
        instance.set(key, oldValue);
      };
    }
  }, {
    key: 'locked',
    value: function locked(key) {
      return this.$locked[key];
    }
  }, {
    key: 'lock',
    value: function lock(key) {
      this.$locked[key] = true;
    }
  }, {
    key: 'unlock',
    value: function unlock(key) {
      var $locked = this.$locked;

      if ($locked[key]) {
        delete $locked[key];
      }
    }
  }, {
    key: 'watch',
    value: function watch(key, listener) {
      this.$store.watch(key, listener);
    }
  }, {
    key: 'unwatch',
    value: function unwatch(key, listener) {
      this.$store.unwatch(key, listener);
    }
  }]);
  return Store;
}();

return Store;

})));
