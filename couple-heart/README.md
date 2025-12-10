# 情侣速配（Couple Game）

一个基于 HTML/CSS/JS 的轻量情侣小游戏。包含 6 个趣味问题与一个 8 秒快速互动迷你游戏（捕捉小心心）。

文件列表：

- `index.html` — 入口页面
- `styles.css` — 样式
- `script.js` — 游戏逻辑
- `assets/heart.svg` — 心形图标

运行方法：

1. 直接在浏览器中打开 `index.html`（双击或在编辑器中右键 Open in Browser）。
2. 或在项目根目录运行一个本地静态服务器（推荐）：

```bash
cd testHtml/couple-game-2
python3 -m http.server 8000
# 然后浏览器打开 http://localhost:8000
```

玩法简介：
- 回答 6 个问题（每个选择对应不同分值），完成后可进行 8 秒的“捕心”挑战；捕到的小心心会带来额外加分。
- 最终会给出一个甜蜜分数（百分制）与建议文字。

如需改进：可以添加更多题目、改进 confetti 效果、加入声效与本地存储记录历史分数等。欢迎提出想法！