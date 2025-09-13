import { GAME_CONFIG } from '../config.js';

// 游戏渲染器
export class GameRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
    }
    
    /**
     * 清空画布
     */
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    
    /**
     * 绘制背景
     */
    drawBackground() {
        // 绘制草地背景
        this.ctx.fillStyle = '#90EE90';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 绘制网格
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x < this.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }
    
    /**
     * 绘制游戏路径
     */
    drawPath(path) {
        // 绘制路径边缘
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 35;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.globalCompositeOperation = 'destination-over';
        
        this.ctx.beginPath();
        this.ctx.moveTo(path[0].x, path[0].y);
        
        for (let i = 1; i < path.length; i++) {
            this.ctx.lineTo(path[i].x, path[i].y);
        }
        
        this.ctx.stroke();
        
        // 绘制路径主体
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 30;
        
        this.ctx.beginPath();
        this.ctx.moveTo(path[0].x, path[0].y);
        
        for (let i = 1; i < path.length; i++) {
            this.ctx.lineTo(path[i].x, path[i].y);
        }
        
        this.ctx.stroke();
    }
    
    /**
     * 绘制防御塔射程
     */
    drawTowerRange(tower) {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        
        this.ctx.beginPath();
        this.ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
    }
    
    /**
     * 绘制游戏实体
     */
    drawEntities(enemies, towers, bullets, selectedTower) {
        // 绘制敌人
        enemies.forEach(enemy => enemy.draw(this.ctx));
        
        // 绘制防御塔
        towers.forEach(tower => tower.draw(this.ctx, tower === selectedTower));
        
        // 绘制子弹
        bullets.forEach(bullet => bullet.draw(this.ctx));
    }
    
    /**
     * 绘制特效
     */
    drawEffects(particles, visualEffects) {
        // 绘制粒子效果
        particles.forEach(particle => particle.draw(this.ctx));
        
        // 绘制视觉特效
        visualEffects.forEach(effect => effect.draw(this.ctx));
    }
    
    /**
     * 绘制调试信息
     */
    drawDebugInfo(debugInfo) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 200, 100);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        
        let y = 25;
        for (const [key, value] of Object.entries(debugInfo)) {
            this.ctx.fillText(`${key}: ${value}`, 15, y);
            y += 15;
        }
    }
    
    /**
     * 绘制暂停屏幕
     */
    drawPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏暂停', this.width / 2, this.height / 2);
    }
}