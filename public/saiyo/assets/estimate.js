// お見積りの自動発行（HP）。書式は営業管理システムの見積書と同じ（assets/doc_core.js）。
// 2026-11-20：新卒ダイレクトに、紹介特典（定価のまま受け皿パックを無償）と当社オプションを選べるようにした
(function(){
var FORM_ENDPOINT='/api/lead';
var PL=DocCore.PL, OPT=DocCore.OPT, $=function(id){return document.getElementById(id)};
var PLANS=[['std','採用の顔 スタンダード（128万円・顧問3ヶ月つき）'],['light','採用の顔 ライト（88万円・顧問1ヶ月つき）'],['lp','採用LP単体プラン（30万円）'],['lpadv','採用LP単体 ＋ 採用運用顧問（30万円＋月10万円）'],['adv','採用運用顧問のみ（月10万円）'],['dr_s','新卒ダイレクト スタンダード（入社5名保証・年額）'],['dr_b','新卒ダイレクト ベーシック（入社3名保証・年額）'],['dr_p','新卒ダイレクト プレミアム（入社5名保証・年額）'],['sales','営業の顔 スタート（58万円）'],['salesf','営業の顔 フル（98万円）']];
var sel=$('plan');PLANS.forEach(function(p){var o=document.createElement('option');o.value=p[0];o.textContent=p[1];sel.appendChild(o)});
function yen(n){return '¥'+Math.round(n).toLocaleString()}
// オプションのチェック欄（社外に出さないもの（hold）は出さない）
var OK=Object.keys(OPT).filter(function(k){return !OPT[k].hold}), box=$('opts');
OK.forEach(function(k){var X=OPT[k],l=document.createElement('label');l.innerHTML='<input type="checkbox" value="'+k+'"> '+X.n+'（'+(X.with?yen(X.with)+'・同時お申込みの割引後':yen(X.p))+'）';box.appendChild(l)});
function cks(){return [].slice.call(box.querySelectorAll('input'))}
function gift(){var P=PL[sel.value];return !!(P.list&&$('diag').checked&&$('giftB').checked)}
box.addEventListener('change',function(e){var k=e.target.value,on=e.target.checked;if(!on)return upd();
 if(k==='pack')cks().forEach(function(c){if(OPT.pack.set.indexOf(c.value)>=0)c.checked=false});
 if(OPT.pack.set.indexOf(k)>=0)cks().forEach(function(c){if(c.value==='pack')c.checked=false});
 if(k==='light')cks().forEach(function(c){if(c.value==='lp')c.checked=false});
 if(k==='lp')cks().forEach(function(c){if(c.value==='light')c.checked=false});
 upd()});
function upd(){var P=PL[sel.value],g=gift();$('rowM').style.display=P.monthly?'':'none';$('rowP').style.display=(P.list||P.monthly&&!P.price)?'none':'';$('rowD').style.display=P.list?'':'none';$('rowG').style.display=P.list&&$('diag').checked?'':'none';$('rowO').style.display=P.list?'':'none';
 cks().forEach(function(c){var lock=g&&(c.value==='pack'||OPT.pack.set.indexOf(c.value)>=0);c.disabled=lock;if(lock)c.checked=false;c.parentNode.style.opacity=lock?.45:1});
 var d=deal(),K=DocCore.calc({deal:d}),all=K.sub+K.opSub;
 $('sum').innerHTML='<b>'+yen(all)+'</b>（税別）　<span>'+yen(K.all)+'（税込）</span>'+(K.opSub?'<br><small>新卒ダイレクト '+yen(K.sub)+'（運営パートナーからご請求）＋ オプション '+yen(K.opSub)+'（当社からご請求）・税別</small>':'')+(K.gift?'<br><small>定価 '+yen(P.list)+' ＋ 紹介特典：新卒の受け皿パック（'+yen(OPT.pack.p)+'相当）を無償</small>':K.disc?'<br><small>定価 '+yen(P.list)+' → 紹介価格（無料診断のお申込みで適用）</small>':P.list?'<br><small>定価でのお見積りです。無料診断をお申込みいただくと、紹介価格（'+yen(P.price)+'）か紹介特典を選べます</small>':'')}
function deal(){var P=PL[sel.value];var d={plan:sel.value,months:+($('months').value||3),prepay:$('prepay').checked};if(P.list){if(!$('diag').checked)d.amount=P.list;else if(gift())d.gift=1;d.opts=cks().filter(function(c){return c.checked&&!c.disabled}).map(function(c){return c.value})}return d}
sel.addEventListener('change',upd);['months','prepay','diag','giftA','giftB'].forEach(function(id){$(id).addEventListener('change',upd)});upd();
function no(){var d=new Date();return 'W-'+d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+'-'+String(Math.floor(Math.random()*9000)+1000)}
var f=$('ef');f.addEventListener('submit',function(e){e.preventDefault();var err=$('eerr');err.style.display='none';
 var co=$('eco').value.trim(),nm=$('enm').value.trim(),ml=$('eml').value.trim(),tl=$('etl').value.trim(),pf=$('epf').value.trim();
 if(!co||!nm||!ml){err.textContent='会社名・お名前・メールアドレスをご入力ください。';err.style.display='block';return}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ml)){err.textContent='メールアドレスの形式をご確認ください。';err.style.display='block';return}
 var d=deal(),P=PL[d.plan],K=DocCore.calc({deal:d}),n=no(),date=new Date().toLocaleDateString('sv');
 var o={biz:{hp:1},client:{name:co,person:nm,addr:pf},deal:d,no:n,date:date};
 $('est').srcdoc=DocCore.estimate(o);$('ord').srcdoc=DocCore.order(Object.assign({},o,{no:n.replace('W-','WO-')}));
 $('out').style.display='block';$('eno').textContent=n;$('out').scrollIntoView({behavior:'smooth'});
 var opl=K.ops.map(function(x){return x.X.n+(x.gift?'（紹介特典・無償）':'（'+yen(x.price)+'）')}).join('、');
 var m={purpose:'採用支援（お見積りの自動発行）',company:co,name:nm,email:ml,tel:tl,media:'採用の顔・新卒ダイレクト',message:'所在地：'+pf+'\nプラン：'+P.n+'\n金額（税別）：'+yen(K.sub)+(P.list?'\n価格：'+(K.gift?'定価＋紹介特典':K.disc?'紹介価格':'定価'):'')+(opl?'\nオプション：'+opl+'（税別 '+yen(K.opSub)+'）':'')+'\n見積番号：'+n+'\n無料診断の希望：'+($('diag').checked?'はい':'いいえ')};
 try{fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(m)}).catch(function(){})}catch(x){}
});
$('showOrd').addEventListener('click',function(){var w=$('ordw');w.style.display=w.style.display==='none'?'block':'none';this.textContent=w.style.display==='none'?'お申込書も表示する':'お申込書を閉じる'});
})();
