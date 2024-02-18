/*
 * @Author: csxiaoyaojianxian 1724338257@qq.com
 * @Date: 2024-02-18 23:24:52
 * @LastEditors: csxiaoyaojianxian 1724338257@qq.com
 * @LastEditTime: 2024-02-19 00:17:03
 * @FilePath: /02-demo-3Drunner/assets/scripts/PlayerCollision.ts
 * @Description: 碰撞监听
 */
import { _decorator, BoxCollider, Component, ICollisionEvent, ITriggerEvent, Node } from 'cc';
import { PlayerMovement } from './PlayerMovement';
const { ccclass, property } = _decorator;

@ccclass('PlayerCollision')
export class PlayerCollision extends Component {
    start() {
        const collider = this.node.getComponent(BoxCollider);
        // 障碍物碰撞监听
        collider.on('onCollisionEnter', this.onCollisionEnter, this);
        // 终点触发器监听
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    onDestroy() {
        const collider = this.node.getComponent(BoxCollider);
        collider.off('onCollisionEnter', this.onCollisionEnter, this);
        collider.off('onTriggerEnter', this.onTriggerEnter, this);
    }

    update(deltaTime: number) {}

    onCollisionEnter(event: ICollisionEvent) {
        console.log('hit');
        // 排除与地面 Ground 的持续碰撞
        if (event.otherCollider.node.name === 'Obstacle') {
            const movement = this.node.getComponent(PlayerMovement);
            movement.enabled = false;
        }
    }

    onTriggerEnter(event: ITriggerEvent) {
        console.log('you win');
        if (event.otherCollider.node.name === 'Obstacle') {
            const movement = this.node.getComponent(PlayerMovement);
            movement.enabled = false;
        }
    }
}

