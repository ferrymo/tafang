// UI管理器
import { themeManager } from '../themes.js';

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
}