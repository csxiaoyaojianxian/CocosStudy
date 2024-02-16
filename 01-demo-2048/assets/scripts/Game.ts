/*
 * @Description: 游戏整体逻辑
 */
import { _decorator, Component, LabelComponent, Node, sys, UITransform, Prefab, v2, instantiate, v3, tween, NodeEventType, AudioClip, AudioSource } from 'cc';
import { Tile } from './Tile';

const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    @property(Node)
    startPanel: Node = null!; // 开始面板
    @property(Node)
    gamePanel: Node = null!; // 游戏面板
    @property(Node)
    overPanel: Node = null!; // 结算面板

    @property(LabelComponent)
    txtLv: LabelComponent = null!; // 文案等级
    @property(LabelComponent)
    txtScore: LabelComponent = null!; // 文案得分
    @property(LabelComponent)
    txtBestScore: LabelComponent = null!; // 文案最高分
    @property(LabelComponent)
    txtBack: LabelComponent = null!; // 文案返回
    
    @property(Node)
    ndParent: Node = null!; // 格子容器
    @property(UITransform)
    ndParentTransform: UITransform = null!; // 格子容器UITransform，处理宽高属性等
    @property(Prefab)
    item: Node = null!; // 格子预制体
    @property(Prefab)
    itemBg: Node = null!; // 格子背景预制体
    @property(LabelComponent)
    txtOverScore: LabelComponent = null!;

    @property(AudioClip)
    soundMove: AudioClip = null!;
    @property(AudioClip)
    soundGetScore: AudioClip = null!;

    private gameState = 0; // 游戏状态，0未开始，1游戏中，2结束
    private userData: any = null; // 用户数据，存储在 localstorage 中
    private padding: number = 0; // 格子间隔，默认5
    private itemWH: number = 0; // 格子宽高，根据 level 计算
    private itemParentWH: number = 0; // 格子容器宽高
    private array = []; // 格子数据，二维数组

    private posStart; // 移动操作相关
    private posEnd; // 移动操作相关

    start() {
        // 初始化面板状态，展示开始面板
        this.initPanel();
        this.startPanel.active = true;
        // 添加移动事件
        this.addTouch();
    }

    update(deltaTime: number) {
        
    }

    /**
     * 初始化
     */
    private init() {
        this.getUserInfo();
        this.updateView();
    }

    /**
     * 从 localStorage 中获取用户信息
     */
    private getUserInfo() {
        // localStorage 的使用
        this.userData = JSON.parse(sys.localStorage.getItem('userData'));
        if (this.userData === null) {
            this.userData = {
                level: 5,
                score: 0,
                bestScore: 0,
                array: [],
                arrHistory: [],
                backNum: 3,
            }
        }
    }
    private saveUserInfo() {
        sys.localStorage.setItem('userData', JSON.stringify(this.userData));
    }

    /**
     * 初始化更新视图，更新各种文案、添加1个初始化随机格子
     */
    private updateView() {
        this.gameState = 1; // 游戏进行中
        const level = this.userData.level;
        this.padding = 5;
        this.itemWH = Math.round(640 / level);
        this.itemParentWH = this.itemWH * level + this.padding * (level + 1);
        this.ndParentTransform.width = this.itemParentWH;
        this.ndParentTransform.height = this.itemParentWH;
        this.addItemBg(level);
        this.txtLv.string = `${level}x${level}`;
        this.txtScore.string = this.userData.score.toString();
        this.txtBestScore.string = this.userData.bestScore.toString();

        let length = this.userData.arrHistory.length - 1;
        if (length <= 0) {
            length = 0;
        }
        if (length > this.userData.backNum) {
            length = this.userData.backNum;
        }
        this.txtBack.string = `撤回(${length})`;

        if (this.userData.array.length === 0) {
            this.initArray(level);
            this.addRandomArray();
        } else {
            this.array = this.userData.array;
            for (let i = 0; i < this.array.length; i++) {
                for (let j = 0; j < this.array[i].length; j++) {
                    if (this.array[i][j] > 0) {
                        this.createItem(v2(i, j), this.array[i][j]);
                    }
                }
            }
        }

        // 初始化数据
        this.initArray(level);
        // 空格子上随机添加数字
        this.addRandomArray();
    }

    // 动态添加全部的格子背景实体
    private addItemBg(level: number) {
        const posStart = v2(-this.itemParentWH / 2 + this.itemWH / 2 + this.padding, -this.itemParentWH / 2 + this.itemWH / 2 + this.padding);
        for (let i = 0; i < level; i++) {
            for (let j = 0; j < level; j++) {
                // !!! [instantiate] 从prefab实例化出节点
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
            }
        }
    }

    // 初始化数据，全为0的二维数组
    private initArray(level: number) {
        this.array = [];
        for (let i = 0; i < level; i++) {
            this.array[i] = [];
        }
        for (let i = 0; i < level; i++) {
            for(let j = 0; j < level; j++) {
                this.array[i][j] = 0;
            }
        }
    }

    // 空格子上随机添加数字
    private addRandomArray() {
        // 获取所有空格(值为0的格子)
        let arr0 = [];
        for (let i = 0; i < this.array.length; i++) {
            for (let j = 0; j < this.array[i].length; j++) {
                if (this.array[i][j] === 0) {
                    arr0.push(v2(i, j));
                }
            }
        }
        // 随机选取一个格子添加 2 或 4
        if (arr0.length !== 0) {
            const randomIndex = Math.floor(Math.random() * arr0.length);
            const ii = arr0[randomIndex].x;
            const jj = arr0[randomIndex].y;
            this.array[ii][jj] = Math.random() < 0.2 ? 4 : 2;
            this.createItem(arr0[randomIndex], this.array[ii][jj], true);
            // 检测游戏结束
            this.onCheckOver();
        }
    }

    // 动态创建单个格子实体
    private createItem(pos, num, useAnimation = false) {
        const posStart = v2(-this.itemParentWH / 2 + this.itemWH / 2 + this.padding, -this.itemParentWH / 2 + this.itemWH / 2 + this.padding);
        const item = instantiate(this.item);

        // 通过 prefab 上绑定的脚本初始化格子信息
        const tile = item.getComponent(Tile);
        if (tile) { // 区分格子和格子背景
            // !!! 脚本调用
            tile.init(num);
        }

        item.parent = this.ndParent;
        const itemTf: UITransform = item.getComponent(UITransform);
        itemTf.width = this.itemWH;
        itemTf.height = this.itemWH;
        item.position = v3(posStart.x + (itemTf.width + this.padding) * pos.y, posStart.y + (itemTf.height + this.padding) * pos.x, 0);

        // !!! 动画的应用
        if (useAnimation) {
            // 放大动画
            item.scale = v3(0, 0, 0);
            tween(item).to(0.15, { scale: v3(1, 1, 1) }, { easing: 'sineInOut' }).start();
        }
    }
 
    /**
     * 初始化面板状态
     */
    private initPanel() {
        this.startPanel.active = false;
        this.gamePanel.active = false;
        this.overPanel.active = false;
    }

    /**
     * 移动事件
     */
    private addTouch() {
        // this.node
        this.node.on(NodeEventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(NodeEventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(NodeEventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(NodeEventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
    private onTouchStart(event) {
        if (this.gameState !== 1) {
            return;
        }
        this.posStart = event.getLocation();
    }
    private onTouchMove(event) {
        if (this.gameState !== 1) {
            return;
        }
    }
    private onTouchEnd(event) {
        if (this.gameState !== 1) {
            return;
        }

        this.posEnd = event.getLocation();
        const deltaX = this.posEnd.x - this.posStart.x;
        const deltaY = this.posEnd.y - this.posStart.y;
        // 忽略过小值
        if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
            return;
        }
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                this.moveItem('right');
            } else {
                this.moveItem('left');
            }
        } else {
            if (deltaY > 0) {
                this.moveItem('top');
            } else {
                this.moveItem('bottom');
            }
        }
    }
    private onTouchCancel(event) {
        if (this.gameState !== 1) {
            return;
        }
    }

    /**
     * 格子移动
     */
    private moveItem(direction) {
        console.log('move', direction);
        let canMove = false; // 能否移动
        let isGetScore = false; // 能否得分
        switch(direction) {
            case 'right': // 右滑
                // [列循环] 从倒数第二列向左
                for (let j = this.array.length - 2; j >= 0; j--) {
                    // [行循环] 从第一行开始向下
                    for (let i = 0; i < this.array.length; i++) {
                        // [列循环] 右侧的格子全部需要合并一遍，如 4 2 0 0 2，合并后为 0 0 0 0 8
                        for (let k = 0; k < this.array.length; k++) {
                            // this.array[i][j+k]   当前元素
                            // this.array[i][j+1+k] 当前元素右侧的元素
                            if (j+1+k < this.array.length) {
                                // 向右移动 并 更新array
                                if (this.array[i][j+k] > 0 && this.array[i][j+1+k] === 0) {
                                    this.array[i][j+1+k] = this.array[i][j+k];
                                    this.array[i][j+k] = 0; // 不会影响左侧的元素this.array[i][j+k-1]右移
                                    canMove = true;
                                }
                                // 向右合并 并 更新array
                                else if (this.array[i][j+k] > 0 && this.array[i][j+k] === this.array[i][j+1+k]) {
                                    this.array[i][j+1+k] = this.array[i][j+1+k] * 2;
                                    this.array[i][j+k] = 0;
                                    canMove = true;
                                    isGetScore = true;
                                    // 更新分数
                                    this.updateScore(this.array[i][j+1+k]);
                                }
                            }
                        }
                    }
                }
                break;
            case 'left':
                for (let j = 1; j < this.array.length; j++) {
                    for (let i = 0; i < this.array.length; i++) {
                        for (let k = 0; k < this.array.length; k++) {
                            if (j-1-k >= 0) {
                                if (this.array[i][j-k] > 0 && this.array[i][j-1-k] === 0) {
                                    this.array[i][j-1-k] = this.array[i][j-k];
                                    this.array[i][j-k] = 0;
                                    canMove = true;
                                }
                                else if (this.array[i][j-k] > 0 && this.array[i][j-k] === this.array[i][j-1-k]) {
                                    this.array[i][j-1-k] = this.array[i][j-1-k] * 2;
                                    this.array[i][j-k] = 0;
                                    canMove = true;
                                    isGetScore = true;
                                    this.updateScore(this.array[i][j-1-k]);
                                }
                            }
                        }
                    }
                }
                break;
            case 'top':
                for (let i = this.array.length - 2; i >= 0; i--) {
                    for (let j = 0; j < this.array[i].length; j++) {
                        for (let k = 0; k < this.array.length; k++) {
                            if (i+1+k < this.array.length) {
                                if (this.array[i+k][j] > 0 && this.array[i+1+k][j] === 0) {
                                    this.array[i+1+k][j] = this.array[i+k][j];
                                    this.array[i+k][j] = 0;
                                    canMove = true;
                                }
                                else if (this.array[i+k][j] > 0 && this.array[i+k][j] === this.array[i+1+k][j]) {
                                    this.array[i+1+k][j] = this.array[i+1+k][j] * 2;
                                    this.array[i+k][j] = 0;
                                    canMove = true;
                                    isGetScore = true;
                                    this.updateScore(this.array[i+1+k][j]);
                                }
                            }
                        }
                    }
                }
                break;
            case 'bottom':
                for (let i = 1; i < this.array.length; i++) {
                    for (let j = 0; j < this.array[i].length; j++) {
                        for (let k = 0; k < this.array.length; k++) {
                            if (i-1-k >= 0) {
                                if (this.array[i-k][j] > 0 && this.array[i-1-k][j] === 0) {
                                    this.array[i-1-k][j] = this.array[i-k][j];
                                    this.array[i-k][j] = 0;
                                    canMove = true;
                                }
                                else if (this.array[i-k][j] > 0 && this.array[i-k][j] === this.array[i-1-k][j]) {
                                    this.array[i-1-k][j] = this.array[i-1-k][j] * 2;
                                    this.array[i-k][j] = 0;
                                    canMove = true;
                                    isGetScore = true;
                                    this.updateScore(this.array[i-1-k][j]);
                                }
                            }
                        }
                    }
                }
                break;
            default:
                break;
        }

        if (canMove) {
            let ad: AudioSource = new AudioSource();
            if (isGetScore) {
                ad.playOneShot(this.soundGetScore);
            } else {
                ad.playOneShot(this.soundMove);
            }

            // 清理全部格子
            this.cleanAllItem();
            // 重新创建格子
            for (let i = 0; i < this.array.length; i++) {
                for (let j = 0; j < this.array[i].length; j++) {
                    if (this.array[i][j] > 0) {
                        this.createItem(v2(i, j), this.array[i][j])
                    }
                }
            }
            // 增加1个随机格子
            this.addRandomArray();
        }
    }

    // 清理全部格子
    private cleanAllItem() {
        // !!! 获取节点下的子元素
        const children = this.ndParent.children;
        for (let i = children.length - 1; i >= 0; i--) {
            let tile = children[i].getComponent(Tile);
            if (tile) { // 区分格子和格子背景
                this.ndParent.removeChild(children[i]);
            }
        }
    }
    private cleanAllItemBg() {
        // !!! 获取节点下的子元素
        const children = this.ndParent.children;
        for (let i = children.length - 1; i >= 0; i--) {
            let tile = children[i].getComponent(Tile);
            if (!tile) {
                this.ndParent.removeChild(children[i]);
            }
        }
    }

    // 更新成绩
    private updateScore(score) {
        this.userData.score += score;
        if (this.userData.scale > this.userData.bestScore) {
            this.userData.bestScore = this.userData.score;
        }
        this.txtScore.string = this.userData.score + '';
        this.txtBestScore.string = this.userData.bestScore + '';
        this.saveUserInfo();
    }

    // 判断游戏结束
    private onCheckOver() {
        let isOver = true;
        // 判断空格
        for (let i = 0; i < this.array.length; i++) {
            for (let j = 0; j < this.array[i].length; j++) {
                if (this.array[i][j] === 0) {
                    isOver = false;
                }
            }
        }
        // 判断格子是否还能合并
        for (let i = 0; i < this.array.length; i++) {
            for (let j = 0; j < this.array[i].length; j++) {
                if (j+1 < this.array.length && this.array[i][j] === this.array[i][j+1]) {
                    isOver = false;
                } else if (i+1 < this.array.length && this.array[i][j] === this.array[i+1][j]) {
                    isOver = false;
                }
            }
        }
        if (isOver) {
            this.gameState = 2;
            this.overPanel.active = true;
            const gameOverScore = this.userData.score;
            this.txtOverScore.string = `获得${gameOverScore}分`;
            this.userData.score = 0;
            this.userData.array = [];
            this.userData.arrHistory = [];
            this.userData.backNum = 3;
            this.saveUserInfo();
        } else {
            this.userData.arrHistory.push(this.array.join(','));
            this.userData.array = this.array;
            let length = this.userData.arrHistory.length;
            if (length > 10) {
                this.userData.arrHistory.shift();
            }
            if (length > this.userData.backNum) {
                length = this.userData.backNum;
            }
            this.txtBack.string = `撤回(${length})`;
            this.saveUserInfo();
        }
    }

    /**
     * 点击事件
     */
    private onBtnStartClick() {
        this.initPanel();
        this.gamePanel.active = true;
        this.init();
    }

    private onBtnReplayClick() {
        this.gameState = 1;
        this.userData.score = 0;
        this.userData.arrHistory = [];
        this.txtBack.string = '撤回(0)';
        this.userData.backNum = 3;
        this.txtScore.string = '0';
        this.cleanAllItem();
        this.initArray(this.userData.level);
        this.addRandomArray();
    }

    private onBtnBackClick() {
        let len = this.userData.arrHistory.length;
        if (len >= 2 && this.userData.backNum > 0) {
            this.userData.arrHistory.pop();
            let strArr = this.userData.arrHistory[len - 2];
            const arr = strArr.split(',');
            this.cleanAllItem();
            let kNum = -1;
            for (let i = 0; i < this.array.length; i++) {
                for (let j = 0; j < this.array[i].length; j++) {
                    kNum++;
                    this.array[i][j] = parseInt(arr[kNum]);
                    if (this.array[i][j] > 0) {
                        this.createItem(v2(i, j), this.array[i][j]);
                    }
                }
            }
            this.userData.backNum--;
            len = this.userData.arrHistory.length - 1;
            if (len <= 0) {
                len = 0;
            }
            if (len > this.userData.backNum) {
                len = this.userData.backNum;
            }
            this.txtBack.string = `撤回(${len})`;
            this.saveUserInfo();
        }
    }

    private onBtnHomeClick() {
        this.initPanel();
        this.startPanel.active = true;
        this.gameState = 0;
        this.cleanAllItem();
        this.cleanAllItemBg();
    }

    private onOverBtnReplayClick() {
        this.gameState = 1;
        this.userData.score = 0;
        this.userData.arrHistory = [];
        this.txtBack.string = '撤回(0)';
        this.userData.backNum = 3;
        this.txtScore.string = '0';
        this.cleanAllItem();
        this.initArray(this.userData.level);
        this.addRandomArray();
    }

    private onOverBtnHomeClick() {
        this.initPanel();
        this.startPanel.active = true;
        this.gameState = 0;
    }
}
