// 主题化地图渲染系统
export class ThemeMapRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.currentTheme = 'classic';
        this.themeConfig = null;
        this.decorations = [];
        this.backgroundPattern = null;
        
        // 初始化默认主题
        this.initializeDefaultTheme();
    }
    
    /**
     * 初始化默认主题
     */
    initializeDefaultTheme() {
        // 设置经典主题的基本配置
        this.themeConfig = {
            background: '#90EE90',
            pathColor: '#8B4513',
            pathBorderColor: '#654321'
        };
        this.generateDecorations();
        this.createBackgroundPattern();
    }
    
    /**
     * 设置当前主题
     */
    setTheme(themeName, themeConfig) {
        this.currentTheme = themeName;
        this.themeConfig = themeConfig;
        this.generateDecorations();
        this.createBackgroundPattern();
    }
    
    /**
     * 生成主题装饰元素
     */
    generateDecorations() {
        this.decorations = [];
        
        switch (this.currentTheme) {
            case 'orc':
                this.generateOrcDecorations();
                break;
            case 'mech':
                this.generateMechDecorations();
                break;
            default:
                this.generateClassicDecorations();
        }
    }
    
    /**
     * 生成兽人主题装饰
     */
    generateOrcDecorations() {
        // 树木装饰（减少数量）
        for (let i = 0; i < 12; i++) {
            this.decorations.push({
                type: 'tree',
                x: (i * 67) % this.canvas.width,
                y: (i * 89) % this.canvas.height,
                symbol: ['🌲', '🌳', '🌿'][i % 3],
                size: 15 + (i % 5) * 2,
                opacity: 0.3 + (i % 3) * 0.1,
                rotation: (i * 0.5) % (Math.PI * 2)
            });
        }
        
        // 石头和岩石（减少数量）
        for (let i = 0; i < 6; i++) {
            this.decorations.push({
                type: 'stone',
                x: (i * 113) % this.canvas.width,
                y: (i * 127) % this.canvas.height,
                symbol: ['🪨', '⛰️'][i % 2],
                size: 12 + (i % 4) * 2,
                opacity: 0.4 + (i % 2) * 0.1,
                rotation: (i * 0.7) % (Math.PI * 2)
            });
        }
        
        // 城堡和建筑（保持少量）
        for (let i = 0; i < 2; i++) {
            this.decorations.push({
                type: 'building',
                x: 100 + i * 300,
                y: 100 + i * 200,
                symbol: ['🏰', '🏛️'][i % 2],
                size: 25 + i * 5,
                opacity: 0.5,
                rotation: 0
            });
        }
    }
    
    /**
     * 生成机械主题装饰
     */
    generateMechDecorations() {
        // 暂时禁用所有装饰以解决闪烁问题
        /*
        // 未来建筑
        for (let i = 0; i < 6; i++) {
            this.decorations.push({
                type: 'building',
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                symbol: ['🏢', '🏭', '🌆'][Math.floor(Math.random() * 3)],
                size: 20 + Math.random() * 15,
                opacity: 0.2 + Math.random() * 0.2,
                rotation: 0
            });
        }
        
        // 科技设备
        for (let i = 0; i < 8; i++) {
            this.decorations.push({
                type: 'tech',
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                symbol: ['⚙️', '🔋', '📡'][Math.floor(Math.random() * 3)],
                size: 8 + Math.random() * 8,
                opacity: 0.3 + Math.random() * 0.2,
                rotation: Math.random() * Math.PI * 2
            });
        }
        */
        
        // 只保留简单的网格线
        this.decorations.push({
            type: 'grid',
            pattern: 'cyber',
            opacity: 0.05 // 降低透明度
        });
    }
    
    /**
     * 生成经典主题装饰
     */
    generateClassicDecorations() {
        // 经典主题保持简洁，不添加装饰
        // 这样可以避免不必要的特效闪烁
    }
    
    /**
     * 创建背景图案
     */
    createBackgroundPattern() {
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = 50;
        patternCanvas.height = 50;
        const patternCtx = patternCanvas.getContext('2d');
        
        switch (this.currentTheme) {
            case 'orc':
                this.createOrcPattern(patternCtx, patternCanvas);
                break;
            case 'mech':
                this.createMechPattern(patternCtx, patternCanvas);
                break;
            default:
                this.createClassicPattern(patternCtx, patternCanvas);
        }
        
        this.backgroundPattern = this.ctx.createPattern(patternCanvas, 'repeat');
    }
    
    /**
     * 创建兽人主题图案
     */
    createOrcPattern(ctx, canvas) {
        // 森林纹理
        ctx.fillStyle = '#2d5016';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 添加草地纹理（使用固定种子）
        ctx.fillStyle = '#3a6b1a';
        for (let i = 0; i < 20; i++) {
            const x = (i * 7) % canvas.width;
            const y = (i * 11) % canvas.height;
            ctx.fillRect(x, y, 2, 2);
        }
        
        // 添加土壤纹理
        ctx.fillStyle = '#4a3728';
        for (let i = 0; i < 10; i++) {
            const x = (i * 13) % canvas.width;
            const y = (i * 17) % canvas.height;
            ctx.fillRect(x, y, 1, 1);
        }
    }
    
    /**
     * 创建机械主题图案
     */
    createMechPattern(ctx, canvas) {
        // 赛博朋克背景
        ctx.fillStyle = '#0f0f23';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 添加网格线
        ctx.strokeStyle = '#2a2a3e';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let i = 0; i <= canvas.width; i += 10) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
        }
        for (let i = 0; i <= canvas.height; i += 10) {
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
        }
        ctx.stroke();
        
        // 添加光点（使用固定位置）
        ctx.fillStyle = '#00ffff';
        for (let i = 0; i < 5; i++) {
            const x = (i * 19) % canvas.width;
            const y = (i * 23) % canvas.height;
            ctx.globalAlpha = 0.3;
            ctx.fillRect(x, y, 1, 1);
        }
        ctx.globalAlpha = 1;
    }
    
    /**
     * 创建经典主题图案
     */
    createClassicPattern(ctx, canvas) {
        // 简单的草地纹理
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 添加深绿色斑点（使用固定位置）
        ctx.fillStyle = '#7db46c';
        for (let i = 0; i < 15; i++) {
            const x = (i * 17) % canvas.width;
            const y = (i * 23) % canvas.height;
            ctx.fillRect(x, y, 2, 2);
        }
    }
    
    /**
     * 渲染背景
     */
    renderBackground() {
        this.ctx.save();
        
        // 渲染背景图案
        if (this.backgroundPattern) {
            this.ctx.fillStyle = this.backgroundPattern;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            // 后备纯色背景
            this.ctx.fillStyle = this.themeConfig?.background || '#90EE90';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        this.ctx.restore();
    }
    
    /**
     * 渲染装饰元素
     */
    renderDecorations() {
        this.decorations.forEach(decoration => {
            this.ctx.save();
            
            // 重置阴影效果
            this.ctx.shadowColor = 'transparent';
            this.ctx.shadowBlur = 0;
            
            if (decoration.type === 'grid') {
                this.renderGrid(decoration);
            } else {
                this.renderDecoration(decoration);
            }
            
            this.ctx.restore();
        });
    }
    
    /**
     * 渲染单个装饰元素
     */
    renderDecoration(decoration) {
        // 设置透明度
        this.ctx.globalAlpha = decoration.opacity;
        
        // 应用变换
        this.ctx.translate(decoration.x, decoration.y);
        if (decoration.rotation) {
            this.ctx.rotate(decoration.rotation);
        }
        
        // 移除所有动画效果避免闪烁
        // 不再添加脉冲效果
        
        // 移除发光效果避免状态污染
        
        // 渲染符号
        this.ctx.font = `${decoration.size}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(decoration.symbol, 0, 0);
    }
    
    /**
     * 渲染网格
     */
    renderGrid(grid) {
        if (grid.pattern === 'cyber') {
            this.ctx.globalAlpha = grid.opacity;
            this.ctx.strokeStyle = '#00ffff';
            this.ctx.lineWidth = 0.5;
            this.ctx.beginPath();
            
            // 绘制网格线
            for (let x = 0; x <= this.canvas.width; x += 30) {
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvas.height);
            }
            for (let y = 0; y <= this.canvas.height; y += 30) {
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.canvas.width, y);
            }
            this.ctx.stroke();
        }
    }
    
    /**
     * 渲染路径
     */
    renderPath(path, pathColor, borderColor) {
        if (!path || path.length < 2) return;
        
        this.ctx.save();
        
        // 确保清理之前的样式
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.setLineDash([]);
        
        // 绘制路径边框
        this.ctx.strokeStyle = borderColor || '#4A4A4A';
        this.ctx.lineWidth = 44;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(path[0].x, path[0].y);
        
        for (let i = 1; i < path.length; i++) {
            this.ctx.lineTo(path[i].x, path[i].y);
        }
        this.ctx.stroke();
        
        // 绘制路径主体
        this.ctx.strokeStyle = pathColor || '#8B4513';
        this.ctx.lineWidth = 40;
        this.ctx.beginPath();
        this.ctx.moveTo(path[0].x, path[0].y);
        
        for (let i = 1; i < path.length; i++) {
            this.ctx.lineTo(path[i].x, path[i].y);
        }
        this.ctx.stroke();
        
        // 移除机械主题的发光效果以避免闪烁
        /*
        if (this.currentTheme === 'mech') {
            this.ctx.shadowColor = '#00ffff';
            this.ctx.shadowBlur = 3;
            this.ctx.strokeStyle = '#00ffff';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
        */
        
        this.ctx.restore();
    }
    
    /**
     * 完整渲染
     */
    render(path) {
        // 渲染背景
        this.renderBackground();
        
        // 先渲染路径（确保路径在装饰下方）
        if (path && path.length > 1 && this.themeConfig) {
            this.renderPath(path, this.themeConfig.pathColor, this.themeConfig.pathBorderColor);
        }
        
        // 渲染装饰元素（在路径上方）
        this.renderDecorations();
    }
    
    /**
     * 更新动画
     */
    update() {
        // 暂时禁用所有动画更新以避免闪烁
        // this.decorations.forEach(decoration => {
        //     if (decoration.pulse) {
        //         decoration.pulseTime = (decoration.pulseTime || 0) + 0.02;
        //     }
        // });
    }
}