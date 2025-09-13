// 游戏工具函数
export class GameUtils {
    /**
     * 计算两点之间的距离
     */
    static getDistance(point1, point2) {
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * 计算点到线段的距离
     */
    static distanceToLineSegment(px, py, line) {
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
    
    /**
     * 计算两点之间的角度
     */
    static getAngle(from, to) {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        return Math.atan2(dy, dx);
    }
    
    /**
     * 检查点是否在圆形区域内
     */
    static isPointInCircle(point, center, radius) {
        return this.getDistance(point, center) <= radius;
    }
    
    /**
     * 生成随机数
     */
    static random(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    /**
     * 生成随机整数
     */
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    /**
     * 限制数值在指定范围内
     */
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    /**
     * 线性插值
     */
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    /**
     * 将角度转换为弧度
     */
    static degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
    
    /**
     * 将弧度转换为角度
     */
    static radToDeg(radians) {
        return radians * 180 / Math.PI;
    }
    
    /**
     * 格式化数字显示
     */
    static formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    /**
     * 延迟执行函数
     */
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * 防抖函数
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * 节流函数
     */
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}