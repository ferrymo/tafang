// UI管理器
import { themeManager } from '../themes.js';
import { settingsManager } from '../settings.js';

export class UIManager {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
    }
    
    /**
     * 初始化UI元素引用
     */
    initializeElements() {
        this.elements = {
            health: document.getElementById('health'),
            money: document.getElementById('money'),
            wave: document.getElementById('wave'),
            score: document.getElementById('score'),
            startWave: document.getElementById('startWave'),
            pauseGame: document.getElementById('pauseGame'),
            restartGame: document.getElementById('restartGame'),
            upgradeTower: document.getElementById('upgradeTower'),
            sellTower: document.getElementById('sellTower'),
            restartFromModal: document.getElementById('restartFromModal'),
            towerUpgrade: document.getElementById('towerUpgrade'),
            gameOver: document.getElementById('gameOver'),
            gameOverTitle: document.getElementById('gameOverTitle'),
            gameOverMessage: document.getElementById('gameOverMessage'),
            finalScore: document.getElementById('finalScore'),
            towerLevel: document.getElementById('towerLevel'),
            towerDamage: document.getElementById('towerDamage'),
            towerRange: document.getElementById('towerRange'),
            towerButtons: document.querySelectorAll('.tower-btn')
        };
    }
    
    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 这个方法会在Game类中调用，传入回调函数
    }
    
    /**
     * 更新游戏状态显示
     */
    updateGameStats(health, money, wave, score) {
        this.elements.health.textContent = health;
        this.elements.money.textContent = money;
        this.elements.wave.textContent = wave;
        this.elements.score.textContent = score;
    }
    
    /**
     * 更新防御塔按钮状态
     */
    updateTowerButtons(currentMoney) {
        this.elements.towerButtons.forEach(btn => {
            const cost = parseInt(btn.dataset.cost);
            const towerType = btn.dataset.tower;
            
            // 禁用/启用按钮
            btn.disabled = currentMoney < cost;
            
            // 更新主题化的显示名称
            const themeConfig = themeManager.getThemedEntityConfig('towers', towerType);
            if (themeConfig) {
                const towerInfo = btn.querySelector('.tower-info div:first-child');
                if (towerInfo) {
                    towerInfo.textContent = themeConfig.name;
                }
                
                // 更新工具提示
                btn.title = themeConfig.description;
                
                // 更新防御塔图标
                const towerIcon = btn.querySelector('.tower-icon');
                if (towerIcon && themeConfig.symbol) {
                    towerIcon.textContent = themeConfig.symbol;
                    towerIcon.style.color = 'white';
                    towerIcon.style.textShadow = '1px 1px 2px rgba(0,0,0,0.5)';
                }
            }
        });
    }
    
    /**
     * 显示防御塔升级面板
     */
    showTowerUpgrade(tower, canAffordUpgrade) {
        this.elements.towerUpgrade.style.display = 'block';
        this.elements.towerLevel.textContent = tower.level;
        this.elements.towerDamage.textContent = tower.damage;
        this.elements.towerRange.textContent = Math.round(tower.range);
        
        const upgradeCost = tower.getUpgradeCost();
        this.elements.upgradeTower.textContent = `升级 (${upgradeCost}金币)`;
        this.elements.upgradeTower.disabled = !canAffordUpgrade;
    }
    
    /**
     * 隐藏防御塔升级面板
     */
    hideTowerUpgrade() {
        this.elements.towerUpgrade.style.display = 'none';
    }
    
    /**
     * 显示游戏结束模态框
     */
    showGameOver(victory, finalScore) {
        const modal = this.elements.gameOver;
        const title = this.elements.gameOverTitle;
        const message = this.elements.gameOverMessage;
        const scoreElement = this.elements.finalScore;
        
        if (victory) {
            title.textContent = '恭喜胜利！';
            message.innerHTML = '你成功守护了基地！最终得分是: ';
        } else {
            title.textContent = '游戏结束';
            message.innerHTML = '基地被摧毁了！最终得分是: ';
        }
        
        scoreElement.textContent = finalScore;
        modal.style.display = 'flex';
    }
    
    /**
     * 隐藏游戏结束模态框
     */
    hideGameOver() {
        this.elements.gameOver.style.display = 'none';
    }
    
    /**
     * 更新暂停按钮文本
     */
    updatePauseButton(isPaused) {
        this.elements.pauseGame.textContent = isPaused ? '继续游戏' : '暂停游戏';
    }
    
    /**
     * 清除防御塔选中状态
     */
    clearTowerSelection() {
        this.elements.towerButtons.forEach(btn => {
            btn.classList.remove('selected');
        });
    }
    
    /**
     * 设置防御塔选中状态
     */
    setTowerSelection(towerType) {
        this.clearTowerSelection();
        const selectedBtn = document.querySelector(`[data-tower=\"${towerType}\"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
    }
    
    /**
     * 显示提示信息
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // 添加样式
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: '10000',
            animation: 'slideInRight 0.3s ease-out',
            backgroundColor: type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3'
        });
        
        document.body.appendChild(toast);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }
        }, 3000);
    }
    
    /**
     * 添加键盘快捷键提示
     */
    addKeyboardHints() {
        const hints = document.createElement('div');
        hints.className = 'keyboard-hints';
        hints.innerHTML = `
            <div class="hint-title">快捷键:</div>
            <div class="hint-item"><kbd>Space</kbd> 暂停/继续</div>
            <div class="hint-item"><kbd>R</kbd> 重新开始</div>
            <div class="hint-item"><kbd>Esc</kbd> 取消选择</div>
        `;
        
        // 添加样式
        Object.assign(hints.style, {
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            padding: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            borderRadius: '6px',
            fontSize: '12px',
            lineHeight: '1.5'
        });
        
        document.body.appendChild(hints);
    }
    
    /**
     * 创建控制面板弹框
     */
    createSettingsModal() {
        const modal = document.createElement('div');
        modal.id = 'settingsModal';
        modal.className = 'settings-modal';
        modal.style.display = 'none';
        
        modal.innerHTML = `
            <div class="settings-content">
                <div class="settings-header">
                    <h2>⚙️ 游戏控制面板</h2>
                    <button id="closeSettings" class="close-btn">&times;</button>
                </div>
                
                <div class="settings-body">
                    <!-- 主题设置 -->
                    <div class="setting-group">
                        <h3>🎨 主题设置</h3>
                        <div class="theme-grid">
                            <div class="theme-card" data-theme="classic">
                                <div class="theme-preview classic-preview"></div>
                                <h4>🏰 经典主题</h4>
                                <p>传统的塔防游戏风格</p>
                            </div>
                            <div class="theme-card" data-theme="orc">
                                <div class="theme-preview orc-preview"></div>
                                <h4>👹 兽人入侵</h4>
                                <p>中世纪奇幻世界</p>
                            </div>
                            <div class="theme-card" data-theme="mech">
                                <div class="theme-preview mech-preview"></div>
                                <h4>🤖 机械战争</h4>
                                <p>未来科技世界</p>
                            </div>
                        </div>
                    </div>

                    <!-- 游戏设置 -->
                    <div class="setting-group">
                        <h3>🎮 游戏设置</h3>
                        <div class="setting-item">
                            <label for="gameSpeed">游戏速度:</label>
                            <input type="range" id="gameSpeed" min="0.5" max="2" step="0.1" value="1">
                            <span id="gameSpeedValue">1.0x</span>
                        </div>
                        <div class="setting-item">
                            <label for="soundVolume">音效音量:</label>
                            <input type="range" id="soundVolume" min="0" max="100" step="5" value="50">
                            <span id="soundVolumeValue">50%</span>
                        </div>
                        <div class="setting-item">
                            <label for="showFPS">显示FPS:</label>
                            <input type="checkbox" id="showFPS">
                        </div>
                        <div class="setting-item">
                            <label for="enableParticles">粒子特效:</label>
                            <input type="checkbox" id="enableParticles" checked>
                        </div>
                    </div>

                    <!-- 难度设置 -->
                    <div class="setting-group">
                        <h3>🎯 难度设置</h3>
                        <div class="difficulty-buttons">
                            <button class="difficulty-btn" data-difficulty="easy">😊 简单</button>
                            <button class="difficulty-btn active" data-difficulty="normal">😐 普通</button>
                            <button class="difficulty-btn" data-difficulty="hard">😤 困难</button>
                        </div>
                        <div class="difficulty-description">
                            <p id="difficultyDesc">标准的游戏雾度，适合大部分玩家</p>
                        </div>
                    </div>

                    <!-- 控制设置 -->
                    <div class="setting-group">
                        <h3>🎹 控制设置</h3>
                        <div class="control-info">
                            <div class="control-item">
                                <kbd>Space</kbd> 暂停/继续游戏
                            </div>
                            <div class="control-item">
                                <kbd>R</kbd> 重新开始游戏
                            </div>
                            <div class="control-item">
                                <kbd>ESC</kbd> 取消当前选择
                            </div>
                            <div class="control-item">
                                <kbd>1-3</kbd> 快速选择防御塔
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings-footer">
                    <button id="resetSettings" class="action-btn reset-btn">重置设置</button>
                    <button id="applySettings" class="action-btn apply-btn">应用设置</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }
    
    /**
     * 显示设置面板
     */
    showSettingsModal() {
        let modal = document.getElementById('settingsModal');
        if (!modal) {
            modal = this.createSettingsModal();
            this.setupSettingsModalEvents(modal);
        }
        
        modal.style.display = 'flex';
        this.updateSettingsUI();
        
        // 添加显示动画
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
    
    /**
     * 隐藏设置面板
     */
    hideSettingsModal() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }
    
    /**
     * 设置设置面板事件监听器
     */
    setupSettingsModalEvents(modal) {
        // 关闭按钮
        const closeBtn = modal.querySelector('#closeSettings');
        closeBtn.addEventListener('click', () => this.hideSettingsModal());
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideSettingsModal();
            }
        });
        
        // 主题卡片点击
        modal.querySelectorAll('.theme-card').forEach(card => {
            card.addEventListener('click', () => {
                const theme = card.dataset.theme;
                themeManager.setTheme(theme);
                this.updateThemeCards();
                this.showToast(`主题已切换为: ${themeManager.getCurrentTheme().name}`, 'success');
            });
        });
        
        // 游戏设置滑块和复选框
        this.setupGameSettingsEvents(modal);
        
        // 难度按钮
        modal.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const difficulty = btn.dataset.difficulty;
                settingsManager.setSetting('difficulty', difficulty);
                this.updateDifficultyButtons();
                this.updateDifficultyDescription();
                this.showToast(`雾度已设置为: ${settingsManager.getDifficultyConfig(difficulty).name}`, 'info');
            });
        });
        
        // 重置设置
        const resetBtn = modal.querySelector('#resetSettings');
        resetBtn.addEventListener('click', () => {
            settingsManager.resetToDefaults();
            this.updateSettingsUI();
            this.showToast('设置已重置为默认值', 'info');
        });
        
        // 应用设置
        const applyBtn = modal.querySelector('#applySettings');
        applyBtn.addEventListener('click', () => {
            this.hideSettingsModal();
            this.showToast('设置已应用', 'success');
        });
    }
    
    /**
     * 设置游戏设置事件监听器
     */
    setupGameSettingsEvents(modal) {
        // 游戏速度
        const gameSpeedSlider = modal.querySelector('#gameSpeed');
        const gameSpeedValue = modal.querySelector('#gameSpeedValue');
        gameSpeedSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            settingsManager.setSetting('gameSpeed', value);
            gameSpeedValue.textContent = value.toFixed(1) + 'x';
        });
        
        // 音效音量
        const soundVolumeSlider = modal.querySelector('#soundVolume');
        const soundVolumeValue = modal.querySelector('#soundVolumeValue');
        soundVolumeSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            settingsManager.setSetting('soundVolume', value);
            soundVolumeValue.textContent = value + '%';
        });
        
        // FPS显示
        const showFPSCheckbox = modal.querySelector('#showFPS');
        showFPSCheckbox.addEventListener('change', (e) => {
            settingsManager.setSetting('showFPS', e.target.checked);
        });
        
        // 粒子特效
        const enableParticlesCheckbox = modal.querySelector('#enableParticles');
        enableParticlesCheckbox.addEventListener('change', (e) => {
            settingsManager.setSetting('enableParticles', e.target.checked);
        });
    }
    
    /**
     * 更新设置UI
     */
    updateSettingsUI() {
        this.updateThemeCards();
        this.updateGameSettingsUI();
        this.updateDifficultyButtons();
        this.updateDifficultyDescription();
    }
    
    /**
     * 更新主题卡片
     */
    updateThemeCards() {
        const modal = document.getElementById('settingsModal');
        if (!modal) return;
        
        const currentTheme = themeManager.getCurrentThemeName();
        modal.querySelectorAll('.theme-card').forEach(card => {
            card.classList.toggle('active', card.dataset.theme === currentTheme);
        });
    }
    
    /**
     * 更新游戏设置UI
     */
    updateGameSettingsUI() {
        const modal = document.getElementById('settingsModal');
        if (!modal) return;
        
        const settings = settingsManager.getAllSettings();
        
        // 游戏速度
        const gameSpeedSlider = modal.querySelector('#gameSpeed');
        const gameSpeedValue = modal.querySelector('#gameSpeedValue');
        if (gameSpeedSlider && gameSpeedValue) {
            gameSpeedSlider.value = settings.gameSpeed;
            gameSpeedValue.textContent = settings.gameSpeed.toFixed(1) + 'x';
        }
        
        // 音效音量
        const soundVolumeSlider = modal.querySelector('#soundVolume');
        const soundVolumeValue = modal.querySelector('#soundVolumeValue');
        if (soundVolumeSlider && soundVolumeValue) {
            soundVolumeSlider.value = settings.soundVolume;
            soundVolumeValue.textContent = settings.soundVolume + '%';
        }
        
        // FPS显示
        const showFPSCheckbox = modal.querySelector('#showFPS');
        if (showFPSCheckbox) {
            showFPSCheckbox.checked = settings.showFPS;
        }
        
        // 粒子特效
        const enableParticlesCheckbox = modal.querySelector('#enableParticles');
        if (enableParticlesCheckbox) {
            enableParticlesCheckbox.checked = settings.enableParticles;
        }
    }
    
    /**
     * 更新雾度按钮
     */
    updateDifficultyButtons() {
        const modal = document.getElementById('settingsModal');
        if (!modal) return;
        
        const currentDifficulty = settingsManager.getSetting('difficulty');
        modal.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.difficulty === currentDifficulty);
        });
    }
    
    /**
     * 更新雾度描述
     */
    updateDifficultyDescription() {
        const modal = document.getElementById('settingsModal');
        if (!modal) return;
        
        const currentDifficulty = settingsManager.getSetting('difficulty');
        const config = settingsManager.getDifficultyConfig(currentDifficulty);
        const descElement = modal.querySelector('#difficultyDesc');
        if (descElement && config) {
            descElement.textContent = config.description;
        }
    }
}