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
        description: '对抗野蛮的兽人部落',
        background: '#8FBC8F',
        pathColor: '#654321',
        pathBorderColor: '#4A4A4A',
        
        enemies: {
            basic: {
                name: '兽人战士',
                color: '#8B4513',
                symbol: '👹',
                description: '凶猛的兽人战士'
            },
            fast: {
                name: '兽人狼骑',
                color: '#DAA520',
                symbol: '🐺',
                description: '骑着恶狼的突击兵'
            },
            tank: {
                name: '兽人酋长',
                color: '#DC143C',
                symbol: '👺',
                description: '强大的兽人酋长'
            }
        },
        
        towers: {
            basic: {
                name: '弓箭塔',
                color: '#8B4513',
                symbol: '🏹',
                description: '精灵弓箭手塔'
            },
            rapid: {
                name: '魔法塔',
                color: '#4169E1',
                symbol: '🔮',
                description: '施法者之塔'
            },
            heavy: {
                name: '投石机',
                color: '#708090',
                symbol: '⚔️',
                description: '重型攻城器械'
            }
        },
        
        bullets: {
            basic: { color: '#8B4513', trail: false },
            rapid: { color: '#4169E1', trail: true },
            heavy: { color: '#696969', trail: false }
        },
        
        effects: {
            explosion: '#FF4500',
            hit: '#FFD700',
            upgrade: '#32CD32'
        }
    },
    
    mech: {
        name: '机械战争',
        description: '未来科技对抗机器人军团',
        background: '#2F4F4F',
        pathColor: '#708090',
        pathBorderColor: '#4A4A4A',
        
        enemies: {
            basic: {
                name: '侦察机器人',
                color: '#C0C0C0',
                symbol: '🤖',
                description: '基础战斗单位'
            },
            fast: {
                name: '突击无人机',
                color: '#00CED1',
                symbol: '🚁',
                description: '高速飞行单位'
            },
            tank: {
                name: '重型机甲',
                color: '#4682B4',
                symbol: '🦾',
                description: '装甲机械巨兽'
            }
        },
        
        towers: {
            basic: {
                name: '激光炮',
                color: '#FF6347',
                symbol: '⚡',
                description: '能量武器系统'
            },
            rapid: {
                name: '等离子炮',
                color: '#00FFFF',
                symbol: '💫',
                description: '高频能量武器'
            },
            heavy: {
                name: '轨道炮',
                color: '#9370DB',
                symbol: '🔥',
                description: '超重型轨道武器'
            }
        },
        
        bullets: {
            basic: { color: '#FF6347', trail: true },
            rapid: { color: '#00FFFF', trail: true },
            heavy: { color: '#9370DB', trail: true }
        },
        
        effects: {
            explosion: '#00BFFF',
            hit: '#FFFF00',
            upgrade: '#00FF7F'
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