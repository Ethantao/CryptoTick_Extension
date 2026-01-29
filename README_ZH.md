# CryptoTick & Alert (加密哨兵) 🚀

**中文** | [English](./README.md)

<div align="center">
  <img src="https://via.placeholder.com/128/8B5CF6/FFFFFF?text=CT" alt="CryptoTick Logo" width="128" height="128" />
  <br/>
  <strong>浏览器扩展图标上的实时加密货币报价与波动预警</strong>
</div>

## ✨ 核心功能

- **实时报价**: 直接在浏览器扩展图标（Badge）上查看实时价格 (支持 BTC, ETH, SOL, DOGE, **PAXG**, **XAUT**)。
- **波动预警**:
  - 🚨 **阈值警报**: 当价格在 N 分钟内波动超过 X% 时发送通知。
  - 🔊 **声音提示**: 针对“急涨”和“急跌”提供不同的音效提示（如上涨时的清脆音，下跌时的深沉音）。
- **交互式图表**: 内置轻量级 K 线图 (支持 1m, 3m, 5m, 15m, 1h, 4h, 1d 等多周期)。
- **多交易所支持**: 支持 **Binance** 和 **OKX** 实时行情数据。
- **Web3 设计风格**: 专为加密用户设计的深色霓虹玻璃拟态 UI (Glassmorphism)。
- **置顶模式 (Pin Mode)**: 像便签一样将窗口“始终置顶”，方便盯盘。
- **隐私优先**: 无任何数据收集，直接与交易所 API 连接，安全可靠。

## 📥 安装指南

### Chrome 应用商店

*(链接即将上线)*

### 手动安装 (开发者模式)

1. 以及克隆或下载此仓库。
2. 运行 `npm install` 安装依赖。
3. 运行 `npm run build` 生成 `dist` 目录。
4. 打开 Chrome 浏览器，进入 `chrome://extensions`。
5. 开启右上角的 "开发者模式 (Developer mode)"。
6. 点击 "加载已解压的扩展程序 (Load unpacked)" 并选择 `dist` 文件夹。

## 🛠️ 技术栈

- **框架**: React + Vite
- **样式**: TailwindCSS
- **图表**: Lightweight Charts (TradingView)
- **存储**: Chrome Storage API
- **图标**: Simple Icons (Binance) & Logomark (OKX)

## 🤝 支持作者

如果你觉得这个工具好用，欢迎请我喝杯咖啡！☕

- **USDT (TRC20)**: `TWfvtQvcThPR5XwRQpawWi8KXrUpx4o5Ha`
- **SOL**: `AhQWJnxBunp6bvwDgUFFF2xXUZQphowjmu3rcvMwZdwi`
- **ETH**: `0x9aa47cdc031f7191abc9c31f8eeeec297e32f955`

## 📄 许可证

MIT License © 2026 CryptoTick
