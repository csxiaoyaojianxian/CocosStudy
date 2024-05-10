/*
 * @Author: csxiaoyaojianxian 1724338257@qq.com
 * @Date: 2024-02-20 21:32:23
 * @LastEditors: csxiaoyaojianxian 1724338257@qq.com
 * @LastEditTime: 2024-02-20 21:51:24
 * @FilePath: /03-demo-2Dshoot/assets/script/fsm/State.ts
 * @Description: 01-状态机
 */

// 状态
export interface IState<TKey> {
    id: TKey;
    onEnter(): void;
    onExit(): void;
    update(deltaTime: number): void;
    onDestory(): void;
    // 状态转移判断
    canTransit(to: TKey): boolean;
}

export interface ITransitable<TKey> {
    transiteTo(name: TKey);
}


/**
 * 状态机，class见 StateMachine.ts
 */
export interface IMachine<TKey> {
    // 添加状态
    add(state: IState<TKey>);
    // 删除状态
    remove(name: TKey);
    // 更新状态
    update(dt: number);
}


/**
 * 子状态机，本案例实际未用到
 * 既是状态又是状态机
 */
export class SubMachine<TKey> implements IMachine<TKey>, IState<TKey>, ITransitable<TKey> {
    id: TKey;
    states: Map<TKey, IState<TKey>> = new Map(); // 存储状态
    currState: IState<TKey>; // 当前状态
    defaultState: TKey;

    add(state: IState<TKey>) {
        this.states.set(state.id, state); // map操作
    }

    remove(name: TKey) {
        this.states.delete(name); // map操作
    }

    // 状态转移
    transiteTo(name: TKey) {
        if (this.currState && !this.currState.canTransit(name)) {
            return;
        }
        this.currState?.onExit();
        this.currState = this.states.get(name); // map操作
        this.currState?.onEnter();
    }

    update(dt: number) {
        this.currState?.update(dt);
    }

    onEnter(): void {
        if (this.defaultState) {
            this.transiteTo(this.defaultState);
        }
    }

    onExit(): void {
        this.currState?.onExit();
    }

    onDestory(): void {
        this.currState = null;
        this.states.clear();
    }

    canTransit(to: TKey): boolean {
        return this.currState?.canTransit(to);
    }
}