/**
 * 四段浪漫流程：
 * 1. 粉色线条心形
 * 2. 照片摆成心形
 * 3. 散开 → 满屏消息小窗口
 * 4. 信件内容
 */
(function (global) {
  // 由 photos.js 自动生成；若未加载则回退空数组
  const PHOTO_SRCS = Array.isArray(global.LOVE_PHOTOS) ? global.LOVE_PHOTOS.slice() : [];

  // 弹窗文案：长短情话 + 小贴士（尽量不重复）
  const MESSAGES = [
    // 短情话
    '我想你了',
    '韵秋，我爱你',
    '想抱抱你',
    '有你真好',
    '木啊～',
    '今天也好想你',
    '你笑起来真好看',
    '我的小太阳',
    '想牵你的手',
    '你最可爱',
    '爱你哟',
    '想听你声音',
    '晚安，梦里见',
    '早呀韵秋',
    '想你了，就说一声',
    // 稍长情话
    '世界很大，我只要你这一角',
    '有你在的地方，才像回家',
    '想和你一起把平凡过成纪念',
    '济南那日的风，我到现在还记得',
    '留洋大小姐妆造的你，美到我心里',
    '大明湖、趵突泉、经三路，都因你发光',
    '10.14，是我们很珍贵的一天',
    '小红书遇见你，是我最甜的运气',
    '下班开一把王者，是我们的小约定',
    '愿意当你的队友，也陪着你',
    '忙的时候我就安静等你，不催你',
    '视频打不通也没关系，我知道你累',
    '你不用一直热情，歇着也很好',
    '刘韵秋三个字，我放在心上',
    '王海旭爱刘韵秋，就这么简单',
    // 健康小贴士
    '多喝水哦～',
    '别饿着自己',
    '到点吃饭！',
    '咖啡可以，水也要有',
    '别等饿晕了才吃',
    '三餐比尺码重要',
    '胖瘦都可爱',
    '我一点也不嫌弃你',
    '好好爱身体',
    '机场再忙也吃一口',
    '桌上放杯温水',
    '别用不吃不喝惩罚自己',
    '健康比瘦更重要',
    '饿了就吃，很勇敢',
    '下班先垫垫肚子再开黑',
    // 日常关心
    '天冷了多穿衣',
    '今天过得开心吗',
    '保持好心情',
    '对自己好一点',
    '记得按时吃饭',
    '别熬夜太狠',
    '肩膀酸了就揉一揉',
    '下雨慢点走',
    '到了跟我说一声',
    '累了就歇会儿',
    '一切都会顺利的',
    '永远站在你这边',
    // 再补长短句，降低重复率
    '想看你眨眼的视频',
    '你一撒娇我就没办法',
    '再来一把？我等你',
    '今天也要元气满满',
    '韵秋加油，我相信你',
    '你值得被好好珍惜',
    '别怕麻烦我，想说就说',
    '我想你，胜过想赢一局',
    '陪你慢慢变老',
    '下一站，还想和你去济南',
    '你嘟嘴的样子好可爱',
    '哭的时候也让我知道',
    '开心的事也要分享给我',
    '我在，一直都在',
    '爱你，不是说说而已',
  ];

  // 卡片正面文字：情话 + 生活小贴士（可自由改）
  const CARD_NOTES = [
    { tag: '情话', text: '韵秋，遇见你是我最甜的意外。' },
    { tag: '情话', text: '你一笑，我就觉得今天值得。' },
    { tag: '贴士', text: '别饿着自己，到点就吃一口好不好。' },
    { tag: '情话', text: '胖一点瘦一点都好，我喜欢的是你。' },
    { tag: '贴士', text: '咖啡可以喝，也请记得喝点水。' },
    { tag: '情话', text: '想把所有温柔的日子都留给你。' },
    { tag: '贴士', text: '别等饿晕了才吃饭，身体会心疼的。' },
    { tag: '情话', text: '有你在的地方，才像家。' },
    { tag: '贴士', text: '机场再忙，也给自己留一顿正经饭。' },
    { tag: '情话', text: '我喜欢你，比昨天更多一点。' },
    { tag: '贴士', text: '减肥可以慢慢来，别用不吃不喝惩罚自己。' },
    { tag: '情话', text: '你不用完美，被爱就够了。' },
    { tag: '贴士', text: '桌上放杯水，路过就喝一口。' },
    { tag: '情话', text: '想牵着你的手，走过很长很长的路。' },
    { tag: '贴士', text: '天冷记得加衣服，别硬扛。' },
    { tag: '情话', text: '你是我心里那颗最亮的小星星。' },
    { tag: '贴士', text: '我一点也不嫌弃你，是你就可以。' },
    { tag: '情话', text: '世界很大，我只要你这一角。' },
    { tag: '贴士', text: '睡前少刷手机，今晚好好休息。' },
    { tag: '情话', text: '谢谢你出现在我的生命里。' },
    { tag: '贴士', text: '三餐比尺码重要，健康比瘦重要。' },
    { tag: '情话', text: '想听你分享今天发生的小事。' },
    { tag: '贴士', text: '忙起来也别只靠咖啡撑一天。' },
    { tag: '情话', text: '你值得被认真对待，也被好好珍惜。' },
    { tag: '贴士', text: '饿了就吃，渴了就喝，这很勇敢。' },
    { tag: '情话', text: '我爱你，不是说说而已。' },
    { tag: '贴士', text: '保持好心情，坏情绪会过去的。' },
    { tag: '情话', text: '想和你一起把平凡过成纪念。' },
    { tag: '贴士', text: '有我在，你可以对自己软一点。' },
    { tag: '情话', text: '你笑起来的样子，我看多久都不够。' },
    { tag: '贴士', text: '别怕长肉，我爱的是活生生的你。' },
    { tag: '贴士', text: '下班先吃点东西，再开一把王者。' },
    { tag: '情话', text: '10.14 的济南，我想再去一次。' },
    { tag: '情话', text: '小红书刷到你，是命运翻页。' },
    { tag: '贴士', text: '别靠咖啡硬撑整班，吃点垫垫。' },
    { tag: '情话', text: '那段日子天天都很开心，因为有你。' },
  ];

  global.LOVE_CARD_NOTES = CARD_NOTES;

  const POPUP_COLORS = [
    '#FFB6C1',
    '#FFC0CB',
    '#ADD8E6',
    '#B0E0E6',
    '#98FB98',
    '#90EE90',
    '#E6E6FA',
    '#DDA0DD',
    '#FFE4B5',
    '#FFDAB9',
    '#F0E68C',
    '#AFEEEE',
  ];

  function heartPoint(t, scale, cx, cy) {
    // 经典心形：x=16sin³t, y=13cost-5cos2t-2cos3t-cos4t
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
    );
    return { x: cx + x * scale, y: cy + y * scale };
  }

  /** 按弧长均匀取样，避免心形底部挤在一起 */
  function sampleHeartPointsEven(count, scale, cx, cy) {
    if (count <= 0) return [];
    const dense = 1200;
    const raw = [];
    for (let i = 0; i < dense; i++) {
      const t = (Math.PI * 2 * i) / dense;
      raw.push(heartPoint(t, scale, cx, cy));
    }
    const cum = [0];
    for (let i = 1; i < dense; i++) {
      const dx = raw[i].x - raw[i - 1].x;
      const dy = raw[i].y - raw[i - 1].y;
      cum.push(cum[i - 1] + Math.hypot(dx, dy));
    }
    const total = cum[dense - 1] || 1;
    const pts = [];
    for (let i = 0; i < count; i++) {
      const target = (total * i) / count;
      let lo = 0;
      let hi = dense - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (cum[mid] < target) lo = mid + 1;
        else hi = mid;
      }
      pts.push(raw[lo]);
    }
    return pts;
  }

  /** 大图 + 允许重叠的心形排布（外圈 + 内圈） */
  function layoutPhotoHeart(photos, w, h) {
    const n = photos.length;
    const minSide = Math.min(w, h);
    // 故意做大，允许互相叠一点
    const size = Math.max(78, Math.min(120, Math.floor(minSide / 6.2)));
    const cx = w / 2;
    const cy = h / 2 - h * 0.02;
    const outerScale = Math.max(10, (minSide / 2 - size * 0.28) / 17);

    const outerN = n <= 14 ? n : Math.ceil(n * 0.6);
    const innerN = n - outerN;
    const outer = sampleHeartPointsEven(outerN, outerScale, cx, cy);
    const slots = outer.map((p) => ({ ...p, size }));

    if (innerN > 0) {
      const inner = sampleHeartPointsEven(
        innerN,
        outerScale * 0.55,
        cx,
        cy + size * 0.06
      );
      const innerSize = Math.max(70, Math.floor(size * 0.92));
      inner.forEach((p) => slots.push({ ...p, size: innerSize }));
    }

    return photos.map((src, i) => ({
      src,
      x: slots[i].x,
      y: slots[i].y,
      size: slots[i].size,
      note: CARD_NOTES[i % CARD_NOTES.length],
    }));
  }

  const LAYOUT_KEY = 'lovePhotoLayout_v1';

  function photoKey(src) {
    return String(src).split('?')[0];
  }

  function loadSavedLayout() {
    try {
      return JSON.parse(localStorage.getItem(LAYOUT_KEY) || '{}') || {};
    } catch (e) {
      return {};
    }
  }

  function saveCardPosition(src, left, top) {
    const map = loadSavedLayout();
    map[photoKey(src)] = { left, top };
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(map));
  }

  function enableDrag(el, src) {
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let origLeft = 0;
    let origTop = 0;

    const onDown = (clientX, clientY) => {
      dragging = true;
      moved = false;
      startX = clientX;
      startY = clientY;
      origLeft = parseFloat(el.style.left) || 0;
      origTop = parseFloat(el.style.top) || 0;
      el.style.zIndex = '500';
      el.classList.add('dragging');
    };

    const onMove = (clientX, clientY) => {
      if (!dragging) return;
      const dx = clientX - startX;
      const dy = clientY - startY;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
      el.style.left = origLeft + dx + 'px';
      el.style.top = origTop + dy + 'px';
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('dragging');
      if (moved) {
        saveCardPosition(src, parseFloat(el.style.left), parseFloat(el.style.top));
        el.dataset.skipClick = '1';
      }
    };

    el.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      onDown(e.clientX, e.clientY);
    });
    window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onUp);

    el.addEventListener(
      'touchstart',
      (e) => {
        const t = e.touches[0];
        onDown(t.clientX, t.clientY);
      },
      { passive: true }
    );
    window.addEventListener(
      'touchmove',
      (e) => {
        if (!dragging) return;
        const t = e.touches[0];
        onMove(t.clientX, t.clientY);
      },
      { passive: true }
    );
    window.addEventListener('touchend', onUp);
  }

  function buildFlipCard(src, note, size) {
    const el = document.createElement('div');
    el.className = 'photo-heart-item';
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.title = '点击翻转 · 按住拖动可调整位置';

    const inner = document.createElement('div');
    inner.className = 'photo-flip-inner';

    // 正面：文字；翻转后：照片
    const front = document.createElement('div');
    front.className = 'photo-face photo-front photo-note';
    front.innerHTML = `<p class="photo-note-text">${note.text}</p>`;

    const back = document.createElement('div');
    back.className = 'photo-face photo-back photo-photo';
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.draggable = false;
    back.appendChild(img);

    inner.appendChild(front);
    inner.appendChild(back);
    el.appendChild(inner);

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (el.dataset.skipClick === '1') {
        el.dataset.skipClick = '0';
        return;
      }
      el.classList.toggle('flipped');
      el.style.zIndex = String(200 + Math.floor(Math.random() * 50));
    });

    enableDrag(el, src);
    return el;
  }

  class RomanceSequence {
    constructor({
      overlay,
      canvas,
      photoStage,
      popupStage,
      hintEl,
      skipBtn,
      onComplete,
    }) {
      this.overlay = overlay;
      this.canvas = canvas;
      this.photoStage = photoStage;
      this.popupStage = popupStage;
      this.hintEl = hintEl;
      this.skipBtn = skipBtn;
      this.onComplete = onComplete;
      this.lineAnim = new HeartLineAnimation(canvas);
      this.running = false;
      this.stage = 0;
      this.timers = [];
      this.photoNodes = [];

      this.skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.skipToLetter();
      });

      window.addEventListener('resize', () => {
        if (this.running && this.stage === 1) this.lineAnim.resize();
      });
    }

    setHint(text) {
      if (this.hintEl) this.hintEl.textContent = text;
    }

    clearTimers() {
      this.timers.forEach(clearTimeout);
      this.timers = [];
    }

    later(fn, ms) {
      const id = setTimeout(fn, ms);
      this.timers.push(id);
      return id;
    }

    resetStages() {
      this.clearTimers();
      this.lineAnim.stop();
      this.canvas.classList.remove('hidden', 'fade');
      this.photoStage.innerHTML = '';
      this.photoStage.className = 'photo-heart-stage';
      this.popupStage.innerHTML = '';
      this.popupStage.className = 'popup-stage';
      this.photoNodes = [];
      this._popupSlots = null;
      this.overlay.classList.remove('fade-out');
      const cont = this.overlay.querySelector('.continue-stage-btn');
      if (cont) cont.remove();
    }

    start() {
      if (this.running) return;
      this.running = true;
      this.resetStages();
      this.overlay.classList.add('active');
      this.overlay.setAttribute('aria-hidden', 'false');
      this.startStage1();
    }

    startStage1() {
      this.stage = 1;
      this.setHint('心形线条绘制中…');
      this.canvas.classList.remove('hidden', 'fade');
      // 画满约 1 圈半后进入照片心形
      this.lineAnim.start(() => this.startStage2());
    }

    startStage2() {
      if (!this.running || this.stage !== 1) return;
      this.stage = 2;

      const photos = PHOTO_SRCS.length ? PHOTO_SRCS : [];
      if (!photos.length) {
        this.setHint('还没有照片，先放进 pics 文件夹吧');
        this.later(() => this.startStage3(), 1200);
        return;
      }

      this.setHint(`先看看这些话 · 点击翻转看她 · 按住可拖动调位置`);

      this.canvas.classList.add('fade');
      this.later(() => this.canvas.classList.add('hidden'), 500);

      const w = window.innerWidth;
      const h = window.innerHeight;
      const layout = layoutPhotoHeart(photos, w, h);
      const saved = loadSavedLayout();

      this.photoStage.classList.add('active', 'interactive');

      const step = 16;

      layout.forEach((item, i) => {
        const el = buildFlipCard(item.src, item.note, item.size);
        const key = photoKey(item.src);
        const custom = saved[key];
        const left = custom ? custom.left : item.x - item.size / 2;
        const top = custom ? custom.top : item.y - item.size / 2;
        el.style.left = left + 'px';
        el.style.top = top + 'px';
        el.style.zIndex = String(10 + i);
        el.style.setProperty('--delay', `${i * step}ms`);
        this.photoStage.appendChild(el);
        this.photoNodes.push({ el, x: item.x, y: item.y, size: item.size });
      });

      const assembleMs = photos.length * step + 700;
      this.later(() => this.showContinueButton(), assembleMs);
    }

    showContinueButton() {
      if (!this.running || this.stage !== 2) return;
      let btn = this.overlay.querySelector('.continue-stage-btn');
      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'continue-stage-btn';
        btn.textContent = '看完啦，继续 →';
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          btn.remove();
          this.startStage3();
        });
        this.overlay.appendChild(btn);
      }
      this.setHint('点击翻转 · 拖动调位置（会自动记住）· 好了再点继续');
    }

    startStage3() {
      if (!this.running || this.stage !== 2) return;
      this.stage = 3;
      this.photoStage.classList.remove('interactive');
      const cont = this.overlay.querySelector('.continue-stage-btn');
      if (cont) cont.remove();
      this.setHint('满屏都是想对你说的话…');

      const w = window.innerWidth;
      const h = window.innerHeight;

      // 照片散开飞出
      this.photoNodes.forEach(({ el }, i) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 280 + Math.random() * Math.max(w, h) * 0.45;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        el.style.setProperty('--scatter-x', `${dx}px`);
        el.style.setProperty('--scatter-y', `${dy}px`);
        el.style.setProperty('--scatter-delay', `${i * 18}ms`);
        el.classList.add('scatter');
      });

      this.later(() => {
        this.photoStage.classList.add('done');
      }, 900);

      // 消息小窗口铺满全屏
      this.popupStage.classList.add('active');
      this._popupSlots = this.buildFullscreenPopupSlots(w, h);
      const popupCount = this._popupSlots.length;

      // 文案洗牌，按顺序发，尽量相邻不重复
      this._msgQueue = MESSAGES.slice();
      for (let i = this._msgQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this._msgQueue[i], this._msgQueue[j]] = [
          this._msgQueue[j],
          this._msgQueue[i],
        ];
      }
      this._msgCursor = 0;

      // 打乱出现顺序
      const order = this._popupSlots.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }

      const step = 22;
      order.forEach((slotIndex, appearIndex) => {
        this.later(
          () => this.spawnPopup(slotIndex, popupCount),
          80 + appearIndex * step
        );
      });

      const floodDone = 80 + popupCount * step + 2200;
      this.later(() => this.startStage4(), floodDone);
    }

    nextPopupMessage() {
      if (!this._msgQueue || !this._msgQueue.length) return '我想你了';
      const text = this._msgQueue[this._msgCursor % this._msgQueue.length];
      this._msgCursor += 1;
      // 一整轮后再洗一次牌
      if (this._msgCursor % this._msgQueue.length === 0) {
        for (let i = this._msgQueue.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this._msgQueue[i], this._msgQueue[j]] = [
            this._msgQueue[j],
            this._msgQueue[i],
          ];
        }
      }
      return text;
    }

    /** 网格铺满 + 轻微抖动，保证边角也有窗口 */
    buildFullscreenPopupSlots(w, h) {
      const cellW = 138;
      const cellH = 88;
      const cols = Math.ceil(w / cellW) + 1;
      const rows = Math.ceil(h / cellH) + 1;
      const slots = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const pw = 118 + Math.floor(Math.random() * 48);
          const ph = 64 + Math.floor(Math.random() * 22);
          // 交错排列，更密
          const stagger = r % 2 === 0 ? 0 : cellW * 0.35;
          let left = c * cellW - cellW * 0.25 + stagger + (Math.random() * 36 - 18);
          let top = r * cellH - cellH * 0.2 + (Math.random() * 28 - 14);
          left = Math.max(-20, Math.min(left, w - pw * 0.35));
          top = Math.max(-16, Math.min(top, h - ph * 0.35));
          slots.push({ left, top, pw, ph });
        }
      }

      // 再补一批纯随机，填缝、增加层次
      const extras = Math.floor(slots.length * 0.35);
      for (let i = 0; i < extras; i++) {
        const pw = 110 + Math.floor(Math.random() * 55);
        const ph = 60 + Math.floor(Math.random() * 24);
        slots.push({
          left: Math.random() * (w - pw * 0.5) - 10,
          top: Math.random() * (h - ph * 0.5) - 8,
          pw,
          ph,
        });
      }

      return slots;
    }

    spawnPopup(index, total) {
      if (!this.running || this.stage !== 3) return;
      const slot = (this._popupSlots && this._popupSlots[index]) || null;
      if (!slot) return;

      const win = document.createElement('div');
      win.className = 'love-popup';
      win.style.left = slot.left + 'px';
      win.style.top = slot.top + 'px';
      win.style.width = slot.pw + 'px';
      win.style.background = POPUP_COLORS[index % POPUP_COLORS.length];
      win.style.zIndex = String(10 + (index % 80));

      const title = document.createElement('div');
      title.className = 'love-popup-title';
      title.innerHTML = '<span>❤ Message</span><span class="love-popup-dots">● ● ●</span>';

      const body = document.createElement('div');
      body.className = 'love-popup-body';
      body.textContent = this.nextPopupMessage();

      win.appendChild(title);
      win.appendChild(body);
      this.popupStage.appendChild(win);

      requestAnimationFrame(() => win.classList.add('show'));
    }

    startStage4() {
      if (!this.running) return;
      this.stage = 4;
      this.setHint('有一封信要给你…');
      this.finishToLetter();
    }

    finishToLetter() {
      this.clearTimers();
      this.lineAnim.stop();
      this.overlay.classList.add('fade-out');
      this.later(() => {
        this.overlay.classList.remove('active', 'fade-out');
        this.overlay.setAttribute('aria-hidden', 'true');
        this.resetStages();
        this.running = false;
        this.stage = 0;
        if (typeof this.onComplete === 'function') this.onComplete();
      }, 600);
    }

    skipToLetter() {
      if (!this.running) return;
      this.finishToLetter();
    }
  }

  global.RomanceSequence = RomanceSequence;
})(window);
