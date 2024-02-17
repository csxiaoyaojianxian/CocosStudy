# cocos入门之方块先生3D跑酷游戏开发

> 视频教程地址: https://space.bilibili.com/649675584/channel/collectiondetail?sid=701630

## 1. 3D编辑器操作

`F`：视角切换至目标对象，或在层级管理器中双击

`OPT` + `鼠标左键`：以对象为焦点旋转查看

`鼠标右键`：第一人称视角环顾

`鼠标滚轮`：调节视距

`SPACE` + `鼠标移动`：拖拽视野

## 2. 材质

在 `assets` 下创建材质 `mat-player`，修改颜色后保存，拖动到 `Player` 的材质组件上。

> 一个元素可以有多个材质，网格上可以划分不同的材质

## 3. 光照与阴影

场景可以修改环境光，将方向光的颜色修改为 #FFF4D6

开启阴影需要三步，首先设置场景的 Shadows 组件为启用，设置阴影类型为质量更好的 ShadowMap

光源默认不产生阴影，需要启用光源的 Dynamic Shadow Settings，设置 Shadow Pcf 为 SOFT_2X

物体默认不产生阴影，需要开启物体的投射阴影选项

## 4. 摄像机与游戏视角跟随

> 推荐用编辑器预览模式，以沙盒方式调整摄像机参数

视角跟随，若将 `Main Camera` 拖到 `Player` 对象下，Player的旋转等属性也会影响相机视角，不合适。

可以通过，添加脚本 FllowTarget，添加到 Main Camera 上，更新相机位置为 Player 位置

```typescript
tempPos = new Vec3();
update(deltaTime: number) {
    // 因为绑定的组件为摄像机，因此 this.node 即摄像机
    // this.node.position = this.target.position; // 需要添加偏移量，让摄像机在物体后上方
    this.target.getPosition(this.tempPos);
    this.tempPos.add(this.offset);
    this.node.position = this.tempPos;
}
```

## 5. 物理组件

### 5.1 刚体/碰撞体

**物理能力=刚体+碰撞体**

刚体有三类：

**Dynamic**：动力学刚体，用于具备完整物理能力的对象，如汽车，滚动的石头等

**Static**：静态刚体，用于不会移动的对象，如地面、山体、大型建筑等，在引擎物理系统中，静态刚体只和动力学刚体产生碰撞

**KineMatic**：运动学刚体，移动的静态刚体，自身没有受力反馈，运动学刚体和静态刚体不会产生碰撞

|           | 能否移动 | 是否有受力反馈 |
| --------- | -------- | -------------- |
| Dynamic   | 能       | 有             |
| Static    | 不能     | 没有           |
| KineMatic | 能       | 没有           |

案例中，为物体添加 `RigidBody` 刚体组件，添加 `Physics/BoxCollider` 碰撞体组件

为地面添加碰撞体组件 `BoxCollider`，不需要添加刚体，当对象只有碰撞体没有刚体时，引擎会自动添加默认的静态刚体组件

### 5.2 物理材质

> **3D对象：**
>
> Mesh=形状
>
> 材质=颜色/质感/阴影
>
> **物理对象：**
>
> Collider=形状
>
> 物理材质=物理参数

资源管理器中创建物理材质并拖动到对象的Collider碰撞体组件的物理材质参数上。

## 6. 脚本组件

**内置钩子**

`start()`

`update(deltaTime: number)` 在每帧调用，随时间的增量都建议与 deltaTime 挂钩，如持续施加一个力

`onDestroy()`

...



