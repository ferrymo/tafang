// 游戏核心类
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // 游戏状态
        this.isRunning = false;
        this.isPaused = false;
        this.gameOver = false;
        
        // 游戏数据
        this.health = 100;
        this.money = 500;
        this.wave = 1;
        this.score = 0;
        
        // 游戏对象数组
        this.enemies = [];
        this.towers = [];
        this.bullets = [];
        this.particles = [];
        this.visualEffects = []; // 添加视觉特效数组
        
        // 选中状态
        this.selectedTowerType = null;
        this.selectedTower = null;
        
        // 游戏路径
        this.path = [
            {x: 0, y: 300},
            {x: 150, y: 300},
            {x: 150, y: 150},
            {x: 350, y: 150},
            {x: 350, y: 450},
            {x: 550, y: 450},
            {x: 550, y: 100},
            {x: 700, y: 100},
            {x: 700, y: 350},
            {x: 800, y: 350}
        ];
        
        // 波次配置
        this.waveConfig = {
            1: {enemies: 10, enemyType: 'basic', interval: 1000},
            2: {enemies: 15, enemyType: 'fast', interval: 800},
            3: {enemies: 20, enemyType: 'tank', interval: 1200}
        };
        
        this.currentWaveEnemies = 0;
        this.waveInProgress = false;
        this.waveTimer = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateUI();
        this.gameLoop();
    }
    
    setupEventListeners() {
        // 防御塔选择
        document.querySelectorAll('.tower-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectTowerType(btn.dataset.tower, parseInt(btn.dataset.cost));
            });
        });
        
        // 画布点击
        this.canvas.addEventListener('click', (e) => {
            this.handleCanvasClick(e);
        });
        
        // 控制按钮
        document.getElementById('startWave').addEventListener('click', () => this.startWave());
        document.getElementById('pauseGame').addEventListener('click', () => this.togglePause());
        document.getElementById('restartGame').addEventListener('click', () => this.restart());
        document.getElementById('upgradeTower').addEventListener('click', () => this.upgradeTower());
        document.getElementById('sellTower').addEventListener('click', () => this.sellTower());
        document.getElementById('restartFromModal').addEventListener('click', () => this.restart());
    }
    
    selectTowerType(type, cost) {
        if (this.money >= cost) {
            this.selectedTowerType = {type, cost};
            document.querySelectorAll('.tower-btn').forEach(btn => btn.classList.remove('selected'));
            document.querySelector(`[data-tower="${type}"]`).classList.add('selected');
        } else {
            alert('金币不足！');
        }
    }
    
    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const clickedTower = this.towers.find(tower => {
            const dx = x - tower.x;
            const dy = y - tower.y;
            return Math.sqrt(dx * dx + dy * dy) < tower.size;
        });
        
        if (clickedTower) {
            this.selectTower(clickedTower);
        } else if (this.selectedTowerType) {
            this.placeTower(x, y);
        }
    }
    
    placeTower(x, y) {
        if (this.isValidTowerPosition(x, y)) {
            const tower = new Tower(x, y, this.selectedTowerType.type);
            this.towers.push(tower);
            this.money -= this.selectedTowerType.cost;
            this.selectedTowerType = null;
            
            document.querySelectorAll('.tower-btn').forEach(btn => btn.classList.remove('selected'));
            this.updateUI();
        }
    }
    
    isValidTowerPosition(x, y) {
        // 检查路径
        for (let i = 0; i < this.path.length - 1; i++) {
            const pathSegment = {
                x1: this.path[i].x, y1: this.path[i].y,
                x2: this.path[i + 1].x, y2: this.path[i + 1].y
            };
            
            if (this.distanceToLineSegment(x, y, pathSegment) < 40) {
                return false;
            }
        }
        
        // 检查重叠
        for (let tower of this.towers) {
            const dx = x - tower.x;
            const dy = y - tower.y;
            if (Math.sqrt(dx * dx + dy * dy) < 50) {
                return false;
            }
        }
        
        return x > 30 && x < this.width - 30 && y > 30 && y < this.height - 30;
    }
    
    distanceToLineSegment(px, py, line) {
        const A = px - line.x1;
        const B = py - line.y1;
        const C = line.x2 - line.x1;
        const D = line.y2 - line.y1;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = lenSq !== 0 ? dot / lenSq : -1;
        
        let xx, yy;
        if (param < 0) {
            xx = line.x1; yy = line.y1;
        } else if (param > 1) {
            xx = line.x2; yy = line.y2;
        } else {
            xx = line.x1 + param * C;
            yy = line.y1 + param * D;
        }
        
        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    selectTower(tower) {
        this.selectedTower = tower;
        this.showTowerUpgrade(tower);
    }
    
    showTowerUpgrade(tower) {
        const upgradePanel = document.getElementById('towerUpgrade');
        upgradePanel.style.display = 'block';
        
        document.getElementById('towerLevel').textContent = tower.level;
        document.getElementById('towerDamage').textContent = tower.damage;
        document.getElementById('towerRange').textContent = Math.round(tower.range);
        
        const upgradeCost = tower.getUpgradeCost();
        document.getElementById('upgradeTower').textContent = `升级 (${upgradeCost}金币)`;
        document.getElementById('upgradeTower').disabled = this.money < upgradeCost;
    }
    
    upgradeTower() {
        if (this.selectedTower) {
            const cost = this.selectedTower.getUpgradeCost();
            if (this.money >= cost) {
                this.money -= cost;
                this.selectedTower.upgrade();
                this.showTowerUpgrade(this.selectedTower);
                this.updateUI();
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
            document.getElementById('towerUpgrade').style.display = 'none';
            this.updateUI();
        }
    }
    
    startWave() {
        if (!this.waveInProgress && !this.gameOver) {
            this.waveInProgress = true;
            this.currentWaveEnemies = 0;
            const config = this.waveConfig[this.wave] || this.waveConfig[1];
            
            this.waveTimer = setInterval(() => {
                if (this.currentWaveEnemies < config.enemies) {
                    this.spawnEnemy(config.enemyType);
                    this.currentWaveEnemies++;
                } else {
                    clearInterval(this.waveTimer);
                    this.checkWaveComplete();
                }
            }, config.interval);
        }
    }
    
    spawnEnemy(type) {
        const enemy = new Enemy(this.path[0].x, this.path[0].y, type);
        enemy.setPath(this.path);
        this.enemies.push(enemy);
    }
    
    checkWaveComplete() {
        if (this.enemies.length === 0 && this.currentWaveEnemies >= (this.waveConfig[this.wave]?.enemies || 10)) {
            this.waveInProgress = false;
            this.wave++;
            this.money += 100;
            this.updateUI();
            
            if (this.wave > 3) {
                this.endGame(true);
            }
        }
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        document.getElementById('pauseGame').textContent = this.isPaused ? '继续游戏' : '暂停游戏';
    }
    
    restart() {
        this.health = 100;
        this.money = 500;
        this.wave = 1;
        this.score = 0;
        
        this.enemies = [];
        this.towers = [];
        this.bullets = [];
        this.particles = [];
        this.visualEffects = []; // 重置视觉特效
        
        this.selectedTowerType = null;
        this.selectedTower = null;
        this.waveInProgress = false;
        this.currentWaveEnemies = 0;
        this.gameOver = false;
        this.isPaused = false;
        
        if (this.waveTimer) {
            clearInterval(this.waveTimer);
        }
        
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('towerUpgrade').style.display = 'none';
        document.getElementById('pauseGame').textContent = '暂停游戏';
        
        document.querySelectorAll('.tower-btn').forEach(btn => btn.classList.remove('selected'));
        this.updateUI();
    }
    
    endGame(victory = false) {
        this.gameOver = true;
        this.waveInProgress = false;
        
        if (this.waveTimer) {
            clearInterval(this.waveTimer);
        }
        
        const modal = document.getElementById('gameOver');
        const title = document.getElementById('gameOverTitle');
        const message = document.getElementById('gameOverMessage');
        const finalScore = document.getElementById('finalScore');
        
        if (victory) {
            title.textContent = '恭喜胜利！';
            message.innerHTML = '你成功守护了基地！最终得分是: ';
        } else {
            title.textContent = '游戏结束';
            message.innerHTML = '基地被摧毁了！最终得分是: ';
        }
        
        finalScore.textContent = this.score;
        modal.style.display = 'flex';
    }
    
    update() {
        if (this.isPaused || this.gameOver) return;
        
        // 更新敌人
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
            }
        }
        
        // 更新防御塔
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
        
        // 更新子弹
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
        
        this.updateUI();
        this.checkWaveComplete();
    }
    
    createExplosion(x, y) {
        for (let i = 0; i < 8; i++) {
            const particle = new Particle(x, y, 'explosion');
            this.particles.push(particle);
        }
        
        // 添加爆炸特效到特效数组
        const explosionEffect = {
            x: x,
            y: y,
            radius: 0,
            maxRadius: 30,
            alpha: 1,
            life: 20,
            maxLife: 20,
            
            update() {
                this.radius += 1.5;
                this.alpha -= 0.05;
                this.life--;
            },
            
            isDead() {
                return this.life <= 0 || this.alpha <= 0;
            },
            
            draw(ctx) {
                if (this.alpha > 0) {
                    ctx.save();
                    ctx.globalAlpha = this.alpha;
                    ctx.strokeStyle = '#FF6B35';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        };
        
        this.visualEffects.push(explosionEffect);
    }
    
    createHitEffect(x, y) {
        for (let i = 0; i < 4; i++) {
            const particle = new Particle(x, y, 'hit');
            this.particles.push(particle);
        }
        
        // 添加闪烁特效到特效数组
        const flashEffect = {
            x: x,
            y: y,
            size: 8,
            alpha: 1,
            life: 10,
            maxLife: 10,
            
            update() {
                this.alpha -= 0.1;
                this.size += 1;
                this.life--;
            },
            
            isDead() {
                return this.life <= 0 || this.alpha <= 0;
            },
            
            draw(ctx) {
                if (this.alpha > 0) {
                    ctx.save();
                    ctx.globalAlpha = this.alpha;
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }
        };
        
        this.visualEffects.push(flashEffect);
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.drawBackground();
        this.drawPath();
        
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.towers.forEach(tower => tower.draw(this.ctx, tower === this.selectedTower));
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
        this.particles.forEach(particle => particle.draw(this.ctx));
        
        // 绘制视觉特效
        this.visualEffects.forEach(effect => effect.draw(this.ctx));
        
        if (this.selectedTower) {
            this.drawTowerRange(this.selectedTower);
        }
    }
    
    drawBackground() {
        this.ctx.fillStyle = '#90EE90';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
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
    
    drawPath() {
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 30;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.path[0].x, this.path[0].y);
        
        for (let i = 1; i < this.path.length; i++) {
            this.ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        
        this.ctx.stroke();
    }
    
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
    
    updateUI() {
        document.getElementById('health').textContent = this.health;
        document.getElementById('money').textContent = this.money;
        document.getElementById('wave').textContent = this.wave;
        document.getElementById('score').textContent = this.score;
        
        document.querySelectorAll('.tower-btn').forEach(btn => {
            const cost = parseInt(btn.dataset.cost);
            btn.disabled = this.money < cost;
        });
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 敌人类
class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.path = [];
        this.pathIndex = 0;
        this.targetX = x;
        this.targetY = y;
        
        this.setTypeProperties(type);
        this.maxHealth = this.health;
        this.isDying = false;
        this.reachedEnd = false;
    }
    
    setTypeProperties(type) {
        switch(type) {
            case 'basic':
                this.health = 50;
                this.speed = 1;
                this.reward = 10;
                this.damage = 1;
                this.score = 10;
                this.color = '#FF6B6B';
                this.size = 12;
                break;
            case 'fast':
                this.health = 30;
                this.speed = 2;
                this.reward = 15;
                this.damage = 1;
                this.score = 15;
                this.color = '#4ECDC4';
                this.size = 10;
                break;
            case 'tank':
                this.health = 150;
                this.speed = 0.5;
                this.reward = 25;
                this.damage = 3;
                this.score = 25;
                this.color = '#45B7D1';
                this.size = 18;
                break;
        }
    }
    
    setPath(path) {
        this.path = [...path];
        if (this.path.length > 1) {
            this.targetX = this.path[1].x;
            this.targetY = this.path[1].y;
            this.pathIndex = 1;
        }
    }
    
    update() {
        if (this.isDying || this.reachedEnd) return;
        
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 5) {
            this.pathIndex++;
            if (this.pathIndex >= this.path.length) {
                this.reachedEnd = true;
                return;
            }
            
            this.targetX = this.path[this.pathIndex].x;
            this.targetY = this.path[this.pathIndex].y;
        } else {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }
    
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.isDying = true;
        }
    }
    
    isDead() {
        return this.isDying;
    }
    
    hasReachedEnd() {
        return this.reachedEnd;
    }
    
    draw(ctx) {
        if (this.isDying) return;
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        this.drawHealthBar(ctx);
    }
    
    drawHealthBar(ctx) {
        const barWidth = this.size * 2;
        const barHeight = 4;
        const x = this.x - barWidth / 2;
        const y = this.y - this.size - 10;
        
        ctx.fillStyle = '#333';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.6 ? '#4CAF50' : healthPercent > 0.3 ? '#FF9800' : '#F44336';
        ctx.fillRect(x, y, barWidth * healthPercent, barHeight);
    }
}

// 防御塔类
class Tower {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.level = 1;
        this.lastShot = 0;
        this.target = null;
        
        this.setTypeProperties(type);
        this.baseDamage = this.damage;
        this.baseRange = this.range;
        this.baseFireRate = this.fireRate;
    }
    
    setTypeProperties(type) {
        switch(type) {
            case 'basic':
                this.damage = 25;
                this.range = 100;
                this.fireRate = 1000;
                this.cost = 50;
                this.color = '#FF8A50';
                this.size = 15;
                break;
            case 'rapid':
                this.damage = 15;
                this.range = 80;
                this.fireRate = 400;
                this.cost = 100;
                this.color = '#50B7FF';
                this.size = 12;
                break;
            case 'heavy':
                this.damage = 60;
                this.range = 120;
                this.fireRate = 2000;
                this.cost = 200;
                this.color = '#A050FF';
                this.size = 20;
                break;
        }
    }
    
    update(enemies) {
        if (!this.target || this.target.isDead() || !this.isInRange(this.target)) {
            this.target = this.findTarget(enemies);
        }
    }
    
    findTarget(enemies) {
        let closestEnemy = null;
        let closestDistance = Infinity;
        
        for (let enemy of enemies) {
            if (enemy.isDead()) continue;
            
            const distance = this.getDistance(enemy);
            if (distance <= this.range && distance < closestDistance) {
                closestEnemy = enemy;
                closestDistance = distance;
            }
        }
        
        return closestEnemy;
    }
    
    isInRange(enemy) {
        return this.getDistance(enemy) <= this.range;
    }
    
    getDistance(enemy) {
        const dx = this.x - enemy.x;
        const dy = this.y - enemy.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    canShoot() {
        return Date.now() - this.lastShot >= this.fireRate;
    }
    
    shoot(target) {
        if (this.canShoot() && target) {
            this.lastShot = Date.now();
            
            // 添加开火动画效果
            this.isShooting = true;
            setTimeout(() => {
                this.isShooting = false;
            }, 200);
            
            return new Bullet(this.x, this.y, target, this.damage, this.type);
        }
        return null;
    }
    
    upgrade() {
        this.level++;
        this.damage = Math.floor(this.baseDamage * (1 + (this.level - 1) * 0.5));
        this.range = Math.floor(this.baseRange * (1 + (this.level - 1) * 0.2));
        this.fireRate = Math.max(100, Math.floor(this.baseFireRate * (1 - (this.level - 1) * 0.1)));
    }
    
    getUpgradeCost() {
        return this.cost * this.level;
    }
    
    getSellValue() {
        return Math.floor(this.cost * 0.7 * this.level);
    }
    
    draw(ctx, isSelected = false) {
        if (isSelected) {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size + 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 开火时的闪烁效果
        if (this.isShooting) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size + 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制等级
        if (this.level > 1) {
            ctx.fillStyle = '#FFF';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.strokeText(this.level.toString(), this.x, this.y + 4);
            ctx.fillText(this.level.toString(), this.x, this.y + 4);
        }
        
        // 绘制炮管指向目标
        if (this.target && !this.target.isDead()) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const angle = Math.atan2(dy, dx);
            
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + Math.cos(angle) * (this.size - 2), this.y + Math.sin(angle) * (this.size - 2));
            ctx.stroke();
        }
    }
}

// 子弹类
class Bullet {
    constructor(x, y, target, damage, type) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.type = type;
        this.speed = 5;
        this.hasHit = false;
        
        this.setTypeProperties(type);
    }
    
    setTypeProperties(type) {
        switch(type) {
            case 'basic':
                this.color = '#FFD700';
                this.size = 3;
                break;
            case 'rapid':
                this.color = '#00BFFF';
                this.size = 2;
                this.speed = 7;
                break;
            case 'heavy':
                this.color = '#FF4500';
                this.size = 5;
                this.speed = 3;
                break;
        }
    }
    
    update() {
        if (this.hasHit || this.target.isDead()) return;
        
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 5) {
            this.hasHit = true;
        } else {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }
    
    hasHitTarget() {
        return this.hasHit;
    }
    
    isOutOfBounds(width, height) {
        return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 粒子效果类
class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.life = 30;
        this.maxLife = 30;
        
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        
        this.setTypeProperties(type);
    }
    
    setTypeProperties(type) {
        switch(type) {
            case 'explosion':
                this.color = '#FF6B35';
                this.size = Math.random() * 6 + 3;
                this.vx = (Math.random() - 0.5) * 6;
                this.vy = (Math.random() - 0.5) * 6;
                this.life = 40;
                this.maxLife = 40;
                break;
            case 'hit':
                this.color = '#FFD700';
                this.size = Math.random() * 3 + 2;
                this.vx = (Math.random() - 0.5) * 4;
                this.vy = (Math.random() - 0.5) * 4;
                this.life = 25;
                this.maxLife = 25;
                break;
            case 'smoke':
                this.color = '#888888';
                this.size = Math.random() * 4 + 2;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = -Math.random() * 3 - 1;
                this.life = 60;
                this.maxLife = 60;
                break;
        }
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        
        this.vx *= 0.98;
        this.vy *= 0.98;
    }
    
    isDead() {
        return this.life <= 0;
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = this.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 启动游戏
window.addEventListener('load', () => {
    new Game();
});