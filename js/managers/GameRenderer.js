import { GAME_CONFIG } from '../config.js';
import { themeManager } from '../themes.js';
import { ThemeEffects } from '../effects/ThemeEffects.js';
import { ThemeMapRenderer } from './ThemeMapRenderer.js';

export class GameRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
        this.themeEffects = new ThemeEffects(canvas, ctx);
        this.mapRenderer = new ThemeMapRenderer(canvas, ctx);
        this.currentTheme = 'classic';
        this.animationTime = 0; // 添加统一的动画时间
        
        // 初始化主题
        this.updateTheme();
        
        // 监听主题变化
        themeManager.addThemeChangeListener((theme, themeName) => {
            this.currentTheme = themeName;
            this.updateTheme();
        });
    }
    
    /**
     * 更新主题
     */
    updateTheme() {
        const themeConfig = themeManager.getCurrentTheme();
        this.themeEffects.setTheme(this.currentTheme);
        this.mapRenderer.setTheme(this.currentTheme, themeConfig);
    }
    
    /**
     * 清空画布
     */
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    
    /**
     * 绘制背景和路径
     */
    drawBackground(path) {
        // 使用主题地图渲染器
        if (this.mapRenderer) {
            this.mapRenderer.render(path);
        } else {
            // 后备方案：绘制简单背景
            const backgroundColor = themeManager.getThemedColor('background');
            this.ctx.fillStyle = backgroundColor;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
    }
    
    /**
     * 绘制经典主题背景
     */
    drawClassicBackground() {
        // 绘制简单网格
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
     * 绘制兽人主题背景
     */
    drawOrcBackground(theme) {
        // 绘制森林背景纹理
        this.ctx.fillStyle = 'rgba(45, 80, 22, 0.3)';
        for (let i = 0; i < 20; i++) {
            const x = (i * 73) % this.width;
            const y = (i * 97) % this.height;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 15 + Math.sin(i) * 5, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // 绘制树木阴影
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        for (let i = 0; i < 15; i++) {
            const x = (i * 113) % this.width;
            const y = (i * 127) % this.height;
            this.ctx.fillRect(x, y, 8, 30);
        }
        
        // 绘制石头装饰
        this.ctx.fillStyle = 'rgba(105, 105, 105, 0.4)';
        for (let i = 0; i < 10; i++) {
            const x = (i * 157) % this.width;
            const y = (i * 179) % this.height;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 5 + Math.random() * 5, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    /**
     * 绘制机械主题背景
     */
    drawMechBackground(theme) {
        // 绘制赛博朋克网格
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x < this.width; x += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.height; y += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
        
        // 绘制科技线条
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const y = (i * 97) % this.height;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.setLineDash([10, 5]);
            this.ctx.stroke();
        }
        this.ctx.setLineDash([]);
        
        // 绘制能量核心
        this.ctx.fillStyle = 'rgba(255, 99, 71, 0.1)';
        for (let i = 0; i < 6; i++) {
            const x = (i * 133) % this.width;
            const y = (i * 149) % this.height;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 能量波纹
            this.ctx.strokeStyle = 'rgba(255, 99, 71, 0.3)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 15, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.arc(x, y, 25, 0, Math.PI * 2);
            this.ctx.stroke();
        }
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
        enemies.forEach(enemy => {
            enemy.draw(this.ctx);
        });
        
        // 绘制防御塔
        towers.forEach(tower => {
            tower.draw(this.ctx, tower === selectedTower);
            // 为选中的防御塔添加效果
            if (tower === selectedTower) {
                this.addTowerSelectionEffect(tower);
            }
        });
        
        // 绘制子弹
        bullets.forEach(bullet => {
            bullet.draw(this.ctx);
        });
    }
    
    /**
     * 添加敌人轨迹效果
     */
    addEnemyTrailEffect(enemy) {
        if (Math.random() < 0.3) {
            this.themeEffects.createBulletTrail(
                enemy.x - (enemy.lastX || enemy.x), 
                enemy.y - (enemy.lastY || enemy.y), 
                enemy.x, 
                enemy.y, 
                'trail'
            );
        }
    }
    
    /**
     * 添加防御塔选中效果
     */
    addTowerSelectionEffect(tower) {
        // 绘制发光效果
        this.ctx.save();
        this.ctx.globalAlpha = 0.3 + 0.2 * Math.sin(this.animationTime * 1.0); // 使用统一的动画时间，减慢速度
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(tower.x, tower.y, 25 + 5 * Math.sin(this.animationTime * 1.2), 0, Math.PI * 2); // 减慢脉动速度
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    /**
     * 添加子弹轨迹效果
     */
    addBulletTrailEffect(bullet) {
        if (this.currentTheme !== 'classic' && Math.random() < 0.5) {
            this.themeEffects.createBulletTrail(
                bullet.startX || bullet.x, 
                bullet.startY || bullet.y, 
                bullet.x, 
                bullet.y, 
                bullet.towerType || 'basic'
            );
        }
    }
    
    /**
     * 绘制特效
     */
    drawEffects(particles, visualEffects) {
        // 为了避免状态污染，暂时禁用主题特效
        /*
        this.ctx.save();
        this.themeEffects.render();
        this.ctx.restore();
        */
        
        // 绘制粒子效果
        particles.forEach(particle => {
            this.ctx.save();
            particle.draw(this.ctx);
            this.ctx.restore();
        });
        
        // 绘制视觉特效
        visualEffects.forEach(effect => {
            this.ctx.save();
            effect.draw(this.ctx);
            this.ctx.restore();
        });
    }
    
    /**
     * 更新渲染器
     */
    update() {
        // 更新动画时间
        this.animationTime += 0.02; // 与EntityRenderer保持一致的速度
        
        // 暂时禁用所有动态更新以避免闪烁
        /*
        // 更新主题特效
        this.themeEffects.update();
        
        // 更新地图渲染器
        this.mapRenderer.update();
        */
    }
    
    /**
     * 创建主题化爆炸效果
     */
    createExplosion(x, y, type = 'normal') {
        this.themeEffects.createExplosion(x, y, type);
    }
    
    /**
     * 创建敌人死亡特效
     */
    createDeathEffect(x, y, enemyType) {
        this.themeEffects.createDeathEffect(x, y, enemyType);
    }
    
    /**
     * 清理所有特效
     */
    clearEffects() {
        this.themeEffects.clear();
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