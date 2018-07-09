$(() => {
  const $top = $('.top')
  const $area = $('.area')
  const $preview = $('.preview')
  const tpl = {
    area: $('#area-tpl').html()
  }
  const template = _.template

  // 游戏区
  class Area {
    constructor() {
      this.width = 10
      this.height = 15
      this.active = []
      this.temp = []
    }
    // 获取当前游戏区矩阵
    matrix() {
      const arr = []
      for(let y = 1; y <= this.height; y++) {
        const row = []
        arr.push(row)
        for(let x = 1; x <= this.width; x++) {
          const axis = x+','+y
          row.push([...this.active, ...this.temp].includes(axis) ? 1 : 0)
        }
      }
      return arr
    }
    // 根据矩阵渲染
    render() {
      const data = this.matrix()
      console.log(data)
      const html = template(tpl.area)({data: data})
      $area.html(html)
    }
  }

  class Block {
    constructor() {
      // 方块类型
      this.types = [
        // 口口
        // 口口
        [0x6600], 
        // 口口口口
        [0x2222,0xf00],
        // 口口
        //   口口
        [0xc600,0x2640],
        //   口口
        // 口口
        [0x6c00,0x4620],
        //     口
        // 口口口
        [0x4460,0x2e0,0x6220,0x740],
        // 口
        // 口口口
        [0x2260,0xe20,0x6440,0x4700],
        //   口
        // 口口口
        [0x2620,0x720,0x2320,0x2700],
      ]
      // 当前是什么类型
      this.type = this.types[this.getRandom(this.types.length - 1)]
      // 当前的旋转状态
      this.status = this.getRandom(this.type.length)
    }
    getRandom(max) {
      return (~~(Math.random() * 100) % max)
    }
    getType() {
      return this.type[this.status]
    }
    // 旋转
    transform() {
      this.status++
      if(this.status >= this.type.length) {
        this.status = 0
      }
    }
    // 获取当前方块的二进制数组
    toBinner() {
      const type = this.getType()
      // const status = this.status
      let bin = type.toString(2)
      let space = 16 - bin.length
      bin = new Array(space).fill(0).join('') + bin
      let arr = bin.match(/.{4}/g)
      arr = arr.map(i => [...i].map(i => ~~i))
      return arr
    }
  }
  // 游戏控制
  class Game {
    constructor(area) {
      this.area = area
      area.render()
      this.timer = null
      this.currentBlock = null
      this.defaultPos = {
        y: 0,
        x: 4,
      }
      this.pos = Object.assign({}, this.defaultPos)
      this.nextBlock = new Block()
    }
    // 转换
    transform() {
      const oldStatus = this.currentBlock.status
      this.currentBlock.transform()
      const arr = _.uniq(this.getRunAxis(this.currentBlock).map(axis => axis.split(',')[0]).toString().split(',').map(Math.floor))
      const min = _.min(arr)
      const max = _.max(arr)
      if(min <= 0) {
        this.pos.x = Math.abs(1 - min)
      } else if(max > this.area.width) {
        this.pos.x = this.area.width - ~~(arr.length / 2 + 1) - 1
      }
      this.render()
    }
    // 往下落
    down() {
      this.pos.y++
      this.render()
    }
    // 左移
    left() {
      this.pos.x--
      const arr = this.getRunAxis(this.currentBlock).map(axis => axis.split(',')[0]).toString().split(',')
      const valid = arr.every(i => i >= 1)
      if(valid) {
        this.render()
      }else {
        this.pos.x++
      }
    }
    // 右移
    right() {
      this.pos.x++
      const arr = this.getRunAxis(this.currentBlock).map(axis => axis.split(',')[0]).toString().split(',')
      const valid = arr.every(i => i <= this.area.width)
      if(valid) {
        this.render()
      } else {
        this.pos.x--
      }
    }
    // 使用新的区块开始下落
    addBlock() {
      this.currentBlock = this.nextBlock
      this.nextBlock = new Block()
      // this.render()
      this.intevalDown()
    }
    // 自动下落
    intevalDown() {
      this.downTimer = setInterval(() => {
        this.render()
        this.down()
      }, 1000)
    }
    // 停止自动下落，相当于暂停游戏
    stopDown() {
      this.downTimer && clearInterval(this.downTimer)
    }
    runBlock() {
      
    }
    checkFull() {
      const matrix = this.area.matrix()
      const fullRow = []
      const matrixData = matrix.filter((row, index) => {
        const isFull = row.every(i => i)
        if(isFull) {
          fullRow.push(index + 1)
          return false
        }
        return true
      })

      if(!fullRow.length) {
        return false
      }

      fullRow.forEach(i => {
        matrixData.unshift(new Array(this.area.width).fill(0))
      })

      let active = []
      matrixData.forEach((rowArr, h) => {
        const y = h + 1
        rowArr.forEach((val, v) => {
          if(val) {
            const x = v + 1
            active.push([x, y].join(','))
          }
        })
      })


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

      this.area.active = active
      this.area.render()

    }
    // 当方块下落到底部了，判断碰撞
    blockEnd() {
      
      this.stopDown()
      this.area.active = this.area.active.concat(this.area.temp)
      this.area.temp = []

      // 消除
      this.checkFull()
      

      // this.render()
      if(this.pos.y > 1) {
        this.addBlock()
      } else {
        this.gameOver()
      }
      this.pos = Object.assign({}, this.defaultPos)
    }
    // 开始游戏
    start() {
      this.addBlock()
    }
    // 暂停游戏
    pause() {
      this.stopDown()
    }
    // 游戏结束
    gameOver() {
      this.pos = Object.assign({}, this.defaultPos)
      this.stopDown()
      alert('游戏结束')
      this.area.active = []
      this.start()
    }
    // 获取运动中的坐标
    getRunAxis(block) {
      const active = area.active
      const bin = block.toBinner()
      let binFilter = bin.filter(row => !row.every(i => !i))
      if(this.pos.y <= binFilter.length) {
        binFilter = binFilter.slice(binFilter.length - this.pos.y, binFilter.length)
      }

      let isEnd = false
      const runningAxis = []

      binFilter.forEach((harr, h) => {
        const y = h
        harr.forEach((val, v) => {
          const x = v
          if(val) {
            const axis = [
              this.pos.x + x,
              this.pos.y <= binFilter.length ? y + 1 : this.pos.y + y - binFilter.length + 1
            ]
            const axisStr = axis.join(',')
            if(active.includes(axisStr) || axis[1] > area.height) {
              // 已碰撞
              isEnd = true
            } else {
              runningAxis.push(axisStr)
            }
          }
        })
      })
      if(isEnd) {
        return false
      } else {
        return runningAxis
      }

    }
    // 渲染预览下一个区块
    renderPrevBlock() {
      const blockBin = this.nextBlock.toBinner()
      const html = template(tpl.area)({data: blockBin})
      $preview.html(html)
    }
    // 处理矩阵并渲染游戏区
    render() {
      const runningAxis = this.getRunAxis(this.currentBlock)

      if(!runningAxis) {
        this.blockEnd()
        // if(this.pos.y < 0) {
        //   this.gameOver()
        // }
      } else {
        this.area.temp = runningAxis
        this.area.render()
      }
      
      this.area.render()
      this.renderPrevBlock()

    }
  }

  const area = new Area()
  const game = new Game(area)

  game.start()

  document.addEventListener('keydown', e => {
    switch(e.keyCode) {
      case 38: game.transform();break;
      case 40: game.down();break;
      case 37: game.left();break;
      case 39: game.right();break;
    }
  })
  document.getElementById('btn-start', e => {

  })

  document.getElementById('btn-pause', e => {
    game.stopDown()
  })

  // const genBlock
})