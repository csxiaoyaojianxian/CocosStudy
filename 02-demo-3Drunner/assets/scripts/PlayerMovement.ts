/*
 * @Author: csxiaoyaojianxian 1724338257@qq.com
 * @Date: 2024-02-17 23:41:54
 * @LastEditors: csxiaoyaojianxian 1724338257@qq.com
 * @LastEditTime: 2024-02-19 13:31:32
 * @FilePath: /02-demo-3Drunner/assets/scripts/PlayerMovement.ts
 * @Description: 持续施加前进力，并监听键盘操作施加左右力
 */
import { _decorator, Component, director, EventKeyboard, Input, input, KeyCode, Node, RigidBody, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerMovement')
export class PlayerMovement extends Component {
    @property(RigidBody)
    rigidBody: RigidBody;

    @property
    forwardForce: number = 0;

    @property
    sideForce: number = 0;

    // 按键是否按下
    isLeftDown = false;
    isRightDown = false;

    start() {
        // !!!键盘控制监听
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    update(deltaTime: number) {
        // !!!持续施加一个力
        const force = new Vec3(0, 0, -this.forwardForce * deltaTime);
        this.rigidBody.applyForce(force);

        if (this.isLeftDown) {
            const leftForce = new Vec3(-this.sideForce * deltaTime, 0, 0);
            this.rigidBody.applyForce(leftForce);
        }
        
        if (this.isRightDown) {
            const rightForce = new Vec3(this.sideForce * deltaTime, 0, 0);
            this.rigidBody.applyForce(rightForce);
        }

        // 从侧面掉下去了
        if (this.node.position.y < -10) {
            console.log('you lose');
            this.enabled = false;

            director.getScene().emit('level_failed');
        }
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: EventKeyboard) {
        console.log('onKeyDown');
        if (event.keyCode === KeyCode.KEY_A) {
            this.isLeftDown = true;
            console.log('key down A');
        }
        if (event.keyCode === KeyCode.KEY_D) {
            this.isRightDown = true;
            console.log('key down D');
        }
    }

    onKeyUp(event: EventKeyboard) {
        console.log('onKeyUp');
        if (event.keyCode === KeyCode.KEY_A) {
            this.isLeftDown = false;
            console.log('key up A');
        }
        if (event.keyCode === KeyCode.KEY_D) {
            this.isRightDown = false;
            console.log('key up D');
        }
    }
}

