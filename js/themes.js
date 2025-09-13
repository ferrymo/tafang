// 游戏主题配置系统
export const GAME_THEMES = {
    classic: {
        name: '经典主题',
        description: '原始的塔防游戏风格',
        background: '#90EE90',
        pathColor: '#8B4513',
        pathBorderColor: '#654321',
        
        enemies: {
            basic: {
                name: '基础敌人',
                color: '#FF6B6B',
                symbol: '●',
                description: '普通的入侵者'
            },
            fast: {
                name: '快速敌人', 
                color: '#4ECDC4',
                symbol: '▲',
                description: '敏捷的突击兵'
            },
            tank: {
                name: '坦克敌人',
                color: '#45B7D1', 
                symbol: '■',
                description: '重装甲单位'
            }
        },
        
        towers: {
            basic: {
                name: '基础塔',
                color: '#FF8A50',
                symbol: '⬢',
                description: '标准防御塔'
            },
            rapid: {
                name: '快速塔',
                color: '#50B7FF',
                symbol: '◆',
                description: '高射速塔楼'
            },
            heavy: {
                name: '重炮塔',
                color: '#A050FF',
                symbol: '⬟',
                description: '重型火炮'
            }
        },
        
        bullets: {
            basic: { color: '#FFD700', trail: false },
            rapid: { color: '#00BFFF', trail: true },
            heavy: { color: '#FF4500', trail: false }
        },
        
        effects: {
            explosion: '#FF6B35',
            hit: '#FFD700',
            upgrade: '#00FF00'
        }
    },
    
    orc: {
        name: '兽人入侵',
        description: '中世纪奇幻世界，对抗野蛮的兽人部落',
        background: '#2d5016', // 深绿色森林背景
        pathColor: '#4a3728', // 泥土路径
        pathBorderColor: '#1a1a1a',
        skyColor: '#87ceeb', // 天空颜色
        
        // 环境装饰元素
        decorations: {
            trees: ['🌲', '🌳', '🌴'], // 树木
            stones: ['🪨', '⛰️'], // 石头和山
            misc: ['🏰', '⚔️', '🛡️'] // 城堡、剑、盾
        },
        
        enemies: {
            basic: {
                name: '兽人步兵',
                color: '#8B4513',
                symbol: '👹',
                description: '使用粗糙武器的普通兽人战士',
                healthMultiplier: 1.0,
                speedMultiplier: 1.0,
                trail: { color: '#654321', particles: true }
            },
            fast: {
                name: '兽人狼骑',
                color: '#DAA520',
                symbol: '🐺',
                description: '骑着巨狼的快速突击兵',
                healthMultiplier: 0.8,
                speedMultiplier: 1.5,
                trail: { color: '#8B4513', particles: true, howl: true }
            },
            tank: {
                name: '兽人酋长',
                color: '#DC143C',
                symbol: '👺',
                description: '映着猪骨铠甲的强大酋长',
                healthMultiplier: 2.0,
                speedMultiplier: 0.7,
                trail: { color: '#8B0000', particles: true, intimidation: true }
            },
            elite: {
                name: '兽人萨满',
                color: '#4B0082',
                symbol: '🧿',
                description: '掌握黑暗魔法的邪恶萨满',
                healthMultiplier: 1.5,
                speedMultiplier: 1.2,
                trail: { color: '#301934', particles: true, magic: true, teleport: true }
            },
            boss: {
                name: '兽人酵王',
                color: '#8B0000',
                symbol: '🐉',
                description: '古老而强大的兽人首领，召唤者和统治者',
                healthMultiplier: 5.0,
                speedMultiplier: 0.8,
                trail: { color: '#8B0000', particles: true, aura: true, summon: true }
            }
        },
        
        towers: {
            basic: {
                name: '精灵弓箭手',
                color: '#228B22',
                symbol: '🏹',
                description: '精准的精灵弓箭手，擅长远程射击',
                projectile: '➢', // 箭头
                attackEffect: 'arrow',
                upgradeEffect: 'nature'
            },
            rapid: {
                name: '魔法奥术塔',
                color: '#4169E1',
                symbol: '🔮',
                description: '施放奥术魔法的高频攻击塔',
                projectile: '✨', // 闪烁
                attackEffect: 'magic',
                upgradeEffect: 'arcane'
            },
            heavy: {
                name: '矮人火炮',
                color: '#B8860B',
                symbol: '💥',
                description: '矮人工匠制作的重型攻城火炮',
                projectile: '💣', // 炸弹
                attackEffect: 'explosion',
                upgradeEffect: 'forge'
            },
            special: {
                name: '圣骑士塔',
                color: '#FFD700',
                symbol: '⚔️',
                description: '圣洁的圣骑士，可以治疗和净化',
                projectile: '✨',
                attackEffect: 'holy',
                upgradeEffect: 'divine'
            }
        },
        
        bullets: {
            basic: { color: '#8B4513', trail: true, effect: 'arrow' },
            rapid: { color: '#4169E1', trail: true, effect: 'magic' },
            heavy: { color: '#FF4500', trail: false, effect: 'explosion' },
            special: { color: '#FFD700', trail: true, effect: 'holy' }
        },
        
        effects: {
            explosion: '#FF4500',
            hit: '#FFD700',
            upgrade: '#32CD32',
            magic: '#8A2BE2',
            arrow: '#8B4513',
            holy: '#FFD700',
            nature: '#228B22',
            arcane: '#4B0082',
            forge: '#B8860B',
            divine: '#FFFFE0'
        },
        
        // 环境音效
        sounds: {
            ambient: 'forest',
            enemyHit: 'grunt',
            towerAttack: 'bowstring',
            explosion: 'boom'
        }
    },
    
    mech: {
        name: '机械战争',
        description: '未来赛博朋克世界，对抗AI机器人军团',
        background: '#0f0f23', // 深空背景
        pathColor: '#2a2a3e', // 金属路径
        pathBorderColor: '#00ffff', // 青色边框
        skyColor: '#191932', // 夜空
        
        // 环境装饰元素
        decorations: {
            structures: ['🏢', '🏭', '⚙️'], // 建筑物
            tech: ['📰', '🔋', '⚡'], // 科技设备
            energy: ['🔆', '🔭', '✨'] // 能量效果
        },
        
        enemies: {
            basic: {
                name: '侦察无人机',
                color: '#C0C0C0',
                symbol: '🤖',
                description: '轻型侦察机器人，速度快但装甲薄弱',
                healthMultiplier: 0.8,
                speedMultiplier: 1.2,
                trail: { color: '#00ffff', particles: true, electric: true }
            },
            fast: {
                name: '突击攻击机',
                color: '#00CED1',
                symbol: '🚁',
                description: '高速飞行攻击机，可以迅速机动',
                healthMultiplier: 0.6,
                speedMultiplier: 2.0,
                trail: { color: '#00bfff', particles: true, boost: true }
            },
            tank: {
                name: '重型战斗机甲',
                color: '#4682B4',
                symbol: '🦾',
                description: '装甲厚重的战斗机甲，移动缓慢但生命值极高',
                healthMultiplier: 3.0,
                speedMultiplier: 0.5,
                trail: { color: '#4682b4', particles: true, heavy: true }
            },
            elite: {
                name: '隐形暗杀者',
                color: '#9370DB',
                symbol: '🕵️',
                description: '具有隐身能力的高级暗杀机器人',
                healthMultiplier: 1.5,
                speedMultiplier: 1.5,
                trail: { color: '#9370db', particles: true, stealth: true, cloak: true }
            },
            boss: {
                name: 'AI母舰',
                color: '#ff0080',
                symbol: '🛸',
                description: '巨型战斗母舰，搭载着先进的AI系统',
                healthMultiplier: 8.0,
                speedMultiplier: 0.6,
                trail: { color: '#ff0080', particles: true, shield: true, repair: true }
            }
        },
        
        towers: {
            basic: {
                name: '脉冲激光炮',
                color: '#FF6347',
                symbol: '⚡',
                description: '基础能量武器，发射高能激光',
                projectile: '⚡', // 闪电
                attackEffect: 'laser',
                upgradeEffect: 'energy'
            },
            rapid: {
                name: '等离子加速器',
                color: '#00FFFF',
                symbol: '💫',
                description: '高频率等离子武器系统',
                projectile: '✨', // 等离子
                attackEffect: 'plasma',
                upgradeEffect: 'quantum'
            },
            heavy: {
                name: '轨道破坏炮',
                color: '#9370DB',
                symbol: '🔥',
                description: '超重型轨道动能武器',
                projectile: '💥', // 爆炸
                attackEffect: 'railgun',
                upgradeEffect: 'antimatter'
            },
            special: {
                name: 'EMP干扰塔',
                color: '#ffff00',
                symbol: '🔋',
                description: '电磁脉冲干扰器，可以缓解敌人',
                projectile: '⚡',
                attackEffect: 'emp',
                upgradeEffect: 'overload'
            }
        },
        
        bullets: {
            basic: { color: '#FF6347', trail: true, effect: 'laser', glow: true },
            rapid: { color: '#00FFFF', trail: true, effect: 'plasma', glow: true },
            heavy: { color: '#9370DB', trail: true, effect: 'railgun', glow: true },
            special: { color: '#ffff00', trail: true, effect: 'emp', glow: true }
        },
        
        effects: {
            explosion: '#00BFFF',
            hit: '#FFFF00',
            upgrade: '#00FF7F',
            laser: '#FF6347',
            plasma: '#00FFFF',
            railgun: '#9370DB',
            emp: '#ffff00',
            energy: '#ff4500',
            quantum: '#00ced1',
            antimatter: '#8a2be2',
            overload: '#ffd700'
        },
        
        // 环境音效
        sounds: {
            ambient: 'cyberpunk',
            enemyHit: 'electric',
            towerAttack: 'laser',
            explosion: 'digital'
        },
        
        // 特殊效果
        specialEffects: {
            glitch: true, // 故障效果
            scanlines: true, // 扫描线
            energyField: true, // 能量场
            hologram: true // 全息效果
        }
    }
};

// 主题管理器
export class ThemeManager {
    constructor() {
        this.currentTheme = 'classic';
        this.themes = GAME_THEMES;
        this.listeners = [];
    }
    
    /**
     * 设置当前主题
     */
    setTheme(themeName) {
        if (this.themes[themeName]) {
            this.currentTheme = themeName;
            this.notifyListeners();
            this.saveTheme();
        }
    }
    
    /**
     * 获取当前主题
     */
    getCurrentTheme() {
        return this.themes[this.currentTheme];
    }
    
    /**
     * 获取当前主题名称
     */
    getCurrentThemeName() {
        return this.currentTheme;
    }
    
    /**
     * 获取所有可用主题
     */
    getAllThemes() {
        return Object.keys(this.themes).map(key => ({
            key,
            name: this.themes[key].name,
            description: this.themes[key].description
        }));
    }
    
    /**
     * 添加主题变更监听器
     */
    addThemeChangeListener(callback) {
        this.listeners.push(callback);
    }
    
    /**
     * 移除主题变更监听器
     */
    removeThemeChangeListener(callback) {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }
    
    /**
     * 通知所有监听器主题已变更
     */
    notifyListeners() {
        const theme = this.getCurrentTheme();
        this.listeners.forEach(callback => {
            callback(theme, this.currentTheme);
        });
    }
    
    /**
     * 保存主题设置到本地存储
     */
    saveTheme() {
        try {
            localStorage.setItem('towerDefenseTheme', this.currentTheme);
        } catch (error) {
            console.warn('无法保存主题设置:', error);
        }
    }
    
    /**
     * 从本地存储加载主题设置
     */
    loadTheme() {
        try {
            const savedTheme = localStorage.getItem('towerDefenseTheme');
            if (savedTheme && this.themes[savedTheme]) {
                this.currentTheme = savedTheme;
            }
        } catch (error) {
            console.warn('无法加载主题设置:', error);
        }
    }
    
    /**
     * 获取主题化的实体配置
     */
    getThemedEntityConfig(entityType, subType) {
        const theme = this.getCurrentTheme();
        return theme[entityType] && theme[entityType][subType] ? 
               theme[entityType][subType] : null;
    }
    
    /**
     * 获取主题化的颜色
     */
    getThemedColor(category, type) {
        const theme = this.getCurrentTheme();
        if (category === 'background') return theme.background;
        if (category === 'path') return theme.pathColor;
        if (category === 'pathBorder') return theme.pathBorderColor;
        
        return theme[category] && theme[category][type] ? 
               theme[category][type] : '#FFFFFF';
    }
}

// 创建全局主题管理器实例
export const themeManager = new ThemeManager();