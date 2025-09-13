import { GAME_CONFIG } from '../config.js';
import { GameUtils } from '../utils.js';
import { Bullet } from './Bullet.js';
import { themeManager } from '../themes.js';
import { EntityRenderer } from '../renderers/EntityRenderer.js';

// 全局实体渲染器实例
const entityRenderer = new EntityRenderer();

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
        // 更新动画时间
        entityRenderer.update();
        
        // 获取当前主题
        const currentTheme = themeManager.getCurrentThemeName();
        
        // 使用新的实体渲染器绘制精致的炮塔
        entityRenderer.drawTower(ctx, this, currentTheme, isSelected);
    }
}