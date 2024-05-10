/*
 * @Author: csxiaoyaojianxian 1724338257@qq.com
 * @Date: 2024-02-20 21:40:02
 * @LastEditors: csxiaoyaojianxian 1724338257@qq.com
 * @LastEditTime: 2024-02-20 21:50:26
 * @FilePath: /03-demo-2Dshoot/assets/script/fsm/StateMachine.ts
 * @Description: 02-状态机
 */
import { IState, SubMachine } from './State';

export class StateMachine<TKey> {

    mainMachine: SubMachine<TKey> = new SubMachine();

    get currState(): IState<TKey> {
        return this.mainMachine.currState;
    }

    startWith(name: TKey) {
        this.mainMachine.defaultState = name;
        this.mainMachine.transiteTo(name);
    }

    registState(state: IState<TKey>) {
        this.mainMachine.add(state);
    }

    deregistState(name: TKey) {
        this.mainMachine.remove(name);
    }

    transit(name: TKey) {
        this.mainMachine.transiteTo(name);
    }

    update(dt: number) {
        this.mainMachine.update(dt);
    }

}

