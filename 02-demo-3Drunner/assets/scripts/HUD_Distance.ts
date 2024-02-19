/*
 * @Author: csxiaoyaojianxian 1724338257@qq.com
 * @Date: 2024-02-19 12:48:55
 * @LastEditors: csxiaoyaojianxian 1724338257@qq.com
 * @LastEditTime: 2024-02-19 12:54:17
 * @FilePath: /02-demo-3Drunner/assets/scripts/HUD_Distance.ts
 * @Description: 2D 文本展示距离数值
 */
import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HUD_Distance')
export class HUD_Distance extends Component {

    @property(Node)
    player: Node;

    content: Label;

    start() {
        // getComponent 耗费性能，缓存起来
        this.content = this.node.getComponent(Label);
    }

    update(deltaTime: number) {
        this.content.string = (-this.player.position.z).toFixed(1).toString();
    }
}

