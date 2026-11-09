/* 採用の顔：書類の雛形（見積書・申込書と約款・請求書・納品書兼検収確認書・出演掲載同意書・ヒアリングシート・月次レポート）。
   データを渡すとA4縦のHTMLを返す。データが空なら、下線つきの空欄（手書き用）になる。ブラウザでも node でも使える。 */
(function (root) {
'use strict';
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
const BL = w => `<span class="bl" style="min-width:${w || 30}mm">　</span>`, tx = (v, w) => v !== '' && v != null ? esc(v).replace(/\n/g, '<br>') : BL(w);
const yen = n => '¥' + Math.round(n || 0).toLocaleString(), jd = d => d ? d.replace(/^(\d+)-0?(\d+)-0?(\d+)$/, '$1年$2月$3日') : '　　　　年　　月　　日';
const PL = {
  std: { n: '「採用の顔」スタンダード', price: 1280000, days: 30, free: 3, items: ['採用キャッチコピー（3案から決定）・採用ロゴ', '採用ページ（1ページ）の制作と公開設定', '現地取材・撮影（1日）', '採用PR動画 30秒 1本', 'ブランディング動画 1本', '採用パンフレット A4・4ページ（印刷用データ）', '名刺デザイン（表・裏、印刷用データ）', '採用運用顧問 3ヶ月'] },
  light: { n: '「採用の顔」ライト', price: 880000, days: 15, free: 1, items: ['採用キャッチコピー（3案から決定）・採用ロゴ', '採用ページ（1ページ）の制作と公開設定', '採用PR動画 30秒 1本（ご提供素材で制作）', '採用パンフレット A4・4ページ（印刷用データ）', '名刺デザイン（表・裏、印刷用データ）', '採用運用顧問 1ヶ月'] },
  lp: { n: '採用LP単体プラン', price: 300000, days: 10, free: 0, items: ['採用キャッチコピー（3案から決定）', '採用ページ（1ページ）の制作と公開設定'] },
  adv: { n: '採用運用顧問', price: 0, monthly: 100000, days: 0, free: 0, items: ['Web面談 月2回（各45分）', '求人票の添削・書き換え', '採用ページの更新', 'SNS投稿素材 月8本', '月次レポート'] },
  lpadv: { n: '採用LP単体プラン ＋ 採用運用顧問', price: 300000, monthly: 100000, days: 10, free: 0, items: ['採用キャッチコピー（3案から決定）', '採用ページ（1ページ）の制作と公開設定', '採用運用顧問（月2回の面談・求人票の書き換え・採用ページの更新・SNS投稿素材 月8本）'] },
  sales: { n: '「営業の顔」スタート', price: 580000, days: 15, free: 1, mn: '営業運用顧問', items: ['営業資料（会社・サービス紹介 12〜16枚。PDFと編集用データ）', 'サービス紹介ページ（1ページ・お問い合わせフォームつき）の制作と公開設定', '営業トーク集（電話・商談・お問い合わせへの返信）', '営業文面テンプレート 10種（メール・フォーム・SNS）', '営業運用顧問 1ヶ月'], deliv: [['営業資料', 'PDF／編集用データ（PowerPoint形式）'], ['サービス紹介ページ', '公開URL ／更新方法の説明'], ['営業トーク集', 'PDF／テキストデータ'], ['営業文面テンプレート 10種', 'テキストデータ']] },
  salesf: { n: '「営業の顔」フル', price: 980000, days: 30, free: 3, mn: '営業運用顧問', items: ['営業資料（会社・サービス紹介 12〜16枚。PDFと編集用データ）', 'サービス紹介ページ（1ページ・お問い合わせフォームつき）の制作と公開設定', '営業トーク集と、営業文面テンプレート 10種', '営業管理ツール（顧客・案件・やること・数字）の設定と導入', '現在の顧客リストの取り込み（1回）・使い方のご説明（60分×2回）', '営業運用顧問 3ヶ月'], deliv: [['営業資料', 'PDF／編集用データ（PowerPoint形式）'], ['サービス紹介ページ', '公開URL ／更新方法の説明'], ['営業トーク集・営業文面テンプレート 10種', 'PDF／テキストデータ'], ['営業管理ツール', 'HTMLファイル（ブラウザで開いて使用）／使い方の説明書'], ['顧客リストの取り込み', '取り込み済みの状態でお渡し']] },
  sret: { n: '営業運用顧問', price: 0, monthly: 100000, days: 0, free: 0, mn: '営業運用顧問', items: ['Web面談 月2回（各45分）', '営業資料・サービス紹介ページの更新', '営業文面の追加 月4本', '営業管理ツールの改修', '月次の数字の振り返り'] },
  both: { n: '両輪顧問（採用＋営業）', price: 0, monthly: 180000, days: 0, free: 0, mn: '両輪顧問（採用運用顧問＋営業運用顧問）', items: ['Web面談 月2回（各60分。採用と営業をまとめて）', '求人票の添削・書き換え／採用ページの更新／SNS投稿素材 月8本', '営業資料・サービス紹介ページの更新／営業文面の追加 月4本', '採用管理ツール・営業管理ツールの改修', '月次レポート（採用と営業の数字）'] },
  ats: { n: '採用管理ツール 導入', price: 100000, days: 5, free: 0, items: ['採用管理ツール（応募から入社・定着までの記録と集計）', '職種・求人媒体など、御社に合わせた初期設定', '使い方のご説明（Web 60分）'], deliv: [['採用管理ツール', 'HTMLファイル（ブラウザで開いて使用）'], ['初期設定', '設定済みの状態でお渡し'], ['使い方の説明書', 'PDF']], noadv: 1 },
  dr_b: { n: '採用の顔 新卒ダイレクト ベーシック（入社3名保証・年間）', price: 2500000, list: 2700000, days: 0, free: 0, noadv: 1, items: ['採用計画の立案・人物像の設計', '学生プールの構築とスカウト（全国213大学との接点）', '面談設定・魅力訴求・選考フォローの代行', '入社導線の設計（内定後フォロー・育成プログラム）', '入社3名の保証（届くまで無料延長・翌年持ち越し可／入社後3か月以内の退職はその人数を達成に数えず無料で継続）', '当社による月次の進捗共有・3ヶ月レビュー'], deliv: [['採用計画書・人物像', 'PDF'], ['月次レポート（プール・スカウト・面談・承諾）', 'PDF／メール'], ['内定承諾の確認', '承諾書の写し']], pay: '年額一括（税別）。ご契約とご請求は運営パートナーの株式会社UNTIMINAL、お申込み・お見積り・月次の進捗共有は当社' },
  dr_s: { n: '採用の顔 新卒ダイレクト スタンダード（入社5名保証・年間）', price: 3150000, list: 3400000, days: 0, free: 0, noadv: 1, items: ['採用計画の立案・人物像の設計', '学生プールの構築とスカウト（全国213大学との接点）', '実務インターン・事業運営の経験を持つ学生の紹介', '面談設定・魅力訴求・選考フォローの代行', '入社導線の設計（内定後フォロー・育成プログラム）', '入社5名の保証（届くまで無料延長・翌年持ち越し可／入社後3か月以内の退職はその人数を達成に数えず無料で継続）', '当社による月次の進捗共有・3ヶ月レビュー'], deliv: [['採用計画書・人物像', 'PDF'], ['月次レポート（プール・スカウト・面談・承諾）', 'PDF／メール'], ['内定承諾の確認', '承諾書の写し']], pay: '年額一括（税別）。ご契約とご請求は運営パートナーの株式会社UNTIMINAL、お申込み・お見積り・月次の進捗共有は当社' },
  dr_p: { n: '採用の顔 新卒ダイレクト プレミアム（入社5名保証・年間）', price: 3600000, list: 3900000, days: 0, free: 0, noadv: 1, items: ['採用計画の立案・人物像の設計', '学生プールの構築とスカウト（全国213大学との接点）', '起業経験・顕著な実績を持つ学生の紹介', '面談設定・魅力訴求・選考フォローの代行', '入社導線の設計（内定後フォロー・育成プログラム）', '入社5名の保証（届くまで無料延長・翌年持ち越し可／入社後3か月以内の退職はその人数を達成に数えず無料で継続）', '当社による月次の進捗共有・3ヶ月レビュー'], deliv: [['採用計画書・人物像', 'PDF'], ['月次レポート（プール・スカウト・面談・承諾）', 'PDF／メール'], ['内定承諾の確認', '承諾書の写し']], pay: '年額一括（税別）。ご契約とご請求は運営パートナーの株式会社UNTIMINAL、お申込み・お見積り・月次の進捗共有は当社' },
  prem: { n: '「採用の顔」プレミア', price: 2000000, days: 45, free: 3, items: ['スタンダードの全内容', '個別お見積りの内容（別紙）'] }
};
const BIZ0 = { name: 'デジレップ株式会社', rep: '湯本 達也', zip: '352-0003', addr: '埼玉県新座市畑中1-13-16', tel: '080-5527-1689', mail: 'digirep.yumoto@gmail.com', reg: 'T8010501052465', bank: 'ドコモＳＭＴＢネット銀行', branch: '法人第一支店', kind: '普通', acct: '2501546', holder: 'デジレップ株式会社', payDays: 7 };
const CSS = `
@page{size:A4;margin:0}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;background:#777;font-family:"Yu Gothic","Hiragino Kaku Gothic ProN","Meiryo",sans-serif;color:#1c2333;font-size:10pt;line-height:1.65}
.p{width:210mm;min-height:297mm;background:#fff;margin:0 auto 6mm;padding:12mm 16mm 11mm;position:relative;page-break-after:always}
.p:last-of-type{page-break-after:auto;margin-bottom:0}
@media print{body{background:#fff}.p{margin:0}.pbtn{display:none}}
h1{font-size:19pt;text-align:center;letter-spacing:.3em;margin:0 0 5mm;color:#0f1f3d;border-bottom:.8mm solid #0f1f3d;padding-bottom:2.5mm}
h2{font-size:11pt;color:#fff;background:#0f1f3d;padding:1.1mm 3mm;margin:3.5mm 0 1.6mm;border-radius:1mm}
h3{font-size:10pt;color:#0f1f3d;margin:3mm 0 1mm;border-left:1.2mm solid #e8622c;padding-left:2.5mm}
.hd{display:grid;grid-template-columns:1fr 78mm;gap:8mm;margin-bottom:3mm}
.to{font-size:13pt;font-weight:700;border-bottom:1px solid #1c2333;padding-bottom:1mm;margin-bottom:2mm}
.fr{font-size:9pt;line-height:1.6}.fr b{font-size:10.5pt}
.meta{text-align:right;font-size:9pt;margin-bottom:3mm}
.tot{border:.6mm solid #0f1f3d;border-radius:1.5mm;padding:3mm 5mm;display:flex;justify-content:space-between;align-items:baseline;margin:3mm 0}
.tot b{font-size:17pt;color:#0f1f3d}
table{width:100%;border-collapse:collapse}
th{background:#eef0f5;text-align:left;padding:1.7mm 2.5mm;font-size:9pt;border:1px solid #c9cfdb}
td{padding:1.4mm 2.5mm;border:1px solid #c9cfdb;vertical-align:top}
td.n,th.n{text-align:right;white-space:nowrap}td.k{background:#f6f7fa;width:32mm;font-weight:700;font-size:9.2pt}
.bl{display:inline-block;border-bottom:1px solid #8a93a8;height:1.25em;vertical-align:bottom}
.ln{border-bottom:1px solid #b0b7c6;height:8mm}
.sm{font-size:8.3pt;color:#4a5368;line-height:1.55}
.tm{columns:2;column-gap:7mm;font-size:8pt;line-height:1.55}.tm p{margin:0 0 1.6mm;break-inside:avoid}.tm b{color:#0f1f3d}
.sg{display:grid;grid-template-columns:1fr 1fr;gap:6mm;margin-top:4mm}.tight{font-size:9.2pt;line-height:1.5}.tight h2{margin:3mm 0 1.5mm}.tight p{margin:0 0 1.2mm}.tight .sg>div{min-height:24mm}.tight td{padding:1.2mm 2.5mm}.tight .ln{height:6.5mm}
.sg>div{border:1px solid #c9cfdb;border-radius:1.5mm;padding:3mm 4mm;min-height:36mm;font-size:9.2pt}
.ck{display:inline-block;width:3.6mm;height:3.6mm;border:1px solid #1c2333;margin-right:1.5mm;vertical-align:-0.6mm;text-align:center;line-height:3.4mm;font-size:8pt}
.q{margin-bottom:1.5mm;break-inside:avoid}.q b{display:block;font-size:9.6pt}.q small{color:#5d667a;font-size:8.2pt}
.ans{border:1px solid #c9cfdb;border-radius:1mm;min-height:8mm;padding:1.2mm 2.5mm;margin-top:.8mm;white-space:pre-wrap}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:1mm 6mm}
.ft{position:absolute;left:16mm;right:16mm;bottom:7mm;font-size:7.6pt;color:#7a8296;display:flex;justify-content:space-between}
.pbtn{position:fixed;right:14px;top:14px;z-index:9;border:0;background:#e8622c;color:#fff;font-weight:700;border-radius:10px;padding:10px 18px;cursor:pointer;font-size:14px}
`;
const wrap = (title, pages) => `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title>${esc(title)}</title><style>${CSS}</style></head><body><button class="pbtn" onclick="print()">印刷／PDFとして保存</button>${pages.map((b, i) => `<section class="p">${b}<div class="ft"><span>採用の顔｜デジレップ株式会社</span><span>${pages.length > 1 ? (i + 1) + ' / ' + pages.length : ''}</span></div></section>`).join('')}</body></html>`;
const biz = o => Object.assign({}, BIZ0, o.biz || {});
const from = (B, seal) => `<div class="fr"><b>${esc(B.name)}</b><br>代表　${esc(B.rep)}<br>${B.zip ? '〒' + esc(B.zip) + '　' : ''}${esc(B.addr)}<br>TEL ${esc(B.tel)}<br>${esc(B.mail)}${B.reg ? '<br>登録番号 ' + esc(B.reg) : B.hp ? '' : '<br>登録番号 ' + BL(34)}</div>`;
const head = (o, title, noLabel) => { const c = o.client || {}; return `<h1>${title}</h1><div class="meta">${noLabel || 'No.'} ${o.no ? esc(o.no) : BL(26)}　／　${jd(o.date)}</div><div class="hd"><div><div class="to">${c.name ? esc(c.name) : BL(70)}　御中</div>${c.person ? `<div>${esc(c.person)} 様</div>` : ''}</div>${from(biz(o))}</div>`; };
function calc(o) { const d = o.deal || {}, P = PL[d.plan] || PL.std, m = P.monthly ? (+d.months || 3) : 0, base = d.plan === 'adv' ? 0 : (d.amount != null && d.amount !== '' && !P.monthly ? +d.amount : P.price), adv = (P.monthly || 0) * m, off = d.prepay && base && !P.list ? Math.round(base * .05) : 0, disc = P.list && base ? P.list - base : 0, sub = base + adv - off, tax = Math.round(sub * .1); return { P, m, base, adv, off, disc, sub, tax, total: sub + tax, half: Math.round(base / 2) }; }
const rows = (o, K) => `<table><tr><th>内容</th><th class="n" style="width:20mm">数量</th><th class="n" style="width:34mm">金額（税別）</th></tr>
 ${K.base ? `<tr><td><b>${K.P.n.replace(' ＋ 採用運用顧問', '')}</b><div class="sm">${K.P.items.filter(i => !/^採用運用顧問（/.test(i)).map(i => '・' + i).join('<br>')}</div></td><td class="n">${K.P.list ? '年間' : '一式'}</td><td class="n">${yen(K.disc ? K.P.list : K.base)}</td></tr>` : ''}
 ${K.disc ? `<tr><td>紹介価格の適用（無料採用診断・採用の顔のお客様・ご紹介）</td><td class="n"></td><td class="n">−${yen(K.disc)}</td></tr>` : ''}
 ${K.adv ? `<tr><td><b>${K.P.price ? '採用運用顧問' : (K.P.mn || '採用運用顧問')}</b><div class="sm">${(K.P.price ? PL.adv.items : K.P.items).map(i => '・' + i).join('<br>')}</div></td><td class="n">${K.m}ヶ月</td><td class="n">${yen(K.adv)}</td></tr>` : ''}
 ${K.off ? `<tr><td>一括前払い割引（5%）</td><td class="n"></td><td class="n">−${yen(K.off)}</td></tr>` : ''}
 <tr><td colspan="2" class="n">小計（10%対象）</td><td class="n">${yen(K.sub)}</td></tr><tr><td colspan="2" class="n">消費税（10%）</td><td class="n">${yen(K.tax)}</td></tr><tr><td colspan="2" class="n"><b>合計（税込）</b></td><td class="n"><b>${yen(K.total)}</b></td></tr></table>`;
const bank = B => B.bank ? `${esc(B.bank)}　${esc(B.branch)}　${esc(B.kind)}　${esc(B.acct)}　${esc(B.holder)}` : B.hp ? 'お申込み後にご案内します' : `${BL(28)}銀行　${BL(22)}支店　普通・当座　${BL(24)}　名義 ${BL(34)}`;

/* ---------- 見積書 ---------- */
function estimate(o) { const K = calc(o), d = o.deal || {};
  return wrap('御見積書_' + ((o.client || {}).name || ''), [`${head(o, '御見積書')}<p>下記のとおり、お見積り申し上げます。</p><div class="tot"><span>お見積り金額（税込）</span><b>${yen(K.total)}</b></div>
 <table style="margin-bottom:3mm"><tr><td class="k">件名</td><td>${K.P.n}</td></tr><tr><td class="k">納期</td><td>${K.P.days ? '着手金のご入金確認から ' + K.P.days + '営業日（ご確認にかかる日数を除く）' : 'ご契約の翌月から開始'}</td></tr><tr><td class="k">お支払い条件</td><td>${K.base ? (d.prepay ? 'ご契約時に全額（一括前払い割引を適用）' : '着手金 50%（ご契約時）／残金 50%（納品日にご請求、' + biz(o).payDays + '日以内）') : ''}${K.adv ? (K.base ? '<br>' : '') + '顧問料：毎月1日に当月分をご請求（前払い）' : ''}</td></tr><tr><td class="k">有効期限</td><td>発行日から1ヶ月</td></tr></table>${rows(o, K)}
 <h3>備考</h3><div class="sm">・企画、制作、修正2回、データ納品までを含みます。<br>・印刷費、採用ページのサーバー・ドメイン費用、撮影に伴う遠方交通費は、別途実費を申し受けます。<br>${K.P.free ? '・採用運用顧問は' + K.P.free + 'ヶ月分を含みます。付帯期間の終了後は月額' + yen(100000) + '（税別）で月単位の自動継続となり、前月末までのご連絡でいつでも解約いただけます。<br>' : ''}・採用人数や応募数を保証するものではありません。${d.note ? '<br>・' + esc(d.note) : ''}</div>`]); }

/* ---------- 申込書（兼 契約条件） ---------- */
const TERMS = [
 ['第1条（目的）', '本約款は、お客様（以下「甲」）が デジレップ株式会社（以下「乙」）に申し込む採用ブランディングサービス「採用の顔」および採用運用顧問（以下「本サービス」）の条件を定めます。申込書に本約款と異なる定めがある場合は、申込書を優先します。'],
 ['第2条（契約の成立）', '本契約は、甲が申込書を乙に提出し、乙がこれを承諾したときに成立します。'],
 ['第3条（業務の内容と納期）', '業務の内容・納品物・納期は申込書のとおりとします。納期は着手金の入金確認日から起算し、甲の確認・素材提供に要した日数は含みません。'],
 ['第4条（料金と支払い）', '甲は、申込書記載の料金を、契約時に着手金として50%、納品日に残金50%を、請求書記載の期日までに乙の指定口座へ支払います。振込手数料は甲の負担とします。乙は、着手金の入金を確認したのちに制作を開始します。'],
 ['第5条（実費）', '印刷費、サーバー・ドメイン費用、遠方への交通費・宿泊費など、申込書に含まれない費用は、事前に甲の了承を得たうえで、実費を別途請求します。'],
 ['第6条（甲の協力）', '甲は、ヒアリングへの対応、素材の提供、制作物の確認を、乙の依頼から7日以内を目安に行います。甲の対応の遅れにより生じた納期の遅延について、乙は責任を負いません。'],
 ['第7条（修正）', '修正は、各制作物につき2回までを料金に含みます。3回目以降、または決定済みの方向性を変更する修正は、別途お見積りのうえ対応します。'],
 ['第8条（納品と検収）', '甲は、納品日から7日以内に納品物を確認し、不具合があれば乙に通知します。期間内に通知がない場合は、検収に合格したものとみなします。'],
 ['第9条（権利の帰属）', '納品物の著作権は、残金の支払い完了をもって、乙から甲に譲渡されます（第三者が権利を有する素材・書体・音楽等を除く）。乙は、著作者人格権を行使しません。乙は、甲の事前の承諾を得たうえで、納品物を制作実績として紹介できるものとします。'],
 ['第10条（素材と出演者）', '甲が提供する写真・文章・ロゴ等は、甲が正当な権利を有するものとします。制作物に登場する従業員等については、甲が本人から掲載の同意を得るものとし、乙は同意書の雛形を提供します。'],
 ['第11条（採用運用顧問）', '顧問の内容は、月2回のWeb面談、求人票の添削、採用ページの更新、SNS投稿素材の提供、月次レポートとします。付帯期間の終了後は、月単位で自動的に継続します。顧問料は、毎月1日に当月分を請求します。甲は、前月末日までに通知することで、翌月以降を解約できます。'],
 ['第12条（中途解約）', '甲の都合により制作の途中で解約する場合、甲は、解約時点までの作業に相当する料金（着手金を下限とします）と、発生済みの実費を支払います。'],
 ['第13条（成果の非保証）', '乙は、本サービスにより、応募数・採用人数その他の特定の成果が得られることを保証しません。'],
 ['第14条（再委託）', '乙は、撮影・印刷等の業務の一部を、乙の責任において第三者に委託できます。'],
 ['第15条（秘密保持・個人情報）', '甲および乙は、本契約に関して知り得た相手方の秘密情報および個人情報を、本契約の目的以外に使用せず、第三者に開示しません。'],
 ['第16条（責任の範囲）', '乙が甲に対して負う損害賠償の額は、乙の故意または重大な過失による場合を除き、甲が乙に支払った料金の額を上限とします。'],
 ['第17条（反社会的勢力の排除）', '甲および乙は、自らが反社会的勢力に該当しないこと、およびこれと関係を有しないことを表明し、違反があった場合、相手方は催告なく本契約を解除できます。'],
 ['第18条（協議・管轄）', '本約款に定めのない事項は、甲乙が誠実に協議して解決します。本契約に関する紛争は、東京地方裁判所を第一審の専属的合意管轄裁判所とします。']];
function order(o) { const K = calc(o), d = o.deal || {}, c = o.client || {}, B = biz(o);
  return wrap('お申込書_' + (c.name || ''), [`<div class="tight"><h1>お 申 込 書</h1><div class="meta">No. ${o.no ? esc(o.no) : BL(26)}　／　お申込日 ${jd(o.date)}</div>
 <div class="hd" style="margin-bottom:1mm"><div><div class="to">${esc(B.name)}　御中</div>次ページの約款に同意のうえ、下記のとおり申し込みます。</div><div><div class="sm"><b>受託者（乙）</b></div>${from(B)}</div></div>
 <h2>お申込みの内容</h2><table><tr><td class="k">プラン</td><td><b>${K.P.n}</b></td></tr><tr><td class="k">内容</td><td class="sm" style="font-size:9pt;color:#1c2333">${K.P.items.map(i => '・' + i).join('<br>')}</td></tr>
 <tr><td class="k">料金</td><td>${K.base ? `制作費 <b>${yen(K.base - K.off)}</b>（税別）${K.off ? '　※一括前払い割引5%を適用' : ''}<br>` : ''}${K.adv ? `顧問料 月額 <b>${yen(K.P.monthly)}</b>（税別）× ${K.m}ヶ月（最低契約期間）<br>` : ''}合計 ${yen(K.sub)}（税別）／ <b>${yen(K.total)}</b>（税込）</td></tr>
 <tr><td class="k">納期</td><td>${K.P.days ? '着手金のご入金確認日から ' + K.P.days + '営業日（ご確認にかかる日数を除く）' : '―'}</td></tr>
 <tr><td class="k">お支払い</td><td>${K.P.pay ? esc(K.P.pay) + '<br>お振込先：' + bank(B) : ''}${K.P.pay ? '' : K.base ? (d.prepay ? 'ご契約時に全額' : `着手金 ${yen(Math.round((K.base) * 1.1 / 2))}（税込・ご契約時）／残金 ${yen(Math.round(K.base * 1.1) - Math.round(K.base * 1.1 / 2))}（税込・納品日にご請求）`) : ''}${K.adv ? (K.base ? '<br>' : '') + '顧問料は、毎月1日に当月分をご請求' : ''}${K.P.pay ? '' : '<br>お振込先：' + bank(B)}</td></tr>
 <tr><td class="k">${(K.P.mn || '採用運用顧問').split('（')[0]}</td><td>${K.P.noadv ? '含みません（採用運用顧問のご契約中は、本ツールの改修を無料で行います）' : K.P.free ? `納品後 ${K.P.free}ヶ月は料金に含みます。その後は月額 ${yen(100000)}（税別）で月単位の自動継続。<br><span class="ck"></span>自動継続を希望する　<span class="ck"></span>付帯期間で終了する（継続しない）` : K.adv ? '開始月：' + (d.start ? esc(d.start) : BL(24)) + '　最低' + K.m + 'ヶ月、以降は月単位の自動継続' : '含みません（ご希望の場合は別途お申込み）'}</td></tr>
 <tr><td class="k">特記事項</td><td>${tx(d.note, 120)}</td></tr></table>
 <h2>お申込者（甲）</h2><table><tr><td class="k">会社名</td><td>${tx(c.name, 90)}</td></tr><tr><td class="k">所在地</td><td>${tx(c.addr || c.pref, 110)}</td></tr><tr><td class="k">代表者名</td><td>${BL(60)}　　　　　　　　　　　印</td></tr><tr><td class="k">ご担当者名</td><td>${tx(c.person, 50)}　　${c.role ? esc(c.role) : ''}</td></tr><tr><td class="k">電話／メール</td><td>${tx(c.tel, 40)}　／　${tx(c.mail, 60)}</td></tr><tr><td class="k">請求書の送付先</td><td><span class="ck"></span>上記メール　<span class="ck"></span>別のメール（${BL(60)}）　<span class="ck"></span>郵送</td></tr></table>
 <p class="sm" style="margin-top:3mm">・着手金のご入金を確認したのちに、制作を開始します。　・ヒアリングシートを、お申込みと同時にお渡しします。　・本書は、PDFでの取り交わしを基本とします。</p></div>`,
  `<h1 style="font-size:14pt;letter-spacing:.1em">「採用の顔」サービス約款</h1><div class="tm">${TERMS.map(t => `<p><b>${t[0]}</b>　${t[1]}</p>`).join('')}</div><p class="sm" style="margin-top:4mm;text-align:right">制定：${jd(o.termsDate || '2026-10-06')}　${esc(B.name)}</p>`]); }

/* ---------- 請求書（適格請求書の記載事項に対応） ---------- */
function invoice(o) { const B = biz(o), v = o.inv || {}, sub = +v.amount || 0, tax = Math.round(sub * .1), due = v.payBy || '';
  return wrap('御請求書_' + ((o.client || {}).name || ''), [`${head(o, '御 請 求 書', '請求書番号')}<p>下記のとおり、ご請求申し上げます。</p><div class="tot"><span>ご請求金額（税込）</span><b>${yen(sub + tax)}</b></div>
 <table style="margin-bottom:3mm"><tr><td class="k">件名</td><td>${tx(v.title, 90)}</td></tr><tr><td class="k">お支払期日</td><td><b>${due ? jd(due) : BL(40)}</b></td></tr><tr><td class="k">お振込先</td><td>${bank(B)}<div class="sm">恐れ入りますが、振込手数料はご負担ください。</div></td></tr></table>
 <table><tr><th style="width:26mm">取引日</th><th>内容</th><th class="n" style="width:16mm">税率</th><th class="n" style="width:34mm">金額（税別）</th></tr><tr><td>${v.date ? jd(v.date) : BL(20)}</td><td>${tx(v.label, 80)}${v.memo ? '<div class="sm">' + esc(v.memo) + '</div>' : ''}</td><td class="n">10%</td><td class="n">${yen(sub)}</td></tr>
 <tr><td colspan="3" class="n">10%対象　小計</td><td class="n">${yen(sub)}</td></tr><tr><td colspan="3" class="n">消費税（10%）</td><td class="n">${yen(tax)}</td></tr><tr><td colspan="3" class="n"><b>合計（税込）</b></td><td class="n"><b>${yen(sub + tax)}</b></td></tr></table>
 <h3>備考</h3><div class="sm">${v.kind === 'deposit' ? '着手金のご入金を確認したのちに、制作を開始いたします。' : v.kind === 'final' ? '納品が完了いたしましたので、残金をご請求いたします。' : v.kind === 'adv' ? '採用運用顧問の当月分です（前払い）。' : ''}</div>`]); }

/* ---------- 納品書 兼 検収確認書 ---------- */
function delivery(o) { const K = calc(o), c = o.client || {}, B = biz(o);
  return wrap('納品書兼検収確認書_' + (c.name || ''), [`<div class="tight">${head(o, '納品書 兼 検収確認書')}<p>下記のとおり、納品いたします。内容をご確認のうえ、下の「検収確認」欄にご記入ください。</p>
 <table><tr><th style="width:9mm"></th><th>納品物</th><th style="width:58mm">納品の形式</th></tr>${(K.P.deliv && o.deal ? K.P.deliv : [['採用キャッチコピー・採用ロゴ', 'ロゴデータ（PNG・SVG）／使い方の説明'], ['採用ページ', '公開URL：' + (o.url ? esc(o.url) : '') + ' ／更新方法の説明'], ['採用PR動画', 'MP4（横型・縦型）'], ['ブランディング動画', 'MP4'], ['採用パンフレット', '印刷用PDF／閲覧用PDF'], ['名刺デザイン', '印刷用データ／差し替え用テンプレート'], ['求人票の見出し・本文案', 'テキストデータ']].filter(r => (o.deal || {}).plan !== 'lp' || /キャッチ|採用ページ|求人票/.test(r[0])).filter(r => (o.deal || {}).plan === 'std' || (o.deal || {}).plan === 'prem' || !o.deal || !/ブランディング/.test(r[0]))).map(r => `<tr><td style="text-align:center"><span class="ck"></span></td><td><b>${r[0]}</b></td><td class="sm">${r[1]}</td></tr>`).join('')}</table>
 <table style="margin-top:3mm"><tr><td class="k">プラン</td><td>${K.P.n}</td></tr><tr><td class="k">納品日</td><td>${jd(o.date)}</td></tr><tr><td class="k">データの受け渡し</td><td>${tx(o.how || '共有フォルダのURLをメールでお送りします', 80)}</td></tr><tr><td class="k">${K.P.mn || '採用運用顧問'}</td><td>${K.P.free ? `本日から${K.P.free}ヶ月は料金に含まれます。初回の面談日：${BL(40)}` : '―'}</td></tr></table>
 <h3>納品後のお願い</h3><div class="sm">${K.P.deliv && o.deal ? (K.P.noadv ? '・応募が来たら、その日のうちに登録してください。月に一度、「数字」の画面をご覧ください。<br>・データはお使いのパソコンの中に保存されます。月に一度、バックアップを書き出してください。<br>' : '・営業資料は、次の商談から使い始めてください。使ってみて気づいた点は、顧問の面談で直します。<br>・会社ホームページと名刺・メールの署名から、サービス紹介ページへリンクしてください。<br>') : '・求人票の見出しと本文を、納品した文案に差し替えてください（顧問の面談でお手伝いします）。<br>・会社ホームページと求人票から、採用ページへリンクしてください。<br>'}・納品日から7日以内に内容をご確認ください。不具合があればお知らせください（期間内にご連絡がない場合は、検収合格とさせていただきます）。<br>・残金のご請求書を、あわせてお送りします。</div>
 <h2>検収確認（甲 ご記入欄）</h2><div class="sg"><div>上記の納品物を確認し、検収しました。<br>確認日：　　　　年　　月　　日<br><br>会社名：${tx(c.name, 50)}<br><br>ご担当者名：${BL(44)}　印</div><div><b>ご感想・お気づきの点</b><div class="ln"></div><div class="ln"></div><span class="ck"></span>制作実績としての紹介を承諾します（社名・納品物の画像）<br><span class="ck"></span>社名を伏せた紹介のみ承諾します</div></div></div>`]); }

/* ---------- 出演・掲載同意書 ---------- */
function consent(o) { const c = o.client || {};
  return wrap('出演・掲載同意書', [`<div class="tight"><h1>出演・掲載に関する同意書</h1><p>${c.name ? esc(c.name) : BL(60)}（以下「会社」）御中</p>
 <p>私は、会社の採用活動のために制作される下記の制作物に、私の肖像・氏名・発言等が使用されることについて、以下の内容を確認し、同意します。</p>
 <h2>1. 使用されるもの（当てはまるものに ✓）</h2><p><span class="ck"></span>写真　<span class="ck"></span>動画（映像・音声）　<span class="ck"></span>氏名（<span class="ck"></span>本名　<span class="ck"></span>名字のみ　<span class="ck"></span>イニシャル・仮名）　<span class="ck"></span>所属・職種・入社年　<span class="ck"></span>インタビューでの発言</p>
 <h2>2. 使用される場所</h2><p><span class="ck"></span>会社の採用ページ・ホームページ　<span class="ck"></span>求人サイト・求人媒体　<span class="ck"></span>SNS（会社の公式アカウント）　<span class="ck"></span>採用パンフレット等の印刷物　<span class="ck"></span>会社説明会・学校訪問　<span class="ck"></span>その他（${BL(40)}）</p>
 <h2>3. 確認事項</h2><div style="font-size:9.6pt">
 <p>(1) 使用の目的は、会社の採用活動および広報活動に限ります。</p>
 <p>(2) 使用の期間は、制作物の公開日から、会社が使用を終了するまでとします。</p>
 <p>(3) <b>同意はいつでも撤回できます。</b>私が撤回または使用の中止を申し出た場合、会社は、Web上の制作物については申し出から30日以内を目安に、差し替えまたは削除を行います。すでに配布された印刷物については、次回の印刷から反映します。</p>
 <p>(4) <b>退職後の取り扱い：</b>　<span class="ck"></span>退職後も継続して使用してよい　<span class="ck"></span>退職後は、すみやかに差し替え・削除してほしい</p>
 <p>(5) 出演・掲載は任意であり、同意しないこと、または同意を撤回することによって、人事上の不利益な取り扱いを受けることはありません。</p>
 <p>(6) 公開の前に、私が登場する部分の内容を確認できます。</p>
 <p>(7) 制作は、会社が委託する デジレップ株式会社が行い、撮影データは制作の目的以外に使用されません。</p></div>
 <div class="sg"><div>　　　　年　　月　　日<br><br>所属：${BL(50)}<br><br>氏名（自署）：${BL(46)}<br><br><span class="sm">※未成年の方は、保護者の方の署名もお願いします。<br>保護者氏名：${BL(40)}</span></div><div><b>会社 記入欄</b><br><br>撮影日：　　　　年　　月　　日<br><br>担当者：${BL(40)}<br><br>備考：<div class="ln"></div></div></div>
 <p class="sm" style="margin-top:4mm">この書面は、会社と本人が1部ずつ保管してください。原本は会社が保管し、デジレップ株式会社には写しをご共有ください。</p></div>`]); }

/* ---------- ヒアリングシート ---------- */
const HQ = [
 { s: '1. 採用について', q: [['h_job', '募集する職種と人数', '例：施工管理 2名', 'l'], ['h_when', 'いつまでに採用したいですか', '例：来年4月入社', 'l'], ['h_media', 'いま使っている求人媒体・方法と、年間の費用', '例：Indeed（月5万円）、ハローワーク、知人の紹介', 'l'], ['h_fn', '直近1年の数字（分かる範囲で）　応募／面接／内定／入社／うち退職', '例：応募9／面接5／内定3／入社2／退職1', 'l'], ['h_issue', '採用で、いちばん困っていること', '', 'a'], ['h_why', '応募が来ない・決まらない理由は、何だと思われますか', '', 'a']] },
 { s: '2. 採用したい人', q: [['h_persona', 'どんな人に来てほしいですか（年齢・経験・人柄）', '', 'a'], ['h_model', 'いまの社員で「この人のような人に来てほしい」という方と、その理由', '', 'a'], ['h_ng', '逆に、合わないと思うのは、どんな人ですか', '', 'l']] },
 { s: '3. 働く条件（数字でお書きください）', g: 1, q: [['h_pay', '給与（初年度の月給・年収の例）', '', 'l'], ['h_pay3', '3年目・5年目の年収の例', '', 'l'], ['h_hol', '年間休日（日）', '', 'l'], ['h_ot', '月の平均残業（時間）', '', 'l'], ['h_paid', '有給休暇の取得（年に平均何日・何%）', '', 'l'], ['h_bonus', '賞与・昇給の実績（直近3年）', '', 'l'], ['h_ben', '手当・福利厚生・資格取得の支援', '', 'l'], ['h_turn', '直近3年の入社人数と、退職人数', '', 'l']] },
 { s: '4. 仕事と人', q: [['h_day', 'ある1日の流れ（時刻入りで）', '例：7:30 朝礼 → 8:00 現場へ → 12:00 昼休み → 17:00 片付け → 17:30 帰社', 'a'], ['h_hard', 'この仕事の、大変なところ', '', 'l'], ['h_good', 'この仕事の、やりがい・うれしい瞬間', '', 'l'], ['h_stay', '長く勤めている方は、なぜ続いていると思いますか', '', 'l'], ['h_quit', '最近辞めた方の理由（差し支えない範囲で）', '', 'l'], ['h_grow', '入社後の育て方（誰が、どう教えるか。一人前までの年数）', '', 'a']] },
 { s: '5. 会社と社長の考え', q: [['h_biz', '事業の内容と、主なお客様', '', 'l'], ['h_strong', 'お客様から選ばれている理由・言われてうれしかった言葉', '', 'a'], ['h_hist', '創業の経緯と、いま大事にしていること', '', 'a'], ['h_wish', '社員に、どうなってほしいですか', '', 'l'], ['h_future', '3年後、会社をどうしていきたいですか', '', 'l']] },
 { s: '6. 制作について', q: [['h_no', '載せたくないこと・言いたくないこと', '', 'l'], ['h_mat', '使える素材（ロゴ、写真、動画、会社案内）', '', 'l'], ['h_cast', '写真・動画・インタビューに登場してよい社員の方（人数・職種）', '', 'l'], ['h_ref', '参考にしたい他社の採用ページ・動画（あれば）', '', 'l'], ['h_color', '会社の色・使いたい色、避けたい表現', '', 'l']] },
 { s: '7. 進め方', g: 1, q: [['h_contact', '窓口になる方（お名前・連絡先）', '', 'l'], ['h_decide', '最終的に決める方', '', 'l'], ['h_date', '公開・納品のご希望日', '', 'l'], ['h_shoot', '撮影できる日・できない日（スタンダードの場合）', '', 'l']] }];
const HQS = [
 { s: '1. 売りたいもの', q: [['s_what', 'いちばん売りたい商品・サービスと、その価格', '例：工場向けの定期清掃（月8万円〜）', 'l'], ['s_who', 'いちばん買ってほしいお客様（業種・規模・地域・役職）', '例：埼玉県内の食品工場。従業員30〜100名。工場長', 'l'], ['s_goal', '1年後の目標（売上・件数・新しいお客様の数）', '', 'l'], ['s_issue', '営業で、いちばん困っていること', '', 'a']] },
 { s: '2. 選ばれている理由', q: [['s_why', 'いまのお客様は、なぜ御社を選んだと言っていますか', '', 'a'], ['s_rival', 'よく比べられる会社と、その会社との違い', '', 'a'], ['s_case', 'お客様に喜ばれた事例（3つまで。社名は伏せて構いません）', '', 'a'], ['s_num', '数字で言える実績（年数・件数・リピート率など）', '', 'l']] },
 { s: '3. いまの営業のやり方', g: 1, q: [['s_route', '新しいお客様は、どこから来ますか（紹介・電話・HP・展示会など）', '', 'l'], ['s_staff', '営業をしている人数と、1人あたりの担当社数', '', 'l'], ['s_fn', '1ヶ月の数字（問い合わせ／商談／見積り／受注）', '', 'l'], ['s_cycle', '最初の接点から受注までの期間', '', 'l'], ['s_tool', '顧客や案件を、いま何で管理していますか', '例：Excel、紙、担当者の頭の中', 'l'], ['s_mat', 'いま使っている営業資料・HP（URL）', '', 'l']] },
 { s: '4. 断られる理由・つまずく場面', q: [['s_ng', '断られるときに、よく言われること', '', 'a'], ['s_q', '商談で、よく聞かれる質問', '', 'a'], ['s_lost', '見積りを出したあと、連絡が途絶えることはありますか。そのとき、どうしていますか', '', 'l']] },
 { s: '5. 制作について', q: [['s_like', 'デザインや言葉づかいの希望（参考にしたい会社・避けたい表現）', '', 'l'], ['s_ngw', '載せたくないこと・言えないこと', '', 'l'], ['s_ok', '確認・決定をされる方と、ご連絡の方法', '', 'l']] }
];
function hearing(o) { const c = o.client || {}, A = o.ans || {}, blank = !o.ans;
  if (o.kind === 'sales') { const sc = S => `<h2>${S.s}</h2><div class="${S.g ? 'g2' : ''}">${S.q.map(q => `<div class="q"><b>${q[1]}</b>${q[2] && blank ? `<small>${q[2]}</small>` : ''}<div class="ans" style="${q[3] === 'a' ? 'min-height:13mm' : ''}">${A[q[0]] ? esc(A[q[0]]) : ''}</div></div>`).join('')}</div>`;
    return wrap('営業の顔_ヒアリングシート_' + (c.name || ''), [`<h1 style="letter-spacing:.1em">「営業の顔」ヒアリングシート</h1><div class="hd" style="margin-bottom:2mm"><div><div class="to">${c.name ? esc(c.name) : BL(70)}　御中</div><div class="sm">ご記入日：${jd(o.date)}　　ご記入者：${BL(40)}</div></div><div class="sm">打合せ（Web60分）の前に、分かる範囲でご記入ください。空欄があっても構いません。「採用の顔」でお伺いした内容は、あらためてお書きいただく必要はありません。<b>普段お客様に話している言葉のままで結構です。</b></div></div>${HQS.slice(0, 2).map(sc).join("")}`, HQS.slice(2).map(sc).join("") + `<p class="sm" style="margin-top:5mm">ご記入ありがとうございます。いただいた内容は、営業資料・サービス紹介ページ・営業管理ツールの作成にのみ使用します。<br>ご返送先：${esc(biz(o).mail)}</p>`]); }
  const sec = S => `<h2>${S.s}</h2><div class="${S.g ? 'g2' : ''}">${S.q.map(q => `<div class="q"><b>${q[1]}</b>${q[2] && blank ? `<small>${q[2]}</small>` : ''}<div class="ans" style="${q[3] === 'a' ? 'min-height:' + (blank ? 13 : 10) + 'mm' : ''}">${A[q[0]] ? esc(A[q[0]]) : ''}</div></div>`).join('')}</div>`;
  return wrap('ヒアリングシート_' + (c.name || ''), [`<h1 style="letter-spacing:.15em">ヒアリングシート</h1><div class="hd" style="margin-bottom:2mm"><div><div class="to">${c.name ? esc(c.name) : BL(70)}　御中</div><div class="sm">ご記入日：${jd(o.date)}　　ご記入者：${BL(40)}</div></div><div class="sm">打合せ（Web60分）の前に、分かる範囲でご記入ください。空欄があっても構いません。当日、お話を伺いながら一緒に埋めていきます。<b>きれいな言葉でなく、普段の言葉のままで結構です。</b></div></div>${HQ.slice(0, 2).map(sec).join('')}`,
   HQ.slice(2, 4).map(sec).join(''), HQ.slice(4).map(sec).join('') + `<p class="sm" style="margin-top:5mm">ご記入ありがとうございます。いただいた内容は、採用キャッチコピーと制作物の作成にのみ使用します。<br>ご返送先：${esc(biz(o).mail)}（このシートを撮影した写真や、メール本文への記入でも構いません）</p>`]); }

/* ---------- 月次レポート（顧問） ---------- */
function report(o) { const c = o.client || {}, r = o.rep || {}, OPS = o.ops || [];
  return wrap('採用運用顧問_月次レポート_' + (c.name || ''), [`<h1 style="letter-spacing:.12em">採用運用顧問　月次レポート</h1><div class="hd"><div><div class="to">${c.name ? esc(c.name) : BL(70)}　御中</div><div>対象月：<b>${r.month ? esc(r.month.replace('-', '年')) + '月' : BL(30)}</b></div></div>${from(biz(o))}</div>
 <h2>1. 今月の数字</h2><table><tr><th>応募</th><th>面接</th><th>内定</th><th>入社</th><th>採用ページの閲覧</th><th>前月からの変化</th></tr><tr>${['apply', 'iv', 'offer', 'join', 'pv'].map(k => `<td class="n" style="height:10mm;font-size:13pt;font-weight:700">${r[k] !== '' && r[k] != null ? esc(r[k]) : ''}</td>`).join('')}<td>${tx(r.diff, 40)}</td></tr></table>
 <h2>2. 今月、行ったこと</h2><table>${(OPS.length ? OPS : ['Web面談①', 'Web面談②', '求人票の添削・書き換え', '採用ページの更新', 'SNS投稿素材8本の納品', '月次レポート']).map((x, i) => `<tr><td style="width:9mm;text-align:center"><span class="ck">${r.c && r.c[i] ? '✓' : ''}</span></td><td>${esc(x)}</td></tr>`).join('')}</table>
 <h2>3. 分かったこと・気づいたこと</h2><div class="ans" style="min-height:19mm">${r.find ? esc(r.find) : ''}</div>
 <h2>4. 来月、行うこと</h2><div class="g2"><div><h3>当社が行うこと</h3><div class="ans" style="min-height:17mm">${r.nextM ? esc(r.nextM) : ''}</div></div><div><h3>御社にお願いすること</h3><div class="ans" style="min-height:17mm">${r.nextC ? esc(r.nextC) : ''}</div></div></div>
 <h2>5. 次回の面談</h2><p>日時：${tx(r.nextDate, 50)}　　議題：${tx(r.agenda, 70)}</p>
 <p class="sm">数字は、御社からのご報告と、採用ページのアクセス解析にもとづきます。応募数や採用人数を保証するものではありません。</p>`]); }

const DocCore = { PL, BIZ0, HQ, HQS, TERMS, calc, estimate, order, invoice, delivery, consent, hearing, report };
root.DocCore = DocCore;
if (typeof module !== 'undefined' && module.exports) module.exports = DocCore;
})(typeof window !== 'undefined' ? window : globalThis);
