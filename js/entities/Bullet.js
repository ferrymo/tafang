import { GAME_CONFIG } from '../config.js';
import { GameUtils } from '../utils.js';
import { themeManager } from '../themes.js';

// 子弹类
export class Bullet {
    constructor(x, y, target, damage, type) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.type = type;
        this.hasHit = false;
        
        // 计算飞行角度用于轨迹效果
        this.angle = GameUtils.getAngle(this, target);
        
        this.setTypeProperties(type);
    }
    
    setTypeProperties(type) {
        const config = GAME_CONFIG.BULLET_CONFIG[type];
        if (config) {
            this.color = config.color;
            this.size = config.size;
            this.speed = config.speed;
        }
    }
    
    update() {
        if (this.hasHit || this.target.isDead()) return;
        
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < GAME_CONFIG.CONSTANTS.BULLET_HIT_DISTANCE) {
            this.hasHit = true;
        } else {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }
    
    hasHitTarget() {
        return this.hasHit;
    }
    
    isOutOfBounds(width, height) {
        return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
    }
    
    draw(ctx) {
        // 获取主题化的子弹配置
        const themeConfig = themeManager.getThemedEntityConfig('bullets', this.type);
        const displayColor = themeConfig ? themeConfig.color : this.color;
        const hasTrail = themeConfig ? themeConfig.trail : false;
        
        // 绘制轨迹效果
        if (hasTrail) {
            ctx.strokeStyle = displayColor;
            ctx.lineWidth = this.size;
            ctx.lineCap = 'round';
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            const trailLength = 10;
            const dx = Math.cos(this.angle) * trailLength;
            const dy = Math.sin(this.angle) * trailLength;
            ctx.moveTo(this.x - dx, this.y - dy);
            ctx.lineTo(this.x, this.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
        
        // 绘制子弹主体
        ctx.fillStyle = displayColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}