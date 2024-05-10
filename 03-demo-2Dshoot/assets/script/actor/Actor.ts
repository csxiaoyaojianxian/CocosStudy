/*
 * @Author: csxiaoyaojianxian 1724338257@qq.com
 * @Date: 2024-02-20 21:53:43
 * @LastEditors: csxiaoyaojianxian 1724338257@qq.com
 * @LastEditTime: 2024-02-21 09:44:07
 * @FilePath: /03-demo-2Dshoot/assets/script/actor/Actor.ts
 * @Description: 
 */
import { _decorator, CircleCollider2D, Collider2D, Component, Node, RigidBody2D } from 'cc';
import { StateMachine } from '../fsm/StateMachine';

const { ccclass, property, requireComponent, disallowMultiple } = _decorator;

@ccclass('Actor')
@requireComponent(RigidBody2D)
@requireComponent(CircleCollider2D)
@disallowMultiple(true)

export class Actor extends Component {

    rigidbody: RigidBody2D | null = null;

    collider: Collider2D | null = null;

    // stateMgr: StateMachine<StateDefine> = new StateMachine();

    start() {

    }

    update(deltaTime: number) {
        
    }
}

