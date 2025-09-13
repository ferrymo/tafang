import { Game } from './Game.js';

// 启动游戏
window.addEventListener('load', () => {
    console.log('开始加载游戏...');
    
    try {
        console.log('正在创建游戏实例...');
        const game = new Game();
        console.log('塔防游戏已启动！');
        
        // 添加全局游戏引用（用于调试）
        window.game = game;
        
    } catch (error) {
        console.error('游戏启动失败:', error);
        console.error('错误堆栈:', error.stack);
        
        // 显示错误信息给用户
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #f44336;
            color: white;
            padding: 20px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            text-align: center;
            z-index: 10000;
            max-width: 500px;
        `;
        errorDiv.innerHTML = `
            <h3>游戏启动失败</h3>
            <p>请检查浏览器控制台获取详细错误信息</p>
            <p>错误: ${error.message}</p>
            <pre style="background: rgba(0,0,0,0.2); padding: 10px; margin-top: 10px; border-radius: 4px; font-size: 12px; overflow: auto; max-height: 200px;">${error.stack}</pre>
        `;
        document.body.appendChild(errorDiv);
    }
});

// 导出游戏类供其他模块使用
export { Game };