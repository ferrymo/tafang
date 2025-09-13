import { GAME_CONFIG } from '../config.js';
import { GameUtils } from '../utils.js';
import { themeManager } from '../themes.js';

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
        
        // 获取主题化的敌人配置
        const themeConfig = themeManager.getThemedEntityConfig('enemies', this.type);
        const displayColor = themeConfig ? themeConfig.color : this.color;
        const displaySymbol = themeConfig ? themeConfig.symbol : null;
        
        // 绘制敌人主体
        ctx.fillStyle = displayColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制边框
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 如果有主题符号，绘制符号
        if (displaySymbol && displaySymbol.length <= 2) {
            ctx.fillStyle = '#FFF';
            ctx.font = `${this.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // 添加文字描边以提高可见性
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.strokeText(displaySymbol, this.x, this.y);
            ctx.fillText(displaySymbol, this.x, this.y);
        }
        
        // 绘制生命值条
        this.drawHealthBar(ctx);
    }
    
    drawHealthBar(ctx) {
        const barWidth = this.size * 2;
        const barHeight = 4;
        const x = this.x - barWidth / 2;
        const y = this.y - this.size - 10;
        
        // 背景
        ctx.fillStyle = '#333';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // 生命值
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.6 ? '#4CAF50' : healthPercent > 0.3 ? '#FF9800' : '#F44336';
        ctx.fillRect(x, y, barWidth * healthPercent, barHeight);
    }
}