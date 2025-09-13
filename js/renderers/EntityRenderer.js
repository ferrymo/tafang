// 实体渲染器 - 用Canvas原生绘制精致的炮塔和敌人
export class EntityRenderer {
    constructor() {
        this.animationTime = 0;
    }
    
    update() {
        this.animationTime += 0.02; // 减慢动画速度，从0.05改为0.02
    }
    
    /**
     * 绘制炮塔
     */
    drawTower(ctx, tower, theme, isSelected = false) {
        ctx.save();
        
        // 选中状态的光环
        if (isSelected) {
            this.drawSelectionRing(ctx, tower.x, tower.y, tower.size + 8);
        }
        
        // 开火时的效果
        if (tower.isShooting) {
            this.drawMuzzleFlash(ctx, tower, theme);
        }
        
        // 根据主题绘制炮塔
        switch (theme) {
            case 'orc':
                this.drawOrcTower(ctx, tower);
                break;
            case 'mech':
                this.drawMechTower(ctx, tower);
                break;
            default:
                this.drawClassicTower(ctx, tower);
        }
        
        // 绘制等级指示器
        if (tower.level > 1) {
            this.drawLevelIndicator(ctx, tower, theme);
        }
        
        // 绘制炮管指向
        if (tower.target && !tower.target.isDead()) {
            this.drawTowerBarrel(ctx, tower, theme);
        }
        
        ctx.restore();
    }
    
    /**
     * 绘制经典主题炮塔
     */
    drawClassicTower(ctx, tower) {
        const x = tower.x, y = tower.y, size = tower.size;
        
        // 基座
        ctx.fillStyle = this.getTowerBaseColor(tower.type);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 边框
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 内部装饰
        ctx.fillStyle = this.getTowerAccentColor(tower.type);
        ctx.beginPath();
        ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // 中心点
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    /**
     * 绘制兽人主题炮塔
     */
    drawOrcTower(ctx, tower) {
        const x = tower.x, y = tower.y, size = tower.size;
        
        switch (tower.type) {
            case 'basic': // 精灵弓箭手
                this.drawElvenArcher(ctx, x, y, size, tower.level);
                break;
            case 'rapid': // 魔法奥术塔
                this.drawArcaneTower(ctx, x, y, size, tower.level);
                break;
            case 'heavy': // 矮人火炮
                this.drawDwarvenCannon(ctx, x, y, size, tower.level);
                break;
            default:
                this.drawElvenArcher(ctx, x, y, size, tower.level);
        }
    }
    
    /**
     * 绘制机械主题炮塔
     */
    drawMechTower(ctx, tower) {
        const x = tower.x, y = tower.y, size = tower.size;
        
        switch (tower.type) {
            case 'basic': // 激光炮
                this.drawLaserCannon(ctx, x, y, size, tower.level);
                break;
            case 'rapid': // 等离子炮
                this.drawPlasmaCannon(ctx, x, y, size, tower.level);
                break;
            case 'heavy': // 重型导弹塔
                this.drawMissileTower(ctx, x, y, size, tower.level);
                break;
            default:
                this.drawLaserCannon(ctx, x, y, size, tower.level);
        }
    }
    
    /**
     * 绘制精灵弓箭手
     */
    drawElvenArcher(ctx, x, y, size, level) {
        // 精灵台座（绿色生命能量）
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 自然纹理（叶子装饰）
        ctx.strokeStyle = '#32CD32';
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const leafX = x + Math.cos(angle) * size * 0.7;
            const leafY = y + Math.sin(angle) * size * 0.7;
            ctx.beginPath();
            ctx.arc(leafX, leafY, 3, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // 精灵弓（弯曲的弓形）
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x - size * 0.2, y, size * 0.6, -Math.PI/2.5, Math.PI/2.5);
        ctx.stroke();
        
        // 弓弦
        ctx.strokeStyle = '#DCDCDC';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const bowTop = y - size * 0.5;
        const bowBottom = y + size * 0.5;
        ctx.moveTo(x - size * 0.5, bowTop);
        ctx.lineTo(x - size * 0.5, bowBottom);
        ctx.stroke();
        
        // 箭矢（如果有目标则显示准备射击的箭矢）
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - size * 0.4, y);
        ctx.lineTo(x + size * 0.2, y);
        ctx.stroke();
        
        // 箭头
        ctx.beginPath();
        ctx.moveTo(x + size * 0.2, y);
        ctx.lineTo(x + size * 0.1, y - 3);
        ctx.moveTo(x + size * 0.2, y);
        ctx.lineTo(x + size * 0.1, y + 3);
        ctx.stroke();
        
        // 精灵光环（级别越高光环越亮）
        if (level > 1) {
            ctx.strokeStyle = '#90EE90';
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.arc(x, y, size * 1.2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        // 精灵星辉装饰
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < level; i++) {
            const starAngle = (i * Math.PI * 2) / Math.max(level, 3);
            const starX = x + Math.cos(starAngle) * size * 0.3;
            const starY = y + Math.sin(starAngle) * size * 0.3;
            ctx.beginPath();
            ctx.arc(starX, starY, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    /**
     * 绘制魔法奥术塔
     */
    drawArcaneTower(ctx, x, y, size, level) {
        // 神秘的石制基座
        ctx.fillStyle = '#483D8B';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 古老符文装饰
        ctx.strokeStyle = '#9370DB';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const runeX = x + Math.cos(angle) * size * 0.7;
            const runeY = y + Math.sin(angle) * size * 0.7;
            ctx.beginPath();
            ctx.arc(runeX, runeY, 2, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // 旋转的魔法光环
        ctx.strokeStyle = '#4169E1';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // 中心水晶球（发光效果）
        ctx.fillStyle = '#8A2BE2';
        ctx.shadowColor = '#8A2BE2';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        const crystalVertices = 6;
        ctx.moveTo(x + size * 0.4, y);
        for (let i = 0; i < crystalVertices; i++) {
            const angle = (i * 2 * Math.PI) / crystalVertices;
            const px = x + Math.cos(angle) * size * 0.4;
            const py = y + Math.sin(angle) * size * 0.4;
            ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // 魔法能量球（旋转的小球）
        ctx.fillStyle = '#9370DB';
        for (let i = 0; i < 4; i++) {
            const orbAngle = this.animationTime * 0.8 + (i * Math.PI) / 2; // 减慢旋转速度，从2改为0.8
            const orbX = x + Math.cos(orbAngle) * size * 0.9;
            const orbY = y + Math.sin(orbAngle) * size * 0.9;
            ctx.beginPath();
            ctx.arc(orbX, orbY, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 魔法塔尖（级别越高塔尖越高）
        ctx.fillStyle = '#4B0082';
        const spireHeight = size * (0.5 + level * 0.1);
        ctx.beginPath();
        ctx.moveTo(x, y - spireHeight);
        ctx.lineTo(x - size * 0.2, y - size * 0.3);
        ctx.lineTo(x + size * 0.2, y - size * 0.3);
        ctx.closePath();
        ctx.fill();
        
        // 塔尖的魔法宝石
        ctx.fillStyle = '#00FFFF';
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(x, y - spireHeight, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // 魔法粒子效果（级别越高粒子越多）
        ctx.fillStyle = '#DDA0DD';
        const particleCount = Math.min(level * 2, 8);
        for (let i = 0; i < particleCount; i++) {
            const particleAngle = this.animationTime * 1.2 + (i * Math.PI * 2) / particleCount; // 减慢速度，从3改为1.2
            const particleRadius = size * (1.2 + 0.3 * Math.sin(this.animationTime * 0.5 + i)); // 减慢脉动速度
            const px = x + Math.cos(particleAngle) * particleRadius;
            const py = y + Math.sin(particleAngle) * particleRadius;
            ctx.beginPath();
            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    /**
     * 绘制矮人火炮
     */
    drawDwarvenCannon(ctx, x, y, size, level) {
        // 金属镆造基座
        ctx.fillStyle = '#B8860B';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 金属装饰纹理
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(angle) * size * 0.4, y + Math.sin(angle) * size * 0.4);
            ctx.lineTo(x + Math.cos(angle) * size * 0.8, y + Math.sin(angle) * size * 0.8);
            ctx.stroke();
        }
        
        // 矮人工艺装饰环
        ctx.strokeStyle = '#8B7355';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
        ctx.stroke();
        
        // 主炮管（水平放置）
        ctx.fillStyle = '#2F4F4F';
        const cannonLength = size * 1.6;
        const cannonWidth = size * 0.3;
        ctx.fillRect(x - cannonLength/2, y - cannonWidth/2, cannonLength, cannonWidth);
        
        // 炮管纹理
        ctx.strokeStyle = '#708090';
        ctx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
            const lineX = x - cannonLength/2 + (cannonLength * i / 4);
            ctx.beginPath();
            ctx.moveTo(lineX, y - cannonWidth/2);
            ctx.lineTo(lineX, y + cannonWidth/2);
            ctx.stroke();
        }
        
        // 炮口（左右两侧）
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(x - cannonLength/2, y, size * 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + cannonLength/2, y, size * 0.12, 0, Math.PI * 2);
        ctx.fill();
        
        // 矮人银钉装饰
        ctx.fillStyle = '#C0C0C0';
        const rivets = [
            [x - size * 0.6, y - size * 0.6], [x + size * 0.6, y - size * 0.6],
            [x - size * 0.6, y + size * 0.6], [x + size * 0.6, y + size * 0.6],
            [x - size * 0.3, y - size * 0.8], [x + size * 0.3, y - size * 0.8]
        ];
        rivets.forEach(([rx, ry]) => {
            ctx.beginPath();
            ctx.arc(rx, ry, 2, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // 矮人工艺宝石（中心装饰）
        ctx.fillStyle = '#FF4500';
        ctx.shadowColor = '#FF4500';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // 矮人符号装饰
        ctx.fillStyle = '#8B4513';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⚒', x, y - size * 1.2);
    }
    
    /**
     * 绘制脉冲激光炮
     */
    drawLaserCannon(ctx, x, y, size, level) {
        // 金属科技基座
        ctx.fillStyle = '#2F4F4F';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 科技装甲纹理
        ctx.strokeStyle = '#708090';
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(angle) * size * 0.3, y + Math.sin(angle) * size * 0.3);
            ctx.lineTo(x + Math.cos(angle) * size * 0.9, y + Math.sin(angle) * size * 0.9);
            ctx.stroke();
        }
        
        // 激光发射器核心
        ctx.fillStyle = '#FF6347';
        ctx.shadowColor = '#FF6347';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // 脉冲能量环（动态效果）
        const pulseSize = size * (0.6 + 0.15 * Math.sin(this.animationTime * 2)); // 减慢脉冲速度，从4改为2
        ctx.strokeStyle = '#FF6347';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // 激光聚焦镜
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.8, Math.PI * 0.3, Math.PI * 0.7);
        ctx.arc(x, y, size * 0.8, Math.PI * 1.3, Math.PI * 1.7);
        ctx.stroke();
        
        // 能量指示灯（级别越高灯越多）
        ctx.fillStyle = '#00FF00';
        for (let i = 0; i < level; i++) {
            const lightAngle = (i * Math.PI * 2) / Math.max(level, 3);
            const lightX = x + Math.cos(lightAngle) * size * 0.5;
            const lightY = y + Math.sin(lightAngle) * size * 0.5;
            ctx.beginPath();
            ctx.arc(lightX, lightY, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 激光发射效果
        if (Math.sin(this.animationTime * 3) > 0.7) { // 减慢闪烁速度，从6改为3
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#FF0000';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + size * 1.5, y);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }
    
    /**
     * 绘制等离子加速器
     */
    drawPlasmaCannon(ctx, x, y, size, level) {
        // 高科技基座
        ctx.fillStyle = '#483D8B';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 等离子加速器管道
        ctx.strokeStyle = '#9370DB';
        ctx.lineWidth = 4;
        ctx.setLineDash([6, 3]);
        ctx.beginPath();
        ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // 磁场发生器
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            const startRadius = size * 0.3;
            const endRadius = size * 0.7;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(angle) * startRadius, y + Math.sin(angle) * startRadius);
            ctx.lineTo(x + Math.cos(angle) * endRadius, y + Math.sin(angle) * endRadius);
            ctx.stroke();
        }
        
        // 旋转的等离子核心（双旋转效果）
        ctx.save();
        ctx.translate(x, y);
        
        // 外层旋转
        ctx.rotate(this.animationTime * 0.8); // 减慢旋转速度，从2改为0.8
        ctx.fillStyle = '#FF6347';
        ctx.shadowColor = '#FF6347';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.5, size * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 内层反向旋转
        ctx.rotate(-this.animationTime * 1.6); // 减慢旋转速度，从4改为1.6
        ctx.fillStyle = '#00FFFF';
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.3, size * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.restore();
        
        // 等离子流效果
        ctx.fillStyle = '#9370DB';
        for (let i = 0; i < 6; i++) {
            const streamAngle = this.animationTime * 1.2 + (i * Math.PI) / 3; // 减慢速度，从3改为1.2
            const streamRadius = size * (1.0 + 0.3 * Math.sin(this.animationTime * 0.8 + i)); // 减慢脉动
            const streamX = x + Math.cos(streamAngle) * streamRadius;
            const streamY = y + Math.sin(streamAngle) * streamRadius;
            ctx.beginPath();
            ctx.arc(streamX, streamY, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 加速器状态指示
        ctx.fillStyle = level > 2 ? '#00FF00' : '#FFFF00';
        ctx.beginPath();
        ctx.arc(x, y - size * 1.1, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    /**
     * 绘制轨道破坏炮
     */
    drawMissileTower(ctx, x, y, size, level) {
        // 重型装甲基座
        ctx.fillStyle = '#556B2F';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 装甲板纹理
        ctx.strokeStyle = '#8B8682';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(angle) * size * 0.4, y + Math.sin(angle) * size * 0.4);
            ctx.lineTo(x + Math.cos(angle) * size * 0.9, y + Math.sin(angle) * size * 0.9);
            ctx.stroke();
        }
        
        // 轨道炮主管（垂直向上）
        ctx.fillStyle = '#2F4F4F';
        const railLength = size * 1.5;
        const railWidth = size * 0.2;
        ctx.fillRect(x - railWidth/2, y - size - railLength, railWidth, railLength);
        
        // 轨道磁力线圈
        ctx.strokeStyle = '#9370DB';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            const ringY = y - size * 0.3 - i * size * 0.2;
            ctx.beginPath();
            ctx.arc(x, ringY, railWidth * 1.5, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // 能量充电器
        ctx.fillStyle = '#FF6347';
        ctx.shadowColor = '#FF6347';
        ctx.shadowBlur = 6;
        ctx.fillRect(x - size * 0.6, y - size * 0.3, size * 1.2, size * 0.2);
        ctx.fillRect(x - size * 0.6, y + size * 0.1, size * 1.2, size * 0.2);
        ctx.shadowBlur = 0;
        
        // 轨道弹丸（处于发射准备状态）
        ctx.fillStyle = '#FFD700';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y - size - railLength + 5, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // 目标锁定系统
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // 旋转雷达扫描
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.animationTime * 1.2); // 减慢扫描速度，从3改为1.2
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(size * 0.5, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-size * 0.3, -size * 0.3);
        ctx.stroke();
        ctx.restore();
        
        // 充能指示灯（级别越高充能越快）
        const chargeSpeed = 1 + level * 0.3; // 减慢充能闪烁速度，从2+level改为1+level*0.3
        ctx.fillStyle = Math.sin(this.animationTime * chargeSpeed) > 0 ? '#00FF00' : '#FF0000';
        ctx.beginPath();
        ctx.arc(x - size * 0.8, y - size * 0.8, 3, 0, Math.PI * 2);
        ctx.arc(x + size * 0.8, y - size * 0.8, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    /**
     * 绘制敌人
     */
    drawEnemy(ctx, enemy, theme) {
        ctx.save();
        
        // 根据主题绘制敌人
        switch (theme) {
            case 'orc':
                this.drawOrcEnemy(ctx, enemy);
                break;
            case 'mech':
                this.drawMechEnemy(ctx, enemy);
                break;
            default:
                this.drawClassicEnemy(ctx, enemy);
        }
        
        // 绘制生命值条
        this.drawHealthBar(ctx, enemy);
        
        ctx.restore();
    }
    
    /**
     * 绘制经典敌人
     */
    drawClassicEnemy(ctx, enemy) {
        const x = enemy.x, y = enemy.y, size = enemy.size;
        
        // 主体
        ctx.fillStyle = this.getEnemyColor(enemy.type);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 边框
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 类型标识
        ctx.fillStyle = '#FFF';
        ctx.font = `${size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.getEnemySymbol(enemy.type), x, y);
    }
    
    /**
     * 绘制兽人敌人
     */
    drawOrcEnemy(ctx, enemy) {
        const x = enemy.x, y = enemy.y, size = enemy.size;
        
        switch (enemy.type) {
            case 'basic': // 兽人步兵
                this.drawOrcWarrior(ctx, x, y, size);
                break;
            case 'fast': // 兽人狼骑
                this.drawOrcWolfRider(ctx, x, y, size);
                break;
            case 'tank': // 兽人酋长
                this.drawOrcChief(ctx, x, y, size);
                break;
            case 'elite': // 兽人萨满
                this.drawOrcShaman(ctx, x, y, size);
                break;
            case 'boss': // 兽人酋王
                this.drawOrcKing(ctx, x, y, size);
                break;
            default:
                this.drawOrcWarrior(ctx, x, y, size);
        }
    }
    
    /**
     * 绘制机械敌人
     */
    drawMechEnemy(ctx, enemy) {
        const x = enemy.x, y = enemy.y, size = enemy.size;
        
        switch (enemy.type) {
            case 'basic': // 侦察机器人
                this.drawScoutBot(ctx, x, y, size);
                break;
            case 'fast': // 突击机器人
                this.drawAssaultBot(ctx, x, y, size);
                break;
            case 'tank': // 重型机甲
                this.drawHeavyMech(ctx, x, y, size);
                break;
            case 'elite': // 量子幽灵
                this.drawQuantumGhost(ctx, x, y, size);
                break;
            case 'boss': // AI母舰
                this.drawAICarrier(ctx, x, y, size);
                break;
            default:
                this.drawScoutBot(ctx, x, y, size);
        }
    }
    
    /**
     * 绘制兽人战士
     */
    drawOrcWarrior(ctx, x, y, size) {
        // 身体
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 盔甲
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
        ctx.stroke();
        
        // 武器
        ctx.strokeStyle = '#8B8682';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x - size, y - size * 0.3);
        ctx.lineTo(x - size * 1.5, y - size * 0.8);
        ctx.stroke();
        
        // 眼睛
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(x - size * 0.3, y - size * 0.3, 2, 0, Math.PI * 2);
        ctx.arc(x + size * 0.3, y - size * 0.3, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    /**
     * 绘制兽人狼骑
     */
    drawOrcWolfRider(ctx, x, y, size) {
        // 狼身
        ctx.fillStyle = '#708090';
        ctx.beginPath();
        ctx.ellipse(x, y + size * 0.2, size * 1.2, size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 狼头
        ctx.beginPath();
        ctx.ellipse(x - size * 0.8, y - size * 0.2, size * 0.6, size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 骑手
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(x + size * 0.2, y - size * 0.3, size * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // 狼眼
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x - size * 0.9, y - size * 0.3, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    /**
     * 绘制兄人酷长
     */
    drawOrcChief(ctx, x, y, size) {
        // 强壮的身体
        ctx.fillStyle = '#DC143C';
        ctx.beginPath();
        ctx.arc(x, y, size * 1.2, 0, Math.PI * 2);
        ctx.fill();
        
        // 献甲
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.stroke();
        
        // 双手斧
        ctx.strokeStyle = '#C0C0C0';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(x - size * 1.3, y - size * 0.5);
        ctx.lineTo(x - size * 1.8, y - size);
        ctx.moveTo(x + size * 1.3, y - size * 0.5);
        ctx.lineTo(x + size * 1.8, y - size);
        ctx.stroke();
        
        // 红色眼睛
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(x - size * 0.4, y - size * 0.4, 4, 0, Math.PI * 2);
        ctx.arc(x + size * 0.4, y - size * 0.4, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 角
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - size * 0.3, y - size * 0.8);
        ctx.lineTo(x - size * 0.5, y - size * 1.2);
        ctx.moveTo(x + size * 0.3, y - size * 0.8);
        ctx.lineTo(x + size * 0.5, y - size * 1.2);
        ctx.stroke();
    }
    
    /**
     * 绘制卒人萨满
     */
    drawOrcShaman(ctx, x, y, size) {
        // 身体
        ctx.fillStyle = '#4B0082';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 魔法光环
        ctx.strokeStyle = '#9370DB';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(x, y, size * 1.3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // 法杖
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x + size * 0.5, y + size);
        ctx.lineTo(x + size * 0.3, y - size * 1.2);
        ctx.stroke();
        
        // 水晶球
        ctx.fillStyle = '#00FFFF';
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x + size * 0.3, y - size * 1.2, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // 魔法粒子
        ctx.fillStyle = '#8A2BE2';
        for (let i = 0; i < 3; i++) {
            const angle = this.animationTime * 0.8 + (i * Math.PI * 2) / 3; // 减慢旋转速度，从2改为0.8
            const px = x + Math.cos(angle) * size * 0.8;
            const py = y + Math.sin(angle) * size * 0.8;
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    /**
     * 绘制吵人琅王
     */
    drawOrcKing(ctx, x, y, size) {
        // 巨大的身体
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // 皇冠
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x - size * 0.8, y - size * 1.3, size * 1.6, size * 0.3);
        
        // 皇冠尖锥
        for (let i = 0; i < 5; i++) {
            const cx = x - size * 0.6 + i * size * 0.3;
            ctx.beginPath();
            ctx.moveTo(cx, y - size * 1.3);
            ctx.lineTo(cx, y - size * 1.6);
            ctx.lineTo(cx + size * 0.1, y - size * 1.3);
            ctx.closePath();
            ctx.fill();
        }
        
        // 战斧
        ctx.strokeStyle = '#2F4F4F';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(x - size * 2, y + size * 0.5);
        ctx.lineTo(x - size * 1.2, y - size * 0.8);
        ctx.stroke();
        
        // 战斧头
        ctx.fillStyle = '#696969';
        ctx.fillRect(x - size * 2.2, y - size * 0.9, size * 0.4, size * 0.6);
        
        // 发光的眼睛
        ctx.fillStyle = '#FF4500';
        ctx.shadowColor = '#FF4500';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x - size * 0.5, y - size * 0.5, 6, 0, Math.PI * 2);
        ctx.arc(x + size * 0.5, y - size * 0.5, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // 王者光环
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    /**
     * 绘制侦察机器人
     */
    drawScoutBot(ctx, x, y, size) {
        // 主体装甲
        ctx.fillStyle = '#708090';
        ctx.fillRect(x - size * 0.7, y - size * 0.7, size * 1.4, size * 1.4);
        
        // 装甲纹理
        ctx.strokeStyle = '#C0C0C0';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - size * 0.7, y - size * 0.7, size * 1.4, size * 1.4);
        
        // 传感器眼部
        ctx.fillStyle = '#00FFFF';
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(x, y - size * 0.3, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // 天线系统
        ctx.strokeStyle = '#C0C0C0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - size * 0.5, y - size * 0.8);
        ctx.lineTo(x - size * 0.3, y - size * 1.2);
        ctx.moveTo(x + size * 0.5, y - size * 0.8);
        ctx.lineTo(x + size * 0.3, y - size * 1.2);
        ctx.stroke();
        
        // LED状态灯
        ctx.fillStyle = '#00FF00';
        ctx.beginPath();
        ctx.arc(x - size * 0.4, y + size * 0.2, 2, 0, Math.PI * 2);
        ctx.arc(x + size * 0.4, y + size * 0.2, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 机器编号
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SC-01', x, y + size * 0.5);
    }
    
    /**
     * 绘制突击机器人
     */
    drawAssaultBot(ctx, x, y, size) {
        // 主体
        ctx.fillStyle = '#FF6347';
        ctx.fillRect(x - size * 0.8, y - size * 0.6, size * 1.6, size * 1.2);
        
        // 装甲板
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - size * 0.8, y - size * 0.6, size * 1.6, size * 1.2);
        
        // 武器系统
        ctx.fillStyle = '#2F4F4F';
        ctx.fillRect(x - size * 0.9, y - size * 0.3, size * 0.3, size * 0.6);
        ctx.fillRect(x + size * 0.6, y - size * 0.3, size * 0.3, size * 0.6);
        
        // 眼部传感器
        ctx.fillStyle = '#00FF00';
        ctx.shadowColor = '#00FF00';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(x - size * 0.3, y - size * 0.2, 4, 0, Math.PI * 2);
        ctx.arc(x + size * 0.3, y - size * 0.2, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // 推进器
        ctx.fillStyle = '#1E90FF';
        ctx.shadowColor = '#1E90FF';
        ctx.shadowBlur = 8;
        ctx.fillRect(x - size * 0.6, y + size * 0.7, size * 1.2, size * 0.2);
        ctx.shadowBlur = 0;
    }
    
    /**
     * 绘制重型机甲
     */
    drawHeavyMech(ctx, x, y, size) {
        // 主体装甲
        ctx.fillStyle = '#708090';
        ctx.fillRect(x - size * 1.2, y - size * 1.0, size * 2.4, size * 2.0);
        
        // 装甲板细节
        ctx.strokeStyle = '#2F4F4F';
        ctx.lineWidth = 3;
        ctx.strokeRect(x - size * 1.2, y - size * 1.0, size * 2.4, size * 2.0);
        
        // 主炮
        ctx.fillStyle = '#2F4F4F';
        ctx.fillRect(x - size * 0.2, y - size * 1.3, size * 0.4, size * 1.5);
        
        // 炮口
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x, y - size * 1.3, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        
        // 副武器
        ctx.fillStyle = '#696969';
        ctx.fillRect(x - size * 1.3, y - size * 0.2, size * 0.3, size * 0.4);
        ctx.fillRect(x + size * 1.0, y - size * 0.2, size * 0.3, size * 0.4);
        
        // 雷达系统
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y - size * 0.5, size * 0.8, 0, Math.PI * 2);
        ctx.stroke();
        
        // 扩描线
        ctx.save();
        ctx.translate(x, y - size * 0.5);
        ctx.rotate(this.animationTime * 0.6); // 减慢扫描速度，从1改为0.6
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(size * 0.8, 0);
        ctx.stroke();
        ctx.restore();
        
        // 警告灯
        ctx.fillStyle = Math.sin(this.animationTime * 2) > 0 ? '#FF0000' : '#8B0000'; // 减慢闪烁速度，从5改为2
        ctx.beginPath();
        ctx.arc(x - size * 0.8, y - size * 0.8, 3, 0, Math.PI * 2);
        ctx.arc(x + size * 0.8, y - size * 0.8, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    /**
     * 绘制量子幽灵
     */
    drawQuantumGhost(ctx, x, y, size) {
        // 半透明效果
        ctx.globalAlpha = 0.7 + 0.3 * Math.sin(this.animationTime * 1.5); // 减慢闪烁速度，从3改为1.5
        
        // 能量体
        ctx.fillStyle = '#9370DB';
        ctx.shadowColor = '#9370DB';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 量子波动
        ctx.strokeStyle = '#8A2BE2';
        ctx.lineWidth = 2;
        for (let i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.arc(x, y, size * i * 0.4, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // 能量核心
        ctx.fillStyle = '#00FFFF';
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // 量子粒子
        ctx.fillStyle = '#FF69B4';
        for (let i = 0; i < 6; i++) {
            const angle = this.animationTime * 1.6 + (i * Math.PI) / 3; // 减慢旋转速度，从4改为1.6
            const radius = size * (0.8 + 0.2 * Math.sin(this.animationTime * 0.8 + i)); // 减慢脉动速度，从2改为0.8
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
    
    /**
     * 绘制AI母舰
     */
    drawAICarrier(ctx, x, y, size) {
        // 主舰体
        ctx.fillStyle = '#2F4F4F';
        ctx.fillRect(x - size * 1.5, y - size * 0.8, size * 3, size * 1.6);
        
        // 指挥中心
        ctx.fillStyle = '#00BFFF';
        ctx.fillRect(x - size * 0.5, y - size * 1.2, size, size * 0.8);
        
        // 能量核心
        ctx.fillStyle = '#FF4500';
        ctx.shadowColor = '#FF4500';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // 护盾发生器
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // 武器系统
        const weapons = [
            [x - size * 1.2, y - size * 0.5],
            [x + size * 1.2, y - size * 0.5],
            [x - size * 1.2, y + size * 0.5],
            [x + size * 1.2, y + size * 0.5]
        ];
        
        ctx.fillStyle = '#8B0000';
        weapons.forEach(([wx, wy]) => {
            ctx.fillRect(wx - size * 0.1, wy - size * 0.1, size * 0.2, size * 0.2);
        });
        
        // 推进器
        ctx.fillStyle = '#1E90FF';
        ctx.shadowColor = '#1E90FF';
        ctx.shadowBlur = 10;
        for (let i = 0; i < 4; i++) {
            const tx = x - size * 1.3 + i * size * 0.9;
            ctx.fillRect(tx, y + size * 0.9, size * 0.2, size * 0.3);
        }
        
        // AI中心眼
        ctx.fillStyle = '#FF0000';
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(x, y - size * 0.8, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
    }
    
    /**
     * 辅助方法
     */
    getTowerBaseColor(type) {
        const colors = {
            basic: '#FF8A50',
            rapid: '#50B7FF', 
            heavy: '#A050FF'
        };
        return colors[type] || colors.basic;
    }
    
    getTowerAccentColor(type) {
        const colors = {
            basic: '#FF6B35',
            rapid: '#0080FF',
            heavy: '#8A2BE2'
        };
        return colors[type] || colors.basic;
    }
    
    getEnemyColor(type) {
        const colors = {
            basic: '#FF6B6B',
            fast: '#4ECDC4',
            tank: '#45B7D1'
        };
        return colors[type] || colors.basic;
    }
    
    getEnemySymbol(type) {
        const symbols = {
            basic: '●',
            fast: '▲', 
            tank: '■'
        };
        return symbols[type] || symbols.basic;
    }
    
    /**
     * 绘制选中光环
     */
    drawSelectionRing(ctx, x, y, radius) {
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(x, y, radius + 3 * Math.sin(this.animationTime * 2), 0, Math.PI * 2); // 减慢脉动速度，从4改为2
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    /**
     * 绘制枪口闪光
     */
    drawMuzzleFlash(ctx, tower, theme) {
        if (!tower.target) return;
        
        const angle = Math.atan2(tower.target.y - tower.y, tower.target.x - tower.x);
        const flashX = tower.x + Math.cos(angle) * tower.size;
        const flashY = tower.y + Math.sin(angle) * tower.size;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(flashX, flashY, 5, 0, Math.PI * 2);
        ctx.fill();
    }
    
    /**
     * 绘制炮管
     */
    drawTowerBarrel(ctx, tower, theme) {
        const angle = Math.atan2(tower.target.y - tower.y, tower.target.x - tower.x);
        const barrelLength = tower.size * 0.8;
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(tower.x, tower.y);
        ctx.lineTo(tower.x + Math.cos(angle) * barrelLength, tower.y + Math.sin(angle) * barrelLength);
        ctx.stroke();
    }
    
    /**
     * 绘制等级指示器
     */
    drawLevelIndicator(ctx, tower, theme) {
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`L${tower.level}`, tower.x, tower.y + tower.size + 15);
    }
    
    /**
     * 绘制生命值条
     */
    drawHealthBar(ctx, enemy) {
        const barWidth = enemy.size * 2.5;
        const barHeight = 6;
        const x = enemy.x - barWidth / 2;
        const y = enemy.y - enemy.size - 12;
        
        // 背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(x - 1, y - 1, barWidth + 2, barHeight + 2);
        
        // 生命值
        const healthPercent = enemy.health / enemy.maxHealth;
        let healthColor = '#4CAF50';
        if (healthPercent <= 0.3) healthColor = '#F44336';
        else if (healthPercent <= 0.6) healthColor = '#FF9800';
        
        ctx.fillStyle = healthColor;
        ctx.fillRect(x, y, barWidth * healthPercent, barHeight);
        
        // 边框
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, barWidth, barHeight);
    }
}