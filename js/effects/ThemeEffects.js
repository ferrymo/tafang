// 主题特效系统
export class ThemeEffects {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.particles = [];
        this.backgroundEffects = [];
        this.currentTheme = 'classic';
    }
    
    /**
     * 设置当前主题
     */
    setTheme(themeName) {
        this.currentTheme = themeName;
        this.initThemeEffects();
    }
    
    /**
     * 初始化主题特效
     */
    initThemeEffects() {
        this.backgroundEffects = [];
        
        switch (this.currentTheme) {
            case 'orc':
                this.initOrcEffects();
                break;
            case 'mech':
                this.initMechEffects();
                break;
            default:
                this.initClassicEffects();
        }
    }
    
    /**
     * 初始化兽人主题特效
     */
    initOrcEffects() {
        // 添加森林背景效果
        for (let i = 0; i < 15; i++) {
            this.backgroundEffects.push({
                type: 'tree',
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                symbol: ['🌲', '🌳', '🌴'][Math.floor(Math.random() * 3)],
                scale: 0.3 + Math.random() * 0.5,
                opacity: 0.3 + Math.random() * 0.3
            });
        }
        
        // 添加石头和装饰
        for (let i = 0; i < 8; i++) {
            this.backgroundEffects.push({
                type: 'decoration',
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                symbol: ['🪨', '⛰️', '🏰'][Math.floor(Math.random() * 3)],
                scale: 0.2 + Math.random() * 0.3,
                opacity: 0.4 + Math.random() * 0.2
            });
        }
    }
    
    /**
     * 初始化机械主题特效
     */
    initMechEffects() {
        // 暂时禁用所有背景特效避免闪烁
        /*
        // 添加科技建筑背景
        for (let i = 0; i < 10; i++) {
            this.backgroundEffects.push({
                type: 'building',
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                symbol: ['🏢', '🏭', '⚙️'][Math.floor(Math.random() * 3)],
                scale: 0.2 + Math.random() * 0.4,
                opacity: 0.2 + Math.random() * 0.3
            });
        }
        
        // 添加能量粒子效果
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                type: 'energy',
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                color: ['#00ffff', '#ff6347', '#9370db'][Math.floor(Math.random() * 3)],
                size: 1 + Math.random() * 2,
                life: 1.0,
                maxLife: 60 + Math.random() * 40
            });
        }
        
        // 添加扫描线效果
        this.backgroundEffects.push({
            type: 'scanline',
            y: 0,
            speed: 2,
            opacity: 0.3
        });
        */
    }
    
    /**
     * 初始化经典主题特效
     */
    initClassicEffects() {
        // 经典主题保持简洁
        this.backgroundEffects = [];
    }
    
    /**
     * 创建主题化爆炸效果
     */
    createExplosion(x, y, type = 'normal') {
        const effectCount = type === 'heavy' ? 15 : 8;
        
        for (let i = 0; i < effectCount; i++) {
            const angle = (Math.PI * 2 * i) / effectCount;
            const speed = 2 + Math.random() * 3;
            
            let color;
            let symbol = null;
            
            switch (this.currentTheme) {
                case 'orc':
                    color = ['#ff4500', '#ffff00', '#8b4513'][Math.floor(Math.random() * 3)];
                    if (Math.random() < 0.3) symbol = '💥';
                    break;
                case 'mech':
                    color = ['#00bfff', '#ffff00', '#ff6347'][Math.floor(Math.random() * 3)];
                    if (Math.random() < 0.4) symbol = '⚡';
                    break;
                default:
                    color = '#ffd700';
            }
            
            this.particles.push({
                type: 'explosion',
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                symbol: symbol,
                size: 2 + Math.random() * 3,
                life: 1.0,
                maxLife: 20 + Math.random() * 10,
                gravity: 0.1
            });
        }
    }
    
    /**
     * 创建主题化子弹轨迹
     */
    createBulletTrail(x, y, targetX, targetY, towerType) {
        if (this.currentTheme === 'classic' || this.particles.length > 80) return;
        
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.max(2, Math.floor(distance / 20)); // 减少轨迹粒子数量
        
        for (let i = 0; i < steps; i++) {
            const progress = i / steps;
            const px = x + dx * progress;
            const py = y + dy * progress;
            
            let color, effect;
            
            switch (this.currentTheme) {
                case 'orc':
                    color = towerType === 'rapid' ? '#4169e1' : '#8b4513';
                    effect = towerType === 'rapid' ? 'magic' : 'arrow';
                    break;
                case 'mech':
                    color = ['#ff6347', '#00ffff', '#9370db'][['basic', 'rapid', 'heavy'].indexOf(towerType)] || '#ffffff';
                    effect = 'laser';
                    break;
                default:
                    return;
            }
            
            this.particles.push({
                type: 'trail',
                x: px + (Math.random() - 0.5) * 3, // 减少随机散布
                y: py + (Math.random() - 0.5) * 3,
                color: color,
                effect: effect,
                size: 0.5 + Math.random() * 0.5, // 减小粒子大小
                life: 1.0,
                maxLife: 8 + Math.random() * 7 // 减少生命周期
            });
        }
    }
    
    /**
     * 创建敌人死亡特效
     */
    createDeathEffect(x, y, enemyType) {
        let particleCount = 5;
        let colors = ['#ff0000', '#ffff00'];
        let symbols = [];
        
        switch (this.currentTheme) {
            case 'orc':
                colors = ['#8b4513', '#654321', '#ff4500'];
                symbols = ['💀', '⚔️'];
                particleCount = 8;
                break;
            case 'mech':
                colors = ['#00ffff', '#ffffff', '#c0c0c0'];
                symbols = ['⚡', '💥', '🔧'];
                particleCount = 12;
                break;
        }
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                type: 'death',
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4 - 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                symbol: symbols.length > 0 && Math.random() < 0.3 ? 
                       symbols[Math.floor(Math.random() * symbols.length)] : null,
                size: 1 + Math.random() * 2,
                life: 1.0,
                maxLife: 30 + Math.random() * 20,
                gravity: 0.15
            });
        }
    }
    
    /**
     * 更新特效系统
     */
    update() {
        // 更新粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx || 0;
            particle.y += particle.vy || 0;
            
            if (particle.gravity) {
                particle.vy += particle.gravity;
            }
            
            particle.life -= 1 / particle.maxLife;
            
            // 移除超出边界或生命值耗尽的粒子
            if (particle.life <= 0 || 
                particle.x < -50 || particle.x > this.canvas.width + 50 ||
                particle.y < -50 || particle.y > this.canvas.height + 50) {
                this.particles.splice(i, 1);
            }
        }
        
        // 更新背景特效
        this.backgroundEffects.forEach(effect => {
            if (effect.type === 'scanline') {
                effect.y += effect.speed;
                if (effect.y > this.canvas.height) {
                    effect.y = -20;
                }
            }
        });
        
        // 为机械主题添加新的能量粒子（禁用以避免闪烁）
        /*
        if (this.currentTheme === 'mech' && Math.random() < 0.01 && this.particles.length < 30) {
            this.particles.push({
                type: 'energy',
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                color: ['#00ffff', '#ff6347', '#9370db'][Math.floor(Math.random() * 3)],
                size: 1 + Math.random() * 1.5,
                life: 1.0,
                maxLife: 40 + Math.random() * 20
            });
        }
        */
        
        // 限制粒子数量防止性能问题
        if (this.particles.length > 100) {
            this.particles = this.particles.slice(-100);
        }
    }
    
    /**
     * 渲染特效
     */
    render() {
        // 渲染背景特效
        this.renderBackgroundEffects();
        
        // 渲染粒子特效
        this.renderParticles();
    }
    
    /**
     * 渲染背景特效
     */
    renderBackgroundEffects() {
        this.backgroundEffects.forEach(effect => {
            this.ctx.save();
            this.ctx.globalAlpha = effect.opacity;
            
            if (effect.type === 'scanline') {
                // 渲染扫描线
                this.ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
                this.ctx.fillRect(0, effect.y, this.canvas.width, 2);
            } else if (effect.symbol) {
                // 渲染符号装饰
                this.ctx.font = `${20 * effect.scale}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.fillText(effect.symbol, effect.x, effect.y);
            }
            
            this.ctx.restore();
        });
    }
    
    /**
     * 渲染粒子特效
     */
    renderParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            
            if (particle.symbol) {
                // 渲染符号粒子
                this.ctx.font = `${particle.size * 8}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.fillText(particle.symbol, particle.x, particle.y);
            } else {
                // 渲染普通粒子
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 为某些粒子添加发光效果
                if (particle.type === 'energy' || particle.effect === 'laser') {
                    this.ctx.shadowColor = particle.color;
                    this.ctx.shadowBlur = particle.size * 2;
                    this.ctx.fill();
                }
            }
            
            this.ctx.restore();
        });
    }
    
    /**
     * 清理所有特效
     */
    clear() {
        this.particles = [];
        this.backgroundEffects = [];
    }
}