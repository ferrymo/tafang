import { GAME_CONFIG } from '../config.js';
import { GameUtils } from '../utils.js';
import { Bullet } from './Bullet.js';

// 防御塔类
export class Tower {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.level = 1;
        this.lastShot = 0;
        this.target = null;
        this.isShooting = false;
        
        this.setTypeProperties(type);
        this.baseDamage = this.damage;
        this.baseRange = this.range;
        this.baseFireRate = this.fireRate;
    }
    
    setTypeProperties(type) {
        const config = GAME_CONFIG.TOWER_CONFIG[type];
        if (config) {
            this.damage = config.damage;
            this.range = config.range;
            this.fireRate = config.fireRate;
            this.cost = config.cost;
            this.color = config.color;
            this.size = config.size;
        }
    }
    
    update(enemies) {
        if (!this.target || this.target.isDead() || !this.isInRange(this.target)) {
            this.target = this.findTarget(enemies);
        }
    }
    
    findTarget(enemies) {
        let closestEnemy = null;
        let closestDistance = Infinity;
        
        for (let enemy of enemies) {
            if (enemy.isDead()) continue;
            
            const distance = GameUtils.getDistance(this, enemy);
            if (distance <= this.range && distance < closestDistance) {
                closestEnemy = enemy;
                closestDistance = distance;
            }
        }
        
        return closestEnemy;
    }
    
    isInRange(enemy) {
        return GameUtils.getDistance(this, enemy) <= this.range;
    }
    
    canShoot() {
        return Date.now() - this.lastShot >= this.fireRate;
    }
    
    shoot(target) {
        if (this.canShoot() && target) {
            this.lastShot = Date.now();
            
            // 添加开火动画效果
            this.isShooting = true;
            setTimeout(() => {
                this.isShooting = false;
            }, 200);
            
            return new Bullet(this.x, this.y, target, this.damage, this.type);
        }
        return null;
    }
    
    upgrade() {
        this.level++;
        this.damage = Math.floor(this.baseDamage * (1 + (this.level - 1) * 0.5));
        this.range = Math.floor(this.baseRange * (1 + (this.level - 1) * 0.2));
        this.fireRate = Math.max(100, Math.floor(this.baseFireRate * (1 - (this.level - 1) * 0.1)));
    }
    
    getUpgradeCost() {
        return this.cost * this.level;
    }
    
    getSellValue() {
        return Math.floor(this.cost * 0.7 * this.level);
    }
    
    draw(ctx, isSelected = false) {
        if (isSelected) {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size + 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 开火时的闪烁效果
        if (this.isShooting) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size + 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 绘制防御塔主体
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制边框
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制等级
        if (this.level > 1) {
            ctx.fillStyle = '#FFF';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.strokeText(this.level.toString(), this.x, this.y + 4);
            ctx.fillText(this.level.toString(), this.x, this.y + 4);
        }
        
        // 绘制炮管指向目标
        if (this.target && !this.target.isDead()) {
            const angle = GameUtils.getAngle(this, this.target);
            
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + Math.cos(angle) * (this.size - 2), this.y + Math.sin(angle) * (this.size - 2));
            ctx.stroke();
        }
    }
}