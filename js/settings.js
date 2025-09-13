// 游戏设置管理器
export class SettingsManager {
    constructor() {
        this.settings = {
            gameSpeed: 1.0,
            soundVolume: 50,
            showFPS: false,
            enableParticles: true,
            difficulty: 'normal'
        };
        
        this.difficulties = {
            easy: {
                name: '简单',
                description: '敌人血量减少25%，移动速度减少20%，适合新手玩家',
                enemyHealthMultiplier: 0.75,
                enemySpeedMultiplier: 0.8,
                waveInterval: 1200
            },
            normal: {
                name: '普通',
                description: '标准的游戏难度，适合大部分玩家',
                enemyHealthMultiplier: 1.0,
                enemySpeedMultiplier: 1.0,
                waveInterval: 1000
            },
            hard: {
                name: '困难',
                description: '敌人血量增加50%，移动速度增加30%，挑战高手',
                enemyHealthMultiplier: 1.5,
                enemySpeedMultiplier: 1.3,
                waveInterval: 800
            }
        };
        
        this.listeners = [];
        this.loadSettings();
    }
    
    /**
     * 获取设置值
     */
    getSetting(key) {
        return this.settings[key];
    }
    
    /**
     * 设置值
     */
    setSetting(key, value) {
        this.settings[key] = value;
        this.notifyListeners(key, value);
        this.saveSettings();
    }
    
    /**
     * 获取所有设置
     */
    getAllSettings() {
        return { ...this.settings };
    }
    
    /**
     * 重置所有设置到默认值
     */
    resetToDefaults() {
        this.settings = {
            gameSpeed: 1.0,
            soundVolume: 50,
            showFPS: false,
            enableParticles: true,
            difficulty: 'normal'
        };
        this.saveSettings();
        this.notifyListeners('reset', this.settings);
    }
    
    /**
     * 获取难度配置
     */
    getDifficultyConfig(difficulty = null) {
        const diff = difficulty || this.settings.difficulty;
        return this.difficulties[diff] || this.difficulties.normal;
    }
    
    /**
     * 获取所有难度选项
     */
    getAllDifficulties() {
        return Object.keys(this.difficulties).map(key => ({
            key,
            ...this.difficulties[key]
        }));
    }
    
    /**
     * 添加设置变更监听器
     */
    addSettingsChangeListener(callback) {
        this.listeners.push(callback);
    }
    
    /**
     * 移除设置变更监听器
     */
    removeSettingsChangeListener(callback) {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }
    
    /**
     * 通知所有监听器设置已变更
     */
    notifyListeners(key, value) {
        this.listeners.forEach(callback => {
            callback(key, value, this.settings);
        });
    }
    
    /**
     * 保存设置到本地存储
     */
    saveSettings() {
        try {
            localStorage.setItem('towerDefenseSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('无法保存游戏设置:', error);
        }
    }
    
    /**
     * 从本地存储加载设置
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('towerDefenseSettings');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.settings = { ...this.settings, ...parsed };
            }
        } catch (error) {
            console.warn('无法加载游戏设置:', error);
        }
    }
    
    /**
     * 应用游戏速度设置
     */
    applyGameSpeed(deltaTime) {
        return deltaTime * this.settings.gameSpeed;
    }
    
    /**
     * 检查是否启用粒子效果
     */
    shouldShowParticles() {
        return this.settings.enableParticles;
    }
    
    /**
     * 检查是否显示FPS
     */
    shouldShowFPS() {
        return this.settings.showFPS;
    }
    
    /**
     * 获取音效音量（0-1）
     */
    getSoundVolume() {
        return this.settings.soundVolume / 100;
    }
}

// 创建全局设置管理器实例
export const settingsManager = new SettingsManager();