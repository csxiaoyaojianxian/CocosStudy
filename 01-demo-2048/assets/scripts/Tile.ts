/*
 * @Description: 用于动态初始化预制体格子的数据和样式
 */
import { _decorator, Color, Component, LabelComponent, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tile')
export class Tile extends Component {
    @property(Sprite)
    bg: Sprite = null!;
    @property(LabelComponent)
    txtNum: LabelComponent = null!;

    public init(num: number) {
        this.txtNum.string = num.toString();
        this.setColor(num);
    }

    private setColor(num: number) {
        switch(num) {
            case Math.pow(2, 1):
                this.bg.color = new Color(238, 228, 218);
                break;
            case Math.pow(2, 2):
                this.bg.color = new Color(237, 224, 200);
                break;
            case Math.pow(2, 3):
                this.bg.color = new Color(242, 177, 121);
                break;
            case Math.pow(2, 4):
                this.bg.color = new Color(245, 149, 99);
                break;
            case Math.pow(2, 5):
                this.bg.color = new Color(246, 124, 95);
                break;
            case Math.pow(2, 6):
                this.bg.color = new Color(246, 94, 59);
                break;
            case Math.pow(2, 7):
                this.bg.color = new Color(237, 206, 115);
                break;
            case Math.pow(2, 8):
                this.bg.color = new Color(236, 201, 97);
                break;
            case Math.pow(2, 9):
                this.bg.color = new Color(238, 199, 80);
                break;
            case Math.pow(2, 10):
                this.bg.color = new Color(239, 196, 65);
                break;
            case Math.pow(2, 11):
                this.bg.color = new Color(239, 193, 46);
                break;
            case Math.pow(2, 12):
                this.bg.color = new Color(255, 60, 61);
                break;
            case Math.pow(2, 13):
                this.bg.color = new Color(255, 30, 32);
                break;
            default:
                this.bg.color = new Color(255, 30, 32);
                break;
        }
    }
}

