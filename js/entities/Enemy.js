import { GAME_CONFIG } from '../config.js';
import { GameUtils } from '../utils.js';
import { themeManager } from '../themes.js';
import { EntityRenderer } from '../renderers/EntityRenderer.js';

// 全局实体渲染器实例
const entityRenderer = new EntityRenderer();

// 敌人类
export class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.path = [];
        this.pathIndex = 0;
        this.targetX = x;
        this.targetY = y;
        
        this.setTypeProperties(type);
        this.maxHealth = this.health;
        this.isDying = false;
        this.reachedEnd = false;
    }
    
    setTypeProperties(type) {
        const config = GAME_CONFIG.ENEMY_CONFIG[type];
        if (config) {
            this.health = config.health;
            this.speed = config.speed;
            this.reward = config.reward;
            this.damage = config.damage;
            this.score = config.score;
            this.color = config.color;
            this.size = config.size;
        }
    }
    
    setPath(path) {
        this.path = [...path];
        if (this.path.length > 1) {
            this.targetX = this.path[1].x;
            this.targetY = this.path[1].y;
            this.pathIndex = 1;
        }
    }
    
    update() {
        if (this.isDying || this.reachedEnd) return;
        
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < GAME_CONFIG.CONSTANTS.ENEMY_WAYPOINT_DISTANCE) {
            this.pathIndex++;
            if (this.pathIndex >= this.path.length) {
                this.reachedEnd = true;
                return;
            }
            
            this.targetX = this.path[this.pathIndex].x;
            this.targetY = this.path[this.pathIndex].y;
        } else {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }
    
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.isDying = true;
        }
    }
    
    isDead() {
        return this.isDying;
    }
    
    hasReachedEnd() {
        return this.reachedEnd;
    }
    
    draw(ctx) {
        if (this.isDying) return;
        
        // 更新动画时间
        entityRenderer.update();
        
        // 获取当前主题
        const currentTheme = themeManager.getCurrentThemeName();
        
        // 使用新的实体渲染器绘制精致的敌人
        entityRenderer.drawEnemy(ctx, this, currentTheme);
    }
    
    // drawHealthBar 方法已移至 EntityRenderer 中
}