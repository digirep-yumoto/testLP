// お見積りの自動発行（HP）。書式は営業管理システムの見積書と同じ（assets/doc_core.js）。
(function(){
var FORM_ENDPOINT='/api/lead';
var PL=DocCore.PL, $=function(id){return document.getElementById(id)};
var PLANS=[['std','採用の顔 スタンダード（128万円・顧問3ヶ月つき）'],['light','採用の顔 ライト（88万円・顧問1ヶ月つき）'],['lp','採用LP単体プラン（30万円）'],['lpadv','採用LP単体 ＋ 採用運用顧問（30万円＋月10万円）'],['adv','採用運用顧問のみ（月10万円）'],['dr_s','新卒ダイレクト スタンダード（内定承諾5名保証・年額）'],['dr_b','新卒ダイレクト ベーシック（内定承諾3名保証・年額）'],['dr_p','新卒ダイレクト プレミアム（内定承諾5名保証・年額）'],['sales','営業の顔 スタート（58万円）'],['salesf','営業の顔 フル（98万円）']];
var sel=$('plan');PLANS.forEach(function(p){var o=document.createElement('option');o.value=p[0];o.textContent=p[1];sel.appendChild(o)});
function yen(n){return '¥'+Math.round(n).toLocaleString()}
function upd(){var P=PL[sel.value];$('rowM').style.display=P.monthly?'':'none';$('rowP').style.display=(P.list||P.monthly&&!P.price)?'none':'';$('rowD').style.display=P.list?'':'none';
 var d=deal(),K=DocCore.calc({deal:d});$('sum').innerHTML='<b>'+yen(K.sub)+'</b>（税別）　<span>'+yen(K.total)+'（税込）</span>'+(K.disc?'<br><small>定価 '+yen(P.list)+' → 紹介価格（無料診断のお申込みで適用）</small>':P.list?'<br><small>定価でのお見積りです。無料診断をお申込みいただくと紹介価格（'+yen(P.price)+'）になります</small>':'')}
function deal(){var P=PL[sel.value];var d={plan:sel.value,months:+($('months').value||3),prepay:$('prepay').checked};if(P.list&&!$('diag').checked)d.amount=P.list;return d}
sel.addEventListener('change',upd);['months','prepay','diag'].forEach(function(id){$(id).addEventListener('change',upd)});upd();
function no(){var d=new Date();return 'W-'+d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+'-'+String(Math.floor(Math.random()*9000)+1000)}
var f=$('ef');f.addEventListener('submit',function(e){e.preventDefault();var err=$('eerr');err.style.display='none';
 var co=$('eco').value.trim(),nm=$('enm').value.trim(),ml=$('eml').value.trim(),tl=$('etl').value.trim(),pf=$('epf').value.trim();
 if(!co||!nm||!ml){err.textContent='会社名・お名前・メールアドレスをご入力ください。';err.style.display='block';return}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ml)){err.textContent='メールアドレスの形式をご確認ください。';err.style.display='block';return}
 var d=deal(),P=PL[d.plan],K=DocCore.calc({deal:d}),n=no(),date=new Date().toLocaleDateString('sv');
 var o={biz:{hp:1},client:{name:co,person:nm,addr:pf},deal:d,no:n,date:date};
 $('est').srcdoc=DocCore.estimate(o);$('ord').srcdoc=DocCore.order(Object.assign({},o,{no:n.replace('W-','WO-')}));
 $('out').style.display='block';$('eno').textContent=n;$('out').scrollIntoView({behavior:'smooth'});
 var m={purpose:'採用支援（お見積りの自動発行）',company:co,name:nm,email:ml,tel:tl,media:'採用の顔・新卒ダイレクト',message:'所在地：'+pf+'\nプラン：'+P.n+'\n金額（税別）：'+yen(K.sub)+'\n見積番号：'+n+'\n無料診断の希望：'+($('diag').checked?'はい':'いいえ')};
 try{fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(m)}).catch(function(){})}catch(x){}
});
$('showOrd').addEventListener('click',function(){var w=$('ordw');w.style.display=w.style.display==='none'?'block':'none';this.textContent=w.style.display==='none'?'お申込書も表示する':'お申込書を閉じる'});
})();
