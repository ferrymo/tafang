import { GAME_CONFIG } from './config.js';
import { GameUtils } from './utils.js';
import { Enemy } from './entities/Enemy.js';
import { Tower } from './entities/Tower.js';
import { Bullet } from './entities/Bullet.js';
import { Particle } from './effects/Particle.js';
import { VisualEffect } from './effects/VisualEffect.js';
import { GameRenderer } from './managers/GameRenderer.js';
import { UIManager } from './managers/UIManager.js';
import { themeManager } from './themes.js';
import { settingsManager } from './settings.js';

// 主游戏类
export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // 初始化管理器
        this.renderer = new GameRenderer(this.canvas, this.ctx);
        this.uiManager = new UIManager();
        
        // 加载并设置主题
        themeManager.loadTheme();
        console.log('当前主题:', themeManager.getCurrentThemeName(), themeManager.getCurrentTheme());
        
        themeManager.addThemeChangeListener(() => {
            // 主题变更时重新渲染
            console.log('主题已切换为:', themeManager.getCurrentThemeName());
            this.render();
        });
        
        // 游戏状态
        this.isRunning = false;
        this.isPaused = false;
        this.gameOver = false;
        
        // 游戏数据
        this.health = GAME_CONFIG.INITIAL_HEALTH;
        this.money = GAME_CONFIG.INITIAL_MONEY;
        this.wave = GAME_CONFIG.INITIAL_WAVE;
        this.score = 0;
        
        // 渲染调试标志
        this.renderDebugLogged = false;
        
        // 游戏对象数组
        this.enemies = [];
        this.towers = [];
        this.bullets = [];
        this.particles = [];
        this.visualEffects = [];
        
        // 选中状态
        this.selectedTowerType = null;
        this.selectedTower = null;
        
        // 波次管理
        this.currentWaveEnemies = 0;
        this.waveInProgress = false;
        this.waveTimer = null;
        
        this.init();
    }
    
    init() {
        console.log('Game init: enemies初始状态:', this.enemies);
        
        try {
            console.log('正在设置事件监听器...');
            this.setupEventListeners();
            
            console.log('正在更新UI...');
            this.updateUI();
            
            console.log('Game init完成，enemies状态:', this.enemies);
            console.log('延迟启动游戏循环...');
            
            // 延迟启动游戏循环以确保所有初始化完成
            setTimeout(() => {
                console.log('启动游戏循环，enemies状态:', this.enemies);
                this.gameLoop();
            }, 100);
            
        } catch (error) {
            console.error('Game初始化失败:', error);
            throw error;
        }
    }
    
    setupEventListeners() {
        // 防御塔选择
        this.uiManager.elements.towerButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectTowerType(btn.dataset.tower, parseInt(btn.dataset.cost));
            });
        });
        
        // 画布点击
        this.canvas.addEventListener('click', (e) => {
            this.handleCanvasClick(e);
        });
        
        // 控制按钮
        this.uiManager.elements.startWave.addEventListener('click', () => this.startWave());
        this.uiManager.elements.pauseGame.addEventListener('click', () => this.togglePause());
        this.uiManager.elements.restartGame.addEventListener('click', () => this.restart());
        this.uiManager.elements.upgradeTower.addEventListener('click', () => this.upgradeTower());
        this.uiManager.elements.sellTower.addEventListener('click', () => this.sellTower());
        this.uiManager.elements.restartFromModal.addEventListener('click', () => this.restart());
        
        // 控制面板按钮
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.uiManager.showSettingsModal());
        }
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
    }
    
    handleKeyPress(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePause();
                break;
            case 'KeyR':
                this.restart();
                break;
            case 'Escape':
                this.selectedTowerType = null;
                this.selectedTower = null;
                this.uiManager.clearTowerSelection();
                this.uiManager.hideTowerUpgrade();
                // 关闭控制面板
                this.uiManager.hideSettingsModal();
                break;
            case 'Digit1':
                this.selectTowerByIndex(0);
                break;
            case 'Digit2':
                this.selectTowerByIndex(1);
                break;
            case 'Digit3':
                this.selectTowerByIndex(2);
                break;
        }
    }
    
    selectTowerType(type, cost) {
        if (this.money >= cost) {
            this.selectedTowerType = {type, cost};
            this.uiManager.setTowerSelection(type);
        } else {
            this.uiManager.showToast('金币不足！', 'error');
        }
    }
    
    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const clickedTower = this.towers.find(tower => {
            return GameUtils.isPointInCircle({x, y}, tower, tower.size);
        });
        
        if (clickedTower) {
            this.selectTower(clickedTower);
        } else if (this.selectedTowerType) {
            this.placeTower(x, y);
        } else {
            // 取消选择
            this.selectedTower = null;
            this.uiManager.hideTowerUpgrade();
        }
    }
    
    placeTower(x, y) {
        if (this.isValidTowerPosition(x, y)) {
            const tower = new Tower(x, y, this.selectedTowerType.type);
            this.towers.push(tower);
            this.money -= this.selectedTowerType.cost;
            this.selectedTowerType = null;
            
            this.uiManager.clearTowerSelection();
            this.updateUI();
            this.uiManager.showToast('防御塔建造成功！', 'success');
        } else {
            this.uiManager.showToast('无法在此位置建造防御塔！', 'error');
        }
    }
    
    isValidTowerPosition(x, y) {
        // 检查边界
        if (x < GAME_CONFIG.CONSTANTS.TOWER_PLACEMENT_MARGIN || 
            x > this.width - GAME_CONFIG.CONSTANTS.TOWER_PLACEMENT_MARGIN ||
            y < GAME_CONFIG.CONSTANTS.TOWER_PLACEMENT_MARGIN || 
            y > this.height - GAME_CONFIG.CONSTANTS.TOWER_PLACEMENT_MARGIN) {
            return false;
        }
        
        // 检查路径
        for (let i = 0; i < GAME_CONFIG.GAME_PATH.length - 1; i++) {
            const pathSegment = {
                x1: GAME_CONFIG.GAME_PATH[i].x,
                y1: GAME_CONFIG.GAME_PATH[i].y,
                x2: GAME_CONFIG.GAME_PATH[i + 1].x,
                y2: GAME_CONFIG.GAME_PATH[i + 1].y
            };
            
            if (GameUtils.distanceToLineSegment(x, y, pathSegment) < GAME_CONFIG.CONSTANTS.PATH_COLLISION_DISTANCE) {
                return false;
            }
        }
        
        // 检查与其他防御塔的重叠
        for (let tower of this.towers) {
            if (GameUtils.getDistance({x, y}, tower) < GAME_CONFIG.CONSTANTS.TOWER_COLLISION_DISTANCE) {
                return false;
            }
        }
        
        return true;
    }
    
    selectTower(tower) {
        this.selectedTower = tower;
        this.showTowerUpgrade(tower);
    }
    
    showTowerUpgrade(tower) {
        const upgradeCost = tower.getUpgradeCost();
        const canAffordUpgrade = this.money >= upgradeCost;
        this.uiManager.showTowerUpgrade(tower, canAffordUpgrade);
    }
    
    upgradeTower() {
        if (this.selectedTower) {
            const cost = this.selectedTower.getUpgradeCost();
            if (this.money >= cost) {
                this.money -= cost;
                this.selectedTower.upgrade();
                this.showTowerUpgrade(this.selectedTower);
                this.updateUI();
                
                // 添加升级特效
                const upgradeEffect = VisualEffect.createUpgradeEffect(
                    this.selectedTower.x, 
                    this.selectedTower.y
                );
                this.visualEffects.push(upgradeEffect);
                
                this.uiManager.showToast('防御塔升级成功！', 'success');
            } else {
                this.uiManager.showToast('金币不足！', 'error');
            }
        }
    }
    
    sellTower() {
        if (this.selectedTower) {
            const sellValue = this.selectedTower.getSellValue();
            this.money += sellValue;
            
            const index = this.towers.indexOf(this.selectedTower);
            if (index > -1) {
                this.towers.splice(index, 1);
            }
            
            this.selectedTower = null;
            this.uiManager.hideTowerUpgrade();
            this.updateUI();
            this.uiManager.showToast(`获得 ${sellValue} 金币！`, 'success');
        }
    }
    
    startWave() {
        if (!this.waveInProgress && !this.gameOver) {
            this.waveInProgress = true;
            this.currentWaveEnemies = 0;
            const config = GAME_CONFIG.WAVE_CONFIG[this.wave] || GAME_CONFIG.WAVE_CONFIG[1];
            
            this.waveTimer = setInterval(() => {
                if (this.currentWaveEnemies < config.enemies) {
                    this.spawnEnemy(config.enemyType);
                    this.currentWaveEnemies++;
                } else {
                    clearInterval(this.waveTimer);
                    this.checkWaveComplete();
                }
            }, config.interval);
            
            this.uiManager.showToast(`第 ${this.wave} 波开始！`, 'info');
        }
    }
    
    spawnEnemy(type) {
        const startPos = GAME_CONFIG.GAME_PATH[0];
        const enemy = new Enemy(startPos.x, startPos.y, type);
        enemy.setPath(GAME_CONFIG.GAME_PATH);
        this.enemies.push(enemy);
    }
    
    checkWaveComplete() {
        const maxEnemies = GAME_CONFIG.WAVE_CONFIG[this.wave]?.enemies || 10;
        if (this.enemies.length === 0 && this.currentWaveEnemies >= maxEnemies) {
            this.waveInProgress = false;
            this.wave++;
            this.money += GAME_CONFIG.WAVE_REWARD;
            this.updateUI();
            
            if (this.wave > Object.keys(GAME_CONFIG.WAVE_CONFIG).length) {
                this.endGame(true);
            } else {
                this.uiManager.showToast(`第 ${this.wave - 1} 波完成！获得 ${GAME_CONFIG.WAVE_REWARD} 金币奖励！`, 'success');
            }
        }
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        this.uiManager.updatePauseButton(this.isPaused);
    }
    
    restart() {
        // 重置游戏状态
        this.health = GAME_CONFIG.INITIAL_HEALTH;
        this.money = GAME_CONFIG.INITIAL_MONEY;
        this.wave = GAME_CONFIG.INITIAL_WAVE;
        this.score = 0;
        
        // 清空游戏对象
        this.enemies = [];
        this.towers = [];
        this.bullets = [];
        this.particles = [];
        this.visualEffects = [];
        
        // 重置选择状态
        this.selectedTowerType = null;
        this.selectedTower = null;
        this.waveInProgress = false;
        this.currentWaveEnemies = 0;
        this.gameOver = false;
        this.isPaused = false;
        
        // 清理定时器
        if (this.waveTimer) {
            clearInterval(this.waveTimer);
        }
        
        // 重置UI
        this.uiManager.hideGameOver();
        this.uiManager.hideTowerUpgrade();
        this.uiManager.updatePauseButton(false);
        this.uiManager.clearTowerSelection();
        
        this.updateUI();
        this.uiManager.showToast('游戏重新开始！', 'info');
    }
    
    /**
     * 通过索引选择防御塔（快捷键支持）
     */
    selectTowerByIndex(index) {
        const towerButtons = this.uiManager.elements.towerButtons;
        if (towerButtons[index]) {
            const btn = towerButtons[index];
            const type = btn.dataset.tower;
            const cost = parseInt(btn.dataset.cost);
            if (!btn.disabled) {
                this.selectTowerType(type, cost);
            }
        }
    }
    
    endGame(victory = false) {
        this.gameOver = true;
        this.waveInProgress = false;
        
        if (this.waveTimer) {
            clearInterval(this.waveTimer);
        }
        
        this.uiManager.showGameOver(victory, this.score);
    }
    
    update() {
        if (this.isPaused || this.gameOver) return;
        
        this.updateEnemies();
        this.updateTowers();
        this.updateBullets();
        this.updateEffects();
        
        this.updateUI();
        this.checkWaveComplete();
    }
    
    updateEnemies() {
        // 安全检查
        if (!this.enemies) {
            console.error('enemies数组未初始化！当前值:', this.enemies);
            console.error('当前Game对象状态:', this);
            this.enemies = [];
            return;
        }
        
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update();
            
            if (enemy.hasReachedEnd()) {
                this.health -= enemy.damage;
                this.enemies.splice(i, 1);
                
                if (this.health <= 0) {
                    this.endGame(false);
                }
            } else if (enemy.isDead()) {
                this.money += enemy.reward;
                this.score += enemy.score;
                this.enemies.splice(i, 1);
                this.createExplosion(enemy.x, enemy.y);
                
                // 添加金币特效
                const coinEffect = VisualEffect.createCoinEffect(enemy.x, enemy.y, enemy.reward);
                this.visualEffects.push(coinEffect);
            }
        }
    }
    
    updateTowers() {
        this.towers.forEach(tower => {
            tower.update(this.enemies);
            
            if (tower.canShoot()) {
                const target = tower.findTarget(this.enemies);
                if (target) {
                    const bullet = tower.shoot(target);
                    if (bullet) {
                        this.bullets.push(bullet);
                    }
                }
            }
        });
    }
    
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.update();
            
            if (bullet.hasHitTarget() || bullet.isOutOfBounds(this.width, this.height)) {
                if (bullet.hasHitTarget()) {
                    bullet.target.takeDamage(bullet.damage);
                    this.createHitEffect(bullet.x, bullet.y);
                }
                this.bullets.splice(i, 1);
            }
        }
    }
    
    updateEffects() {
        // 更新粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update();
            
            if (particle.isDead()) {
                this.particles.splice(i, 1);
            }
        }
        
        // 更新视觉特效
        for (let i = this.visualEffects.length - 1; i >= 0; i--) {
            const effect = this.visualEffects[i];
            effect.update();
            
            if (effect.isDead()) {
                this.visualEffects.splice(i, 1);
            }
        }
    }
    
    createExplosion(x, y) {
        // 创建粒子
        for (let i = 0; i < 8; i++) {
            const particle = new Particle(x, y, 'explosion');
            this.particles.push(particle);
        }
        
        // 创建爆炸特效
        const explosionEffect = VisualEffect.createExplosion(x, y);
        this.visualEffects.push(explosionEffect);
    }
    
    createHitEffect(x, y) {
        // 创建粒子
        for (let i = 0; i < 4; i++) {
            const particle = new Particle(x, y, 'hit');
            this.particles.push(particle);
        }
        
        // 创建闪烁特效
        const flashEffect = VisualEffect.createHitFlash(x, y);
        this.visualEffects.push(flashEffect);
    }
    
    render() {
        if (!this.renderDebugLogged) {
            console.log('Rendering game...', {
                canvas: this.canvas,
                renderer: this.renderer,
                path: GAME_CONFIG.GAME_PATH
            });
            this.renderDebugLogged = true;
        }
        
        this.renderer.clear();
        this.renderer.drawBackground(GAME_CONFIG.GAME_PATH);
        
        this.renderer.drawEntities(this.enemies, this.towers, this.bullets, this.selectedTower);
        this.renderer.drawEffects(this.particles, this.visualEffects);
        
        if (this.selectedTower) {
            this.renderer.drawTowerRange(this.selectedTower);
        }
        
        if (this.isPaused) {
            this.renderer.drawPauseScreen();
        }
    }
    
    updateUI() {
        this.uiManager.updateGameStats(this.health, this.money, this.wave, this.score);
        this.uiManager.updateTowerButtons(this.money);
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}