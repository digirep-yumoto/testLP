// かんたん採用スター診断（HP用・18問）。設問と採点は assets/star.js（診断ツール本体と同じ計算）を使う。
(function () {
  var SD = window.SD, Core = window.StarCore, root = document.getElementById('chk'), lead = document.getElementById('chkLead');
  if (!SD || !Core || !root) return;
  var KEY = 'kao_check_v1', UNK = '?', LM = { in: '▲', out: '▼', eng: '◎' }, LC = { in: '#0f1f3d', out: '#e8622c', eng: '#1f9d6b' };
  var st = { ind: 'all', target: 'young', ans: {}, step: 0 };
  try { var s = JSON.parse(sessionStorage.getItem(KEY)); if (s && s.ans) st = s; } catch (e) { }
  var secs = SD.order.map(function (k) { return SD.axes.filter(function (a) { return a.k === k; })[0]; });
  var total = secs.reduce(function (n, a) { return n + a.items.length; }, 0);
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); }
  function answered() { return Object.keys(st.ans).filter(function (k) { return st.ans[k] !== '' && st.ans[k] != null; }).length; }
  function co() { return { name: '', prof: { ind: st.ind, target: st.target }, ans: st.ans, cul: {} }; }
  function prog() { var p = Math.round(answered() / total * 100); return '<div class="ck-prog"><div><i style="width:' + p + '%"></i></div><span>' + answered() + ' / ' + total + '問</span></div>'; }

  function vIntro() {
    return '<div class="ck-card"><span class="tag">STEP 0</span><h2>まず、2つだけ教えてください。</h2><p>業種によって休日・残業・離職率の平均が違うため、採点の基準を合わせます。</p>' +
      '<label class="ck-l">業種</label><div class="ck-pick">' + Object.keys(SD.bench).map(function (k) { return '<button type="button" class="' + (st.ind === k ? 'on' : '') + '" data-a="ind" data-v="' + k + '">' + SD.bench[k].l + '</button>'; }).join('') + '</div>' +
      '<label class="ck-l">いま、いちばん採用したい人</label><div class="ck-pick">' + Object.keys(SD.targets).map(function (k) { return '<button type="button" class="' + (st.target === k ? 'on' : '') + '" data-a="target" data-v="' + k + '">' + SD.targets[k].l + '</button>'; }).join('') + '</div>' +
      '<div class="ck-nav"><span></span><button type="button" class="btn" data-a="go" data-v="1">診断をはじめる</button></div></div>';
  }
  function vAxis(a, i) {
    var B = Core.benchOf(co());
    return '<div class="ck-card"><span class="tag" style="color:' + LC[a.layer] + '">STEP ' + i + ' / ' + secs.length + '　' + LM[a.layer] + ' ' + SD.layers[a.layer].l + '</span><h2>' + a.l + '<small>' + a.q + '</small></h2>' +
      a.items.map(function (it) {
        var v = st.ans[it.k];
        return '<div class="ck-q"><b>' + it.l + '</b><p>' + it.why + '</p>' + (it.o ?
          '<div class="ck-o">' + it.o.map(function (o, n) { return '<button type="button" class="' + (+v === n + 1 ? 'on' : '') + '" data-a="set" data-k="' + it.k + '" data-v="' + (n + 1) + '"><i>' + (n + 1) + '</i>' + o + '</button>'; }).join('') + '</div>' :
          '<div class="ck-n"><input type="number" step="any" inputmode="decimal" data-k="' + it.k + '" value="' + (v != null && v !== UNK ? esc(v) : '') + '" placeholder="数値"><span>' + it.n + '</span>' + (it.b ? '<small>業種の平均：' + B[it.b] + it.n + '</small>' : it.hint ? '<small>' + it.hint + '</small>' : '') + '</div>') +
          '<button type="button" class="ck-u ' + (v === UNK ? 'on' : '') + '" data-a="set" data-k="' + it.k + '" data-v="' + UNK + '">' + (v === UNK ? '✓ 把握していない' : '把握していない・分からない') + '</button></div>';
      }).join('') +
      '<div class="ck-nav"><button type="button" class="btn ghost" data-a="go" data-v="' + (i - 1) + '">戻る</button><button type="button" class="btn" data-a="go" data-v="' + (i + 1) + '">' + (i === secs.length ? '結果を見る' : '次へ') + '</button></div></div>';
  }
  function bar(l, v, c) { return '<div class="ck-b"><span style="color:' + c + '">' + l + '</span><div><i style="width:' + (v == null ? 0 : v) + '%;background:' + c + '"></i></div><b>' + (v == null ? '―' : v) + '</b></div>'; }
  function vResult() {
    var R = Core.calc(co()), T = R.ready ? SD.types[R.type] : null, L = R.layer;
    var big = R.pairs.filter(function (p) { return p.q; }).sort(function (a, b) { return Math.abs(b.gap) - Math.abs(a.gap); })[0];
    var acts = R.issues.filter(function (i) { return i.ef === 1; }).slice(0, 2), O = R.offer;
    var sum = 'かんたん採用スター診断の結果\n業種：' + R.bench.l + '／ターゲット：' + SD.targets[R.target].l + '\nタイプ：' + (T ? T.n : '判定前') + '\n中身 ' + L.in + '／見え方 ' + L.out + '／動かし方 ' + L.eng + '\n領域別：' + SD.axes.map(function (a) { return a.l + ' ' + (R.ax[a.k].s == null ? '-' : R.ax[a.k].s); }).join('、') + '\n離脱ポイント：' + (R.leak ? R.leak.l : '-') + '\n把握していない設問：' + R.unknown + '問\n回答：' + JSON.stringify(st.ans);
    var hid = document.getElementById('chkSum'); if (hid) hid.value = sum;
    if (lead) lead.hidden = false;
    return '<div class="ck-res"><div class="ck-star">' + Core.svg(R, { id: 'chk' }) + '<div class="lg"><span class="i">▲ 中身</span><span class="o">▼ 見え方</span><span style="color:#1f9d6b">◎ 動かし方</span></div></div>' +
      '<div>' + (T ? '<span class="tag">御社のタイプ</span><h2 style="color:' + T.c + '">' + T.n + '</h2><p>' + T.d + '</p>' : '<span class="tag">診断の途中です</span><h2>あと少しで、タイプが出ます</h2><p>7つの領域それぞれに、1問以上お答えください。「把握していない」だけの領域があると、判定できません。</p>') +
      bar('▲ 中身', L.in, LC.in) + bar('▼ 見え方', L.out, LC.out) + bar('◎ 動かし方', L.eng, LC.eng) + '</div></div>' +
      (T ? '<div class="grid g3" style="margin-top:22px">' +
        '<div class="card"><h3>いま起きていること</h3><p>' + T.now + '</p></div>' +
        (big ? '<div class="card"><h3>いちばん大きな差</h3><p><b style="color:' + SD.quad[big.q].c + '">' + big.t + '：' + SD.quad[big.q].n + '</b><br>' + big.msg[big.q] + '</p></div>' : '') +
        (R.leak ? '<div class="card"><h3>人が離れている段階：' + R.leak.l + '</h3><p>' + R.leak.msg + '</p></div>' : '') + '</div>' : '') +
      (acts.length ? '<div class="ck-card" style="margin-top:22px"><span class="tag">今月できること</span><h2 style="font-size:22px">費用をかけずに、すぐ始められる打ち手</h2>' + acts.map(function (x) { return '<div class="ck-act"><b>' + LM[x.layer] + x.axl + '｜' + x.l + '</b>' + x.fix + '</div>'; }).join('') + '</div>' : '') +
      (O ? '<div class="ck-offer"><div><span class="tag" style="color:#ffb48f">この結果からのおすすめ</span><h3>' + SD.plans[O.main].n + '<small>' + SD.plans[O.main].p + '</small></h3><p>' + (O.why[0] || '') + '</p></div><a class="btn" href="#chkLead">詳しい診断を無料で受ける</a></div>' : '') +
      (R.unknown ? '<p class="note">「把握していない」と答えた設問が' + R.unknown + '問あります。自社の数字を知ることが、最初の一歩です。</p>' : '') +
      '<p class="note">この結果は18問の簡易版です。詳細版（37問）では、課題ごとの優先順位、社風カラー、勝ち筋まで診断します。自己申告にもとづく簡易診断で、統計的に検証された指標ではありません。</p>' +
      '<div class="ck-nav"><button type="button" class="btn ghost" data-a="go" data-v="' + secs.length + '">回答を見直す</button><button type="button" class="btn ghost" data-a="reset">最初からやり直す</button></div>';
  }
  function render(scroll) {
    var n = st.step;
    if (lead) lead.hidden = true;
    root.innerHTML = (n > 0 ? prog() : '') + (n === 0 ? vIntro() : n <= secs.length ? vAxis(secs[n - 1], n) : vResult());
    if (scroll) root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  root.addEventListener('click', function (e) {
    var t = e.target.closest('[data-a]'); if (!t) return; var a = t.dataset.a, v = t.dataset.v, k = t.dataset.k;
    if (a === 'ind') st.ind = v; else if (a === 'target') st.target = v;
    else if (a === 'set') { var nv = v === UNK ? UNK : +v; st.ans[k] = st.ans[k] === nv ? '' : nv; }
    else if (a === 'go') { st.step = Math.max(0, +v); save(); render(1); return; }
    else if (a === 'reset') { st = { ind: 'all', target: 'young', ans: {}, step: 0 }; save(); render(1); return; }
    save(); render();
  });
  root.addEventListener('change', function (e) { var t = e.target; if (t.tagName === 'INPUT' && t.dataset.k) { st.ans[t.dataset.k] = t.value === '' ? '' : +t.value; save(); render(); } });
  render();
})();
