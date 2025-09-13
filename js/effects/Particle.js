import { GAME_CONFIG } from '../config.js';
import { GameUtils } from '../utils.js';

// 粒子效果类
export class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        
        this.setTypeProperties(type);
        this.maxLife = this.life;
        
        this.vx = (Math.random() - 0.5) * this.speedRange;
        this.vy = (Math.random() - 0.5) * this.speedRange;
    }
    
    setTypeProperties(type) {
        const config = GAME_CONFIG.PARTICLE_CONFIG[type];
        if (config) {
            this.color = config.color;
            this.size = GameUtils.random(config.minSize, config.maxSize);
            this.speedRange = config.speedRange;
            this.life = config.life;
            
            // 特殊处理烟雾粒子
            if (type === 'smoke') {
                this.vy = -Math.random() * 3 - 1; // 向上漂浮
            }
        }
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        
        // 空气阻力
        this.vx *= 0.98;
        this.vy *= 0.98;
    }
    
    isDead() {
        return this.life <= 0;
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        const hexAlpha = Math.floor(alpha * 255).toString(16).padStart(2, '0');
        
        ctx.fillStyle = this.color + hexAlpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
        ctx.fill();
    }
}