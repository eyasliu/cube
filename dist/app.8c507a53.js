// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({6:[function(require,module,exports) {
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(function () {
  var $top = $('.top');
  var $area = $('.area');
  var $preview = $('.preview');
  var tpl = {
    area: $('#area-tpl').html()
  };
  var template = _.template;

  // 游戏区

  var Area = function () {
    function Area() {
      _classCallCheck(this, Area);

      this.width = 10;
      this.height = 15;
      this.active = [];
      this.temp = [];
    }
    // 获取当前游戏区矩阵


    _createClass(Area, [{
      key: 'matrix',
      value: function matrix() {
        var arr = [];
        for (var y = 1; y <= this.height; y++) {
          var row = [];
          arr.push(row);
          for (var x = 1; x <= this.width; x++) {
            var axis = x + ',' + y;
            row.push([].concat(_toConsumableArray(this.active), _toConsumableArray(this.temp)).includes(axis) ? 1 : 0);
          }
        }
        return arr;
      }
      // 根据矩阵渲染

    }, {
      key: 'render',
      value: function render() {
        var data = this.matrix();
        console.log(data);
        var html = template(tpl.area)({ data: data });
        $area.html(html);
      }
    }]);

    return Area;
  }();

  var Block = function () {
    function Block() {
      _classCallCheck(this, Block);

      // 方块类型
      this.types = [
      // 口口
      // 口口
      [0x6600],
      // 口口口口
      [0x2222, 0xf00],
      // 口口
      //   口口
      [0xc600, 0x2640],
      //   口口
      // 口口
      [0x6c00, 0x4620],
      //     口
      // 口口口
      [0x4460, 0x2e0, 0x6220, 0x740],
      // 口
      // 口口口
      [0x2260, 0xe20, 0x6440, 0x4700],
      //   口
      // 口口口
      [0x2620, 0x720, 0x2320, 0x2700]];
      // 当前是什么类型
      this.type = this.types[this.getRandom(this.types.length - 1)];
      // 当前的旋转状态
      this.status = this.getRandom(this.type.length);
    }

    _createClass(Block, [{
      key: 'getRandom',
      value: function getRandom(max) {
        return ~~(Math.random() * 100) % max;
      }
    }, {
      key: 'getType',
      value: function getType() {
        return this.type[this.status];
      }
      // 旋转

    }, {
      key: 'transform',
      value: function transform() {
        this.status++;
        if (this.status >= this.type.length) {
          this.status = 0;
        }
      }
      // 获取当前方块的二进制数组

    }, {
      key: 'toBinner',
      value: function toBinner() {
        var type = this.getType();
        // const status = this.status
        var bin = type.toString(2);
        var space = 16 - bin.length;
        bin = new Array(space).fill(0).join('') + bin;
        var arr = bin.match(/.{4}/g);
        arr = arr.map(function (i) {
          return [].concat(_toConsumableArray(i)).map(function (i) {
            return ~~i;
          });
        });
        return arr;
      }
    }]);

    return Block;
  }();
  // 游戏控制


  var Game = function () {
    function Game(area) {
      _classCallCheck(this, Game);

      this.area = area;
      area.render();
      this.timer = null;
      this.currentBlock = null;
      this.defaultPos = {
        y: 0,
        x: 4
      };
      this.pos = Object.assign({}, this.defaultPos);
      this.nextBlock = new Block();
    }
    // 转换


    _createClass(Game, [{
      key: 'transform',
      value: function transform() {
        var oldStatus = this.currentBlock.status;
        this.currentBlock.transform();
        var arr = _.uniq(this.getRunAxis(this.currentBlock).map(function (axis) {
          return axis.split(',')[0];
        }).toString().split(',').map(Math.floor));
        var min = _.min(arr);
        var max = _.max(arr);
        if (min <= 0) {
          this.pos.x = Math.abs(1 - min);
        } else if (max > this.area.width) {
          this.pos.x = this.area.width - ~~(arr.length / 2 + 1) - 1;
        }
        this.render();
      }
      // 往下落

    }, {
      key: 'down',
      value: function down() {
        this.pos.y++;
        this.render();
      }
      // 左移

    }, {
      key: 'left',
      value: function left() {
        this.pos.x--;
        var arr = this.getRunAxis(this.currentBlock).map(function (axis) {
          return axis.split(',')[0];
        }).toString().split(',');
        var valid = arr.every(function (i) {
          return i >= 1;
        });
        if (valid) {
          this.render();
        } else {
          this.pos.x++;
        }
      }
      // 右移

    }, {
      key: 'right',
      value: function right() {
        var _this = this;

        this.pos.x++;
        var arr = this.getRunAxis(this.currentBlock).map(function (axis) {
          return axis.split(',')[0];
        }).toString().split(',');
        var valid = arr.every(function (i) {
          return i <= _this.area.width;
        });
        if (valid) {
          this.render();
        } else {
          this.pos.x--;
        }
      }
      // 使用新的区块开始下落

    }, {
      key: 'addBlock',
      value: function addBlock() {
        this.currentBlock = this.nextBlock;
        this.nextBlock = new Block();
        // this.render()
        this.intevalDown();
      }
      // 自动下落

    }, {
      key: 'intevalDown',
      value: function intevalDown() {
        var _this2 = this;

        this.downTimer = setInterval(function () {
          _this2.render();
          _this2.down();
        }, 1000);
      }
      // 停止自动下落，相当于暂停游戏

    }, {
      key: 'stopDown',
      value: function stopDown() {
        this.downTimer && clearInterval(this.downTimer);
      }
    }, {
      key: 'runBlock',
      value: function runBlock() {}
    }, {
      key: 'checkFull',
      value: function checkFull() {
        var _this3 = this;

        var matrix = this.area.matrix();
        var fullRow = [];
        var matrixData = matrix.filter(function (row, index) {
          var isFull = row.every(function (i) {
            return i;
          });
          if (isFull) {
            fullRow.push(index + 1);
            return false;
          }
          return true;
        });

        if (!fullRow.length) {
          return false;
        }

        fullRow.forEach(function (i) {
          matrixData.unshift(new Array(_this3.area.width).fill(0));
        });

        var active = [];
        matrixData.forEach(function (rowArr, h) {
          var y = h + 1;
          rowArr.forEach(function (val, v) {
            if (val) {
              var x = v + 1;
              active.push([x, y].join(','));
            }
          });
        });

        // let active = this.area.active
        // const maxFullRow = _.max(fullRow)
        // active = active.map(axis => {
        //   let [x, y] = axis.split(',')
        //   if(fullRow.includes(~~y)) {
        //     return false
        //   }
        //   if(y < maxFullRow) {
        //     y = +y + fullRow.length
        //     return [x,y].join(',')
        //   } else {
        //     return axis
        //   }
        // }).filter(i => i)

        this.area.active = active;
        this.area.render();
      }
      // 当方块下落到底部了，判断碰撞

    }, {
      key: 'blockEnd',
      value: function blockEnd() {

        this.stopDown();
        this.area.active = this.area.active.concat(this.area.temp);
        this.area.temp = [];

        // 消除
        this.checkFull();

        // this.render()
        if (this.pos.y > 1) {
          this.addBlock();
        } else {
          this.gameOver();
        }
        this.pos = Object.assign({}, this.defaultPos);
      }
      // 开始游戏

    }, {
      key: 'start',
      value: function start() {
        this.addBlock();
      }
      // 暂停游戏

    }, {
      key: 'pause',
      value: function pause() {
        this.stopDown();
      }
      // 游戏结束

    }, {
      key: 'gameOver',
      value: function gameOver() {
        this.pos = Object.assign({}, this.defaultPos);
        this.stopDown();
        alert('游戏结束');
        this.area.active = [];
        this.start();
      }
      // 获取运动中的坐标

    }, {
      key: 'getRunAxis',
      value: function getRunAxis(block) {
        var _this4 = this;

        var active = area.active;
        var bin = block.toBinner();
        var binFilter = bin.filter(function (row) {
          return !row.every(function (i) {
            return !i;
          });
        });
        if (this.pos.y <= binFilter.length) {
          binFilter = binFilter.slice(binFilter.length - this.pos.y, binFilter.length);
        }

        var isEnd = false;
        var runningAxis = [];

        binFilter.forEach(function (harr, h) {
          var y = h;
          harr.forEach(function (val, v) {
            var x = v;
            if (val) {
              var axis = [_this4.pos.x + x, _this4.pos.y <= binFilter.length ? y + 1 : _this4.pos.y + y - binFilter.length + 1];
              var axisStr = axis.join(',');
              if (active.includes(axisStr) || axis[1] > area.height) {
                // 已碰撞
                isEnd = true;
              } else {
                runningAxis.push(axisStr);
              }
            }
          });
        });
        if (isEnd) {
          return false;
        } else {
          return runningAxis;
        }
      }
      // 渲染预览下一个区块

    }, {
      key: 'renderPrevBlock',
      value: function renderPrevBlock() {
        var blockBin = this.nextBlock.toBinner();
        var html = template(tpl.area)({ data: blockBin });
        $preview.html(html);
      }
      // 处理矩阵并渲染游戏区

    }, {
      key: 'render',
      value: function render() {
        var runningAxis = this.getRunAxis(this.currentBlock);

        if (!runningAxis) {
          this.blockEnd();
          // if(this.pos.y < 0) {
          //   this.gameOver()
          // }
        } else {
          this.area.temp = runningAxis;
          this.area.render();
        }

        this.area.render();
        this.renderPrevBlock();
      }
    }]);

    return Game;
  }();

  var area = new Area();
  var game = new Game(area);

  game.start();

  document.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
      case 38:
        game.transform();break;
      case 40:
        game.down();break;
      case 37:
        game.left();break;
      case 39:
        game.right();break;
    }
  });
  document.getElementById('btn-start', function (e) {});

  document.getElementById('btn-pause', function (e) {
    game.stopDown();
  });

  // const genBlock
});
},{}],15:[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '52264' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[15,6], null)
//# sourceMappingURL=/app.8c507a53.map