/*
 * @Author: csxiaoyaojianxian 1724338257@qq.com
 * @Date: 2024-02-19 13:25:10
 * @LastEditors: csxiaoyaojianxian 1724338257@qq.com
 * @LastEditTime: 2024-02-19 13:48:26
 * @FilePath: /02-demo-3Drunner/assets/scripts/UIManager.ts
 * @Description: UI关卡界面管理，绑定到 canvas 上
 */
import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {

    @property(Node)
    uiLevelFailure: Node;

    @property(Node)
    uiLevelSuccess: Node;

    @property(Node)
    uiLevelComplete: Node;

    start() {
        director.getScene().on('level_failed', this.onEvent_LevelFailed, this);
        director.getScene().on('level_successful', this.onEvent_LevelSuccessful, this);
    }

    update(deltaTime: number) {
        
    }

    onBtnReplay() {
        // 重新加载当前场景
        director.loadScene(director.getScene().name);
    }

    onBtnMainMenu() {
        director.loadScene('main');
    }

    onBtnNext() {
        // 加载下一个场景
        const currentScene = director.getScene().name;
        if (currentScene === 'level-001') {
            director.loadScene('level-002');
        } else if (currentScene === 'level-002') {
            director.loadScene('level-003');
        }
    }

    onEvent_LevelFailed() {
        this.uiLevelFailure.active = true;
    }

    onEvent_LevelSuccessful() {
        if (director.getScene().name === 'level-003') {
            this.uiLevelComplete.active = true; // 通关
        } else {
            this.uiLevelSuccess.active = true;
        }
    }
}

