import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FllowTarget')
export class FllowTarget extends Component {

    @property(Node)
    target: Node;

    @property(Vec3)
    offset: Vec3 = new Vec3();


    start() {

    }

    tempPos = new Vec3();
    update(deltaTime: number) {
        // this.node 即摄像机
        // this.node.position = this.target.position; // 需要添加偏移量
        this.target.getPosition(this.tempPos);
        this.tempPos.add(this.offset);
        this.node.position = this.tempPos;
    }
}

