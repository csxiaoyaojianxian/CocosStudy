/*
 * @Author: csxiaoyaojianxian 1724338257@qq.com
 * @Date: 2024-02-19 13:15:39
 * @LastEditors: csxiaoyaojianxian 1724338257@qq.com
 * @LastEditTime: 2024-02-19 13:50:08
 * @FilePath: /02-demo-3Drunner/assets/scripts/MainMenu.ts
 * @Description: 主菜单处理，如开始游戏按钮，绑定到 Canvas
 */
import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainMenu')
export class MainMenu extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    onBtnPlay() {
        director.loadScene('level-001');
    }
}

