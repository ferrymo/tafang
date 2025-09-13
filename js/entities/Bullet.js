import { GAME_CONFIG } from '../config.js';
import { GameUtils } from '../utils.js';

// 子弹类
export class Bullet {
    constructor(x, y, target, damage, type) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.type = type;
        this.hasHit = false;
        
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
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}