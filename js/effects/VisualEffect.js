// 视觉特效管理器
export class VisualEffect {
    /**
     * 创建爆炸特效
     */
    static createExplosion(x, y) {
        return {
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
    }
    
    /**
     * 创建击中闪烁特效
     */
    static createHitFlash(x, y) {
        return {
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
    }
    
    /**
     * 创建升级特效
     */
    static createUpgradeEffect(x, y) {
        return {
            x: x,
            y: y,
            radius: 0,
            maxRadius: 50,
            alpha: 0.8,
            life: 30,
            maxLife: 30,
            
            update() {
                this.radius += 2;
                this.alpha -= 0.027;
                this.life--;
            },
            
            isDead() {
                return this.life <= 0 || this.alpha <= 0;
            },
            
            draw(ctx) {
                if (this.alpha > 0) {
                    ctx.save();
                    ctx.globalAlpha = this.alpha;
                    ctx.strokeStyle = '#00FF00';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([5, 5]);
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.restore();
                }
            }
        };
    }
    
    /**
     * 创建金币特效
     */
    static createCoinEffect(x, y, amount) {
        return {
            x: x,
            y: y,
            text: `+${amount}`,
            offsetY: 0,
            alpha: 1,
            life: 60,
            maxLife: 60,
            
            update() {
                this.offsetY -= 1;
                this.alpha -= 0.017;
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
                    ctx.font = 'bold 14px Arial';
                    ctx.textAlign = 'center';
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 2;
                    ctx.strokeText(this.text, this.x, this.y + this.offsetY);
                    ctx.fillText(this.text, this.x, this.y + this.offsetY);
                    ctx.restore();
                }
            }
        };
    }
}