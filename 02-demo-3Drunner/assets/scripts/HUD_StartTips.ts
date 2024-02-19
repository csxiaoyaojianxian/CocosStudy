/*
 * @Author: csxiaoyaojianxian 1724338257@qq.com
 * @Date: 2024-02-19 12:59:34
 * @LastEditors: csxiaoyaojianxian 1724338257@qq.com
 * @LastEditTime: 2024-02-19 13:01:20
 * @FilePath: /02-demo-3Drunner/assets/scripts/HUD_StartTips.ts
 * @Description: 
 */
import { _decorator, Component, Node } from 'cc';
import { PlayerMovement } from './PlayerMovement';
const { ccclass, property } = _decorator;

@ccclass('HUD_StartTips')
export class HUD_StartTips extends Component {

    @property(PlayerMovement)
    playerMovement: PlayerMovement;

    start() {

    }

    update(deltaTime: number) {
        
    }

    onBtnStart() {
        this.playerMovement.enabled = true;
        this.node.active = false;
    }
}

