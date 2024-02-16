# cocos入门之2048小游戏

> 视频教程地址: https://www.sikiedu.com/my/course/1731

## 1. UI制作

### 1.1 面板和基础UI创建

场景 `game` 结构如下：

```
- game // 场景
  |-- Canvas // 画布，绑定 Game.ts
      |-- Camera
      |-- bg // 整体背景，640x1136
      |-- startPanel
          |-- ...
      |-- gamePanel
          |-- top1
              |-- ...
          |-- ...
          |-- nodeParent // 格子容器，在脚本中用 prefab 填充
      |-- overPanel
          |-- mask
          |-- ...
```

背景色/纯色块/mask/line等，添加 `SpriteSplash` 2D组件

按钮，添加 `Button` UI组件

### 1.2 prefab预制体创建

场景下创建 `Item` 和 `ItemBg`，拖入 `/assets/prefab/` 下后删除，资源管理器文件结构如下：

```
- assets
  |-- prefab
      |-- Item // 格子主体，绑定 Tile.ts
      |-- ItemBg // 格子背景
  |-- scene
      |-- game
  |-- scripts
      |-- Game
      |-- Tile
  |-- sound
      |-- merge
      |-- move
- internal
```



## 2. 脚本编辑

### 2.1 脚本绑定

创建两个脚本 `Game.ts` 和 `Tile.ts`，分别绑定到 `Canvas` 和预制体 `Item` 上。

`Game.ts` 用于处理游戏逻辑

`Tile.ts` 用于动态初始化预制体格子的数据和样式

脚本类的基本结构如下：

```typescript
import { _decorator, Component, LabelComponent, Node, sys, UITransform, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('Game')
export class Game extends Component {
    @property(Node)
    ndParent: Node = null!; // 使用装饰器后参数将展示在编辑器面板中
    start() {
        // 初始化执行
    }
    update(deltaTime: number) {
        // 更新
    }
}
```

**按钮** 可以绑定点击事件，事件中可以选择指定组件绑定的脚本中的方法，如调用 `Canvas` 上绑定的 `Game` 脚本中的 `onBtnStartClick` 方法。



### 2.2 移动事件处理

```typescript
this.node.on(NodeEventType.TOUCH_START, this.onTouchStart, this);
this.node.on(NodeEventType.TOUCH_MOVE, this.onTouchMove, this);
this.node.on(NodeEventType.TOUCH_END, this.onTouchEnd, this);
this.node.on(NodeEventType.TOUCH_CANCEL, this.onTouchCancel, this);
```



### 2.3 其他

```typescript
// [1] 面板激活
this.startPanel.active = true;

// [2] 从prefab实例化出节点
const itemBg = instantiate(this.itemBg);
// 设置父节点
itemBg.parent = this.ndParent;
// 取出UITransform组件调整尺寸位置信息
const itemBgTf:UITransform = itemBg.getComponent(UITransform);
itemBgTf.width = this.itemWH;
itemBgTf.height = this.itemWH;
const posX = posStart.x + (itemBgTf.width + this.padding) * j;
const posY = posStart.y + (itemBgTf.height + this.padding) * i;
itemBg.position = v3(posX, posY, 0);

// [3] 获取节点下的子元素
private cleanAllItem() {
    // 清理全部格子
    const children = this.ndParent.children;
    for (let i = children.length - 1; i >= 0; i--) {
        let tile = children[i].getComponent(Tile);
        if (tile) { // 区分格子和格子背景
            this.ndParent.removeChild(children[i]);
        }
    }
}

// [4] 脚本调用
// 通过 prefab 上绑定的脚本初始化格子信息
const tile = item.getComponent(Tile);
if (tile) { // 区分格子和格子背景
    // !!! 脚本调用
    tile.init(num);
}

// [5] sys 的使用
this.userData = JSON.parse(sys.localStorage.getItem('userData'));

// [6] 动画
item.scale = v3(0, 0, 0);
tween(item).to(0.15, { scale: v3(1, 1, 1) }, { easing: 'sineInOut' }).start();
```

