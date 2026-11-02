// かんたん採用スター診断（HP用・18問）v2。設問と採点は assets/star.js（診断ツール本体と同じ計算）を使う。
// 画面：導入（業種・ターゲット）→ 7領域を1画面ずつ（進捗ドット・自動スクロール）→ 結果（星の図・タイプ・3層メーター・7領域・中身×見え方マップ・採用の流れ・打ち手・おすすめ）
(function () {
  var SD = window.SD, Core = window.StarCore, root = document.getElementById('chk'), lead = document.getElementById('chkLead');
  if (!SD || !Core || !root) return;
  var KEY = 'kao_check_v2', UNK = '?', TH = 55;
  var LM = { in: '▲', out: '▼', eng: '◎' }, LC = { in: '#0f1f3d', out: '#e8622c', eng: '#1f9d6b' }, LD = { in: '条件・風土・成長という、会社の実態', out: '開示・素顔・共感という、外からの見え方', eng: '応募対応・選考・内定後の動かし方' };
  var AXD = { pay: '休日・残業・給与', stay: '定着・人間関係', grow: '育成・将来像', open: '数字の開示', face: '人の顔・写真・動画', heart: '働く理由の言葉', eng: '応募後の対応' };
  var ICO = { pay: 'yen', stay: 'heart', grow: 'up', open: 'eye', face: 'users', heart: 'megaphone', eng: 'repeat' };
  var STI = { aware: 'search', interest: 'eye', apply: 'doc', select: 'people', accept: 'handshake', retain: 'heart' };
  var st = { ind: 'all', target: 'young', ans: {}, step: 0 }, resumed = false;
  try { var s0 = JSON.parse(sessionStorage.getItem(KEY)); if (s0 && s0.ans) { st = s0; resumed = Object.keys(s0.ans).length > 0; } } catch (e) { }
  var secs = SD.order.map(function (k) { return SD.axes.filter(function (a) { return a.k === k; })[0]; });
  var total = secs.reduce(function (n, a) { return n + a.items.length; }, 0);
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); }
  function ic(k, cls) { return '<svg class="ic ' + (cls || '') + '" aria-hidden="true"><use href="#i-' + k + '"/></svg>'; }
  function isAns(v) { return v !== '' && v != null; }
  function answered() { return Object.keys(st.ans).filter(function (k) { return isAns(st.ans[k]); }).length; }
  function axDone(a) { return a.items.filter(function (it) { return isAns(st.ans[it.k]); }).length; }
  function co() { return { name: '', prof: { ind: st.ind, target: st.target }, ans: st.ans, cul: {} }; }
  function pct() { return Math.round(answered() / total * 100); }

  /* ---------- 進捗（ドット＋バー） ---------- */
  function head(cur) {
    return '<div class="ck-head"><div class="ck-dots">' + secs.map(function (a, i) {
      var n = i + 1, d = axDone(a), cls = n === cur ? 'cur' : d === a.items.length ? 'done' : d ? 'part' : '';
      return '<button type="button" class="' + cls + '" data-a="go" data-v="' + n + '" style="--c:' + LC[a.layer] + '" aria-label="' + esc(a.l) + '"><i>' + (d === a.items.length && n !== cur ? ic('check') : n) + '</i><span>' + a.l + '</span></button>';
    }).join('') + '</div><div class="ck-prog"><div><i style="width:' + pct() + '%"></i></div><span>' + answered() + ' / ' + total + '問　<b>' + pct() + '%</b></span></div></div>';
  }

  /* ---------- 導入 ---------- */
  function vIntro() {
    var know = [['star', '御社の採用タイプ', '「隠れ優良型」「取りこぼし型」など9タイプ。中身・見え方・動かし方の星の形で分かります。'], ['down', '人が離れている段階', '認知→興味→応募→選考→承諾→定着の6段階のうち、いちばん弱い場所。'], ['bulb', '今月できる打ち手', '費用をかけずに、すぐ始められる改善を最大3つ。']];
    return '<div class="ck-intro"><div class="ck-know"><span class="tag">WHAT YOU GET</span><h2>18問で、<em>3つ</em>が分かります。</h2>' +
      know.map(function (k) { return '<div class="ck-k"><span class="ibox">' + ic(k[0]) + '</span><div><b>' + k[1] + '</b><p>' + k[2] + '</p></div></div>'; }).join('') +
      '<div class="ck-meta"><span>' + ic('clock') + '約5分</span><span>' + ic('list') + '18問・7領域</span><span>' + ic('shield') + '登録不要・無料</span><span>' + ic('sparkle') + 'その場で結果</span></div></div>' +
      '<div class="ck-card ck-set"><span class="tag">STEP 0</span><h2>まず、2つだけ教えてください。</h2><p>業種によって休日・残業・離職率の平均が違うため、採点の基準を合わせます。</p>' +
      '<label class="ck-l">業種</label><div class="ck-pick">' + Object.keys(SD.bench).map(function (k) { return '<button type="button" class="' + (st.ind === k ? 'on' : '') + '" data-a="ind" data-v="' + k + '">' + SD.bench[k].l + '</button>'; }).join('') + '</div>' +
      '<label class="ck-l">いま、いちばん採用したい人</label><div class="ck-tg">' + Object.keys(SD.targets).map(function (k) { var ico = { young: 'users', exp: 'helmet', grad: 'grad' }[k] || 'users'; return '<button type="button" class="' + (st.target === k ? 'on' : '') + '" data-a="target" data-v="' + k + '">' + ic(ico) + '<b>' + SD.targets[k].l + '</b></button>'; }).join('') + '</div>' +
      '<div class="ck-nav"><span class="ck-pp">' + ic('shield') + '回答はこのブラウザにだけ保存され、送信されません。</span><button type="button" class="btn" data-a="go" data-v="1">' + (resumed && answered() ? '続きから診断する（' + answered() + '問回答済み）' : '診断をはじめる') + '</button></div></div></div>';
  }

  /* ---------- 設問（1領域＝1画面） ---------- */
  function vAxis(a, i) {
    var B = Core.benchOf(co());
    return head(i) + '<div class="ck-card ck-ax"><div class="ck-axh"><span class="ck-lay" style="color:' + LC[a.layer] + ';background:' + LC[a.layer] + '14">' + LM[a.layer] + ' ' + SD.layers[a.layer].l + '｜' + LD[a.layer] + '</span><h2><span class="ibox" style="color:' + LC[a.layer] + '">' + ic(ICO[a.k] || 'check') + '</span><span class="tt">' + a.l + '<small>' + a.q + '</small></span></h2></div>' +
      a.items.map(function (it, n) {
        var v = st.ans[it.k], done = isAns(v);
        return '<div class="ck-q' + (done ? ' done' : '') + '" id="q-' + it.k + '"><div class="ck-qh"><i>' + (done ? ic('check') : 'Q' + (n + 1)) + '</i><div><b>' + it.l + '</b><p>' + it.why + '</p></div></div>' + (it.o ?
          '<div class="ck-o">' + it.o.map(function (o, m) { return '<button type="button" class="' + (+v === m + 1 ? 'on' : '') + '" data-a="set" data-k="' + it.k + '" data-v="' + (m + 1) + '"><i>' + (m + 1) + '</i><span>' + o + '</span></button>'; }).join('') + '</div>' :
          '<div class="ck-n"><input type="number" step="any" inputmode="decimal" data-k="' + it.k + '" value="' + (v != null && v !== UNK ? esc(v) : '') + '" placeholder="数値"><span>' + it.n + '</span>' + (it.b ? '<button type="button" class="ck-avg" data-a="num" data-k="' + it.k + '" data-v="' + B[it.b] + '">業種の平均 ' + B[it.b] + it.n + ' を入れる</button>' : it.hint ? '<small>' + it.hint + '</small>' : '') + '</div>') +
          '<button type="button" class="ck-u ' + (v === UNK ? 'on' : '') + '" data-a="set" data-k="' + it.k + '" data-v="' + UNK + '">' + (v === UNK ? '✓ 把握していない' : '把握していない・分からない') + '</button></div>';
      }).join('') +
      '<div class="ck-nav"><button type="button" class="btn ghost" data-a="go" data-v="' + (i - 1) + '">' + (i === 1 ? '最初に戻る' : '← 前の領域') + '</button><span class="ck-cnt">' + axDone(a) + ' / ' + a.items.length + '問</span><button type="button" class="btn' + (axDone(a) === a.items.length ? ' ready' : '') + '" data-a="go" data-v="' + (i + 1) + '">' + (i === secs.length ? '結果を見る' : '次の領域へ →') + '</button></div></div>';
  }

  /* ---------- 結果の部品 ---------- */
  function meter(l, v, c, sub) { return '<div class="ck-m"><div class="ck-ml"><span style="color:' + c + '">' + l + '</span><small>' + sub + '</small></div><div class="ck-mb"><i style="width:' + (v == null ? 0 : v) + '%;background:' + c + '"></i><em style="left:' + TH + '%"></em></div><b>' + (v == null ? '―' : v) + '</b></div>'; }
  function status(s) { return s == null ? ['未回答', '#8a92a6'] : s >= 75 ? ['強み', '#128a5a'] : s >= TH ? ['平均以上', '#27457f'] : s > 40 ? ['平均以下', '#b7791f'] : ['課題', '#c8372d']; }
  function axGrid(R) {
    return '<div class="ck-axg">' + SD.axes.map(function (a) { var s = R.ax[a.k].s, t = status(s); return '<div class="ck-axc" style="--c:' + LC[a.layer] + '"><div class="ck-axt"><span>' + LM[a.layer] + ' ' + SD.layers[a.layer].l + '</span><em style="color:' + t[1] + ';border-color:' + t[1] + '">' + t[0] + '</em></div><b>' + a.l + '</b><small>' + (AXD[a.k] || '') + '</small><div class="ck-axs"><strong>' + (s == null ? '―' : s) + '</strong><div><i style="width:' + (s || 0) + '%"></i><em style="left:' + TH + '%"></em></div></div></div>'; }).join('') + '</div>';
  }
  function pairMap(R) {
    var W = 320, H = 260, L = 44, B = 36, pw = W - L - 12, ph = H - B - 12;
    var X = function (v) { return L + pw * v / 100; }, Y = function (v) { return 12 + ph * (1 - v / 100); };
    var qd = [['weapon', X(TH), Y(100), X(100) - X(TH), Y(TH) - Y(100)], ['buried', X(0), Y(100), X(TH) - X(0), Y(TH) - Y(100)], ['wrap', X(TH), Y(TH), X(100) - X(TH), Y(0) - Y(TH)], ['weak', X(0), Y(TH), X(TH) - X(0), Y(0) - Y(TH)]];
    var pts = R.pairs.filter(function (p) { return p.sa != null && p.sb != null; });
    return '<svg class="ck-map" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="中身と見え方のマップ">' +
      qd.map(function (q) { return '<rect x="' + q[1] + '" y="' + q[2] + '" width="' + q[3] + '" height="' + q[4] + '" fill="' + SD.quad[q[0]].c + '" opacity=".09"/><text x="' + (q[1] + q[3] / 2) + '" y="' + (q[2] + 16) + '" font-size="9.5" font-weight="900" fill="' + SD.quad[q[0]].c + '" text-anchor="middle">' + SD.quad[q[0]].n.split('（')[0] + '</text>'; }).join('') +
      '<line x1="' + L + '" y1="' + Y(0) + '" x2="' + W + '" y2="' + Y(0) + '" stroke="#c5cad6"/><line x1="' + L + '" y1="12" x2="' + L + '" y2="' + Y(0) + '" stroke="#c5cad6"/>' +
      '<line x1="' + X(TH) + '" y1="12" x2="' + X(TH) + '" y2="' + Y(0) + '" stroke="#c5cad6" stroke-dasharray="3 4"/><line x1="' + L + '" y1="' + Y(TH) + '" x2="' + W + '" y2="' + Y(TH) + '" stroke="#c5cad6" stroke-dasharray="3 4"/>' +
      '<text x="' + (L + pw / 2) + '" y="' + (H - 8) + '" font-size="10" font-weight="700" fill="#e8622c" text-anchor="middle">▼ 見え方（発信）→</text><text transform="translate(12 ' + (12 + ph / 2) + ') rotate(-90)" font-size="10" font-weight="700" fill="#0f1f3d" text-anchor="middle">▲ 中身（実態）→</text>' +
      pts.map(function (p) { return '<g transform="translate(' + X(p.sb) + ' ' + Y(p.sa) + ')"><circle r="9" fill="' + SD.quad[p.q].c + '" stroke="#fff" stroke-width="2.5"/><text y="-13" font-size="10" font-weight="900" fill="#0f1f3d" text-anchor="middle">' + p.t.split(' ― ')[0] + '</text></g>'; }).join('') + '</svg>';
  }
  function pairs(R) {
    return '<div class="ck-pairs"><div class="ck-mapw">' + pairMap(R) + '<p class="note">横軸＝見え方の点数、縦軸＝中身の点数。右上が「武器」、左上が「埋蔵資産（伝えるだけで変わる）」。</p></div><div class="ck-pl">' +
      R.pairs.map(function (p) { var q = p.q ? SD.quad[p.q] : null; return '<div class="ck-pr" style="--c:' + (q ? q.c : '#c5cad6') + '"><div class="ck-prh"><b>' + p.t + '</b>' + (q ? '<em style="color:' + q.c + '">' + q.n + '</em>' : '<em>判定前</em>') + '</div><div class="ck-prs"><span>▲ ' + (p.sa == null ? '―' : p.sa) + '</span><span style="color:#e8622c">▼ ' + (p.sb == null ? '―' : p.sb) + '</span>' + (p.gap != null ? '<span>差 ' + (p.gap > 0 ? '+' : '') + p.gap + '</span>' : '') + '</div><p>' + (q ? p.msg[p.q] : p.d) + '</p></div>'; }).join('') + '</div></div>';
  }
  function funnel(R) {
    return '<div class="ck-fun">' + R.stage.map(function (s) { var leak = R.leak && R.leak.k === s.k, t = status(s.s); return '<div class="ck-st' + (leak ? ' leak' : '') + '"><span class="ibox">' + ic(STI[s.k] || 'check') + '</span><b>' + s.l + '</b><small>' + s.d + '</small><strong style="color:' + (leak ? '#c8372d' : t[1]) + '">' + (s.s == null ? '―' : s.s) + '</strong>' + (leak ? '<em>ここで離れている</em>' : '') + '</div>'; }).join('') + '</div>' +
      (R.leak ? '<div class="ck-leak"><span class="ibox n">' + ic('flag') + '</span><div><b>いちばん弱い段階：' + R.leak.l + '（' + R.leak.d + '）</b><p>' + R.leak.msg + '</p></div></div>' : '<p class="note">4つ以上の段階に回答すると、人が離れている段階を判定します。</p>');
  }

  /* ---------- 結果 ---------- */
  function vResult() {
    var R = Core.calc(co()), T = R.ready ? SD.types[R.type] : null, L = R.layer, O = R.offer;
    var acts = R.issues.filter(function (i) { return i.ef === 1; }).slice(0, 3), kao = R.issues.filter(function (i) { return i.kao; }).length;
    var big = R.pairs.filter(function (p) { return p.q; }).sort(function (a, b) { return Math.abs(b.gap) - Math.abs(a.gap); })[0];
    var strong = R.strong.slice(0, 2);
    var sum = 'かんたん採用スター診断の結果（' + new Date().toLocaleDateString('ja-JP') + '）\n業種：' + R.bench.l + '／ターゲット：' + SD.targets[R.target].l + '\nタイプ：' + (T ? T.n : '判定前') + '\n中身 ' + L.in + '／見え方 ' + L.out + '／動かし方 ' + L.eng + '\n領域別：' + SD.axes.map(function (a) { return a.l + ' ' + (R.ax[a.k].s == null ? '-' : R.ax[a.k].s); }).join('、') + '\n中身×見え方：' + R.pairs.map(function (p) { return p.t.split(' ― ')[0] + '=' + (p.q ? SD.quad[p.q].n.split('（')[0] : '-'); }).join('、') + '\n離脱ポイント：' + (R.leak ? R.leak.l : '-') + '\n把握していない設問：' + R.unknown + '問\n回答：' + JSON.stringify(st.ans);
    var hid = document.getElementById('chkSum'); if (hid) hid.value = sum;
    if (lead) lead.hidden = false;
    var h = '<div class="ck-rhead"><span class="tag">RESULT</span><h2>診断結果</h2><div class="ck-tools"><button type="button" class="ck-tb" data-a="copy">' + ic('doc') + '結果をコピー</button><button type="button" class="ck-tb" data-a="print">' + ic('pamphlet') + '印刷・PDF</button><button type="button" class="ck-tb" data-a="go" data-v="1">' + ic('pen') + '回答を見直す</button><button type="button" class="ck-tb" data-a="reset">' + ic('repeat') + 'やり直す</button></div></div>';
    h += '<div class="ck-res"><div class="ck-star">' + Core.svg(R, { id: 'chk' }) + '<div class="lg"><span class="i">▲ 中身</span><span class="o">▼ 見え方</span><span style="color:#1f9d6b">◎ 動かし方（外周）</span></div></div>' +
      '<div class="ck-type">' + (T ? '<span class="ck-tb2" style="background:' + T.c + '">御社のタイプ</span><h2 style="color:' + T.c + '">' + T.n + '</h2><p>' + T.d + '</p>' : '<span class="ck-tb2" style="background:#8a92a6">判定前</span><h2>あと少しで、タイプが出ます</h2><p>7つの領域それぞれに、1問以上お答えください。「把握していない」だけの領域があると判定できません。</p>') +
      meter('▲ 中身', L.in, LC.in, '実態') + meter('▼ 見え方', L.out, LC.out, '発信') + meter('◎ 動かし方', L.eng, LC.eng, '採用活動') + '<p class="ck-avgn">点線＝業界平均の目安（' + TH + '点）。' + (R.known != null ? '把握率 ' + R.known + '%' : '') + (R.unknown ? '・「把握していない」' + R.unknown + '問' : '') + '</p></div></div>';
    if (T) h += '<div class="grid g3 ck-g3"><div class="card"><span class="ck-ct">' + ic('eye') + 'いま起きていること</span><p>' + T.now + '</p></div><div class="card"><span class="ck-ct">' + ic('flag') + '最初にやること</span><p>' + T.first + '</p></div><div class="card"><span class="ck-ct">' + ic('shield') + 'やってはいけないこと</span><p>' + T.dont + '</p></div></div>';
    h += '<div class="ck-sec"><span class="tag">7 AREAS</span><h3>7つの領域の点数</h3>' + axGrid(R) + (strong.length ? '<div class="ck-strong">' + ic('sparkle') + '<b>強み：</b>' + strong.map(function (i) { return i.l; }).join('／') + '</div>' : '') + '</div>';
    h += '<div class="ck-sec"><span class="tag">INSIDE × OUTSIDE</span><h3>中身 × 見え方のマップ</h3><p class="lead">「中身は良いのに伝わっていない」場所（埋蔵資産）は、伝えるだけで結果が変わります。' + (big ? '最も差が大きいのは「' + big.t + '」（' + Math.abs(big.gap) + '点差）。' : '') + '</p>' + pairs(R) + '</div>';
    h += '<div class="ck-sec"><span class="tag">FUNNEL</span><h3>採用の流れ：どこで人が離れているか</h3>' + funnel(R) + '</div>';
    if (acts.length) h += '<div class="ck-sec"><span class="tag">THIS MONTH</span><h3>費用をかけずに、今月できること</h3><div class="ck-acts">' + acts.map(function (x, n) { return '<div class="ck-act"><i>' + (n + 1) + '</i><div><b>' + LM[x.layer] + ' ' + x.axl + '｜' + x.l + '</b><p>' + x.fix + '</p></div></div>'; }).join('') + '</div>' + (kao ? '<p class="note">このほか、「採用の顔」の制作物と顧問で対応できる課題が ' + kao + ' 件あります。</p>' : '') + '</div>';
    if (O) h += '<div class="ck-offer"><div><span class="tag" style="color:#ffb48f">この結果からのおすすめ</span><h3>' + SD.plans[O.main].n + '<small>' + SD.plans[O.main].p + '</small></h3><ul>' + O.why.map(function (w) { return '<li>' + w + '</li>'; }).join('') + '</ul>' + (O.alt && SD.plans[O.alt] ? '<p class="ck-alt">別の選択肢：' + SD.plans[O.alt].n + '（' + SD.plans[O.alt].p + '）</p>' : '') + '</div><a class="btn" href="#chkLead">詳しい診断を無料で受ける</a></div>';
    h += '<p class="note" style="margin-top:22px">この結果は18問の簡易版です。詳細版（37問）では、課題ごとの優先順位、社風カラー、勝ち筋まで診断します。自己申告にもとづく簡易診断で、統計的に検証された指標ではありません。</p>';
    return h;
  }

  /* ---------- 描画・操作 ---------- */
  function render(scroll) {
    var n = st.step;
    if (lead) lead.hidden = true;
    root.className = 'ck v' + (n === 0 ? 'intro' : n <= secs.length ? 'axis' : 'result');
    root.innerHTML = n === 0 ? vIntro() : n <= secs.length ? vAxis(secs[n - 1], n) : vResult();
    if (scroll) root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function nextQ(k) { // 回答した設問の次の未回答へスクロール
    var a = secs[st.step - 1]; if (!a) return; var idx = -1;
    a.items.forEach(function (it, i) { if (it.k === k) idx = i; });
    for (var i = idx + 1; i < a.items.length; i++) if (!isAns(st.ans[a.items[i].k])) { var el = document.getElementById('q-' + a.items[i].k); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    var nv = root.querySelector('.ck-nav .btn.ready'); if (nv) nv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  root.addEventListener('click', function (e) {
    var t = e.target.closest('[data-a]'); if (!t) return; var a = t.dataset.a, v = t.dataset.v, k = t.dataset.k;
    if (a === 'ind') st.ind = v; else if (a === 'target') st.target = v;
    else if (a === 'set') { var nv = v === UNK ? UNK : +v; st.ans[k] = st.ans[k] === nv ? '' : nv; save(); render(); if (isAns(st.ans[k])) nextQ(k); return; }
    else if (a === 'num') { st.ans[k] = +v; save(); render(); nextQ(k); return; }
    else if (a === 'go') { st.step = Math.max(0, +v); save(); render(1); return; }
    else if (a === 'reset') { if (!confirm('回答を消して、最初からやり直しますか？')) return; st = { ind: 'all', target: 'young', ans: {}, step: 0 }; save(); render(1); return; }
    else if (a === 'copy') { var hid = document.getElementById('chkSum'); var txt = hid ? hid.value : ''; (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { t.innerHTML = ic('check') + 'コピーしました'; }, function () { prompt('結果のテキスト（コピーしてお使いください）', txt); }); return; }
    else if (a === 'print') { window.print(); return; }
    save(); render();
  });
  root.addEventListener('change', function (e) { var t = e.target; if (t.tagName === 'INPUT' && t.dataset.k) { st.ans[t.dataset.k] = t.value === '' ? '' : +t.value; save(); render(); if (t.value !== '') nextQ(t.dataset.k); } });
  render();
})();
