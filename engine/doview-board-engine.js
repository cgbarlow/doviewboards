// DoView Engine V1.0.8 2026-03-30
// DoView® Planning — Dr Paul Duignan — doviewplanning.org
// Engine file: place in head tag, then call DoView.init({...}) from body
// Usage: load via script tag in head, then call DoView.init({...}) in body script

let EMBEDDED_STATE = null;
const _ENGINE_SRC = (typeof document !== 'undefined' && document.currentScript) ? document.currentScript.textContent : '';

const DoView = (function() {

const CSS = `
:root{--orange:#F5A623;--od:#d4880a;--text:#1e293b;--text2:#64748b;--bg:#f8fafc;--bdr:#e2e8f0;--white:#fff}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;background:var(--bg);color:var(--text);font-size:13px;display:flex;flex-direction:column;min-height:100vh}
.hdr{background:var(--orange);padding:11px 20px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
.hdr-left{display:flex;align-items:center;gap:14px}
.hdr-title{color:#fff;font-weight:700;font-size:15px}
.hdr-binfo{color:rgba(255,255,255,0.85);font-size:11px;cursor:pointer;text-decoration:underline;text-underline-offset:2px}
.hdr-binfo:hover{color:#fff}
.hdr-right{display:flex;flex-direction:column;align-items:flex-end;gap:2px}
.hdr-tagline{color:#fff;font-size:11.5px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase}
.hdr-brand{color:rgba(255,255,255,0.65);font-size:10px}
.page-info-bar{padding:6px 20px;font-size:11.5px;color:var(--text2);background:#fff;border-bottom:1px solid var(--bdr);flex-shrink:0}
.page-info-bar span{font-weight:600;color:var(--text)}
.pinfo-link{color:var(--od);cursor:pointer;text-decoration:underline;text-underline-offset:2px;font-size:11px}
.pinfo-link:hover{color:var(--text)}
.info-modal-ta{width:100%;border:1px solid var(--bdr);border-radius:7px;padding:10px;font-size:12px;font-family:inherit;resize:vertical;min-height:180px;background:#f8fafc;line-height:1.6}
.info-modal-ta:focus{outline:none;border-color:var(--orange)}
.info-helper{font-size:11px;color:var(--text2);margin-bottom:10px;line-height:1.5;font-style:italic}
.tab-bar{background:#fff;border-bottom:1px solid var(--bdr);overflow-x:auto;white-space:nowrap;flex-shrink:0}
.tab-bar::-webkit-scrollbar{height:3px}.tab-bar::-webkit-scrollbar-track{background:#f1f5f9}.tab-bar::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:2px}
.tabs{display:inline-flex;padding:0 16px;gap:0}
.tab{padding:9px 16px;font-size:11.5px;font-weight:500;cursor:pointer;border-bottom:3px solid transparent;color:var(--text2);white-space:nowrap;transition:color 0.15s,border-color 0.15s;user-select:none}
.tab:hover{color:var(--text)}
.tab.active{color:var(--text);font-weight:600}
.main-wrap{flex:1;display:flex;flex-direction:column;overflow:hidden}
.main{padding:20px;flex:1;overflow-y:auto}
.ov-final{border:2px solid var(--od);background:#fff8ed;border-radius:12px;padding:18px 28px;max-width:460px;margin:0 auto 18px;cursor:pointer;text-align:center;transition:box-shadow 0.15s}
.ov-final:hover{box-shadow:0 4px 16px rgba(245,166,35,0.25)}
.ov-final h3{color:var(--od);font-size:15px;font-weight:700;margin-bottom:5px}
.ov-final p{color:var(--text2);font-size:11.5px}
.ov-divider{border:none;border-top:1px solid var(--bdr);margin:16px 0}
.sp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.sp-tile{border-radius:10px;padding:15px 15px 28px;cursor:pointer;position:relative;transition:transform 0.15s,box-shadow 0.15s;min-height:86px}
.sp-tile:hover{transform:translateY(-2px);box-shadow:0 4px 14px rgba(0,0,0,0.1)}
.sp-tile h4{font-size:12.5px;font-weight:700;margin-bottom:5px;color:var(--text)}
.sp-tile p{font-size:11px;color:var(--text2);line-height:1.4}
.drill-tri{position:absolute;bottom:8px;right:8px;width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid #F5A623;opacity:0.7}
.ov-hint{text-align:center;color:var(--text2);font-size:11px;margin-top:18px;font-style:italic}
.back-btn{display:inline-flex;align-items:center;gap:5px;background:none;border:1px solid var(--bdr);border-radius:6px;padding:6px 13px;cursor:pointer;font-size:11.5px;color:var(--text2);margin-bottom:16px;transition:background 0.15s}
.back-btn:hover{background:var(--bdr)}
.board-scroll{overflow-x:auto;padding-bottom:4px}
.ttw{display:flex;align-items:stretch;min-width:max-content;gap:0}
.sidebar{width:26px;flex-shrink:0;background:var(--orange);border:1px solid var(--od);display:flex;align-items:center;justify-content:center;border-radius:4px}
.sidebar span{writing-mode:vertical-rl;transform:rotate(180deg);color:#fff;font-weight:700;font-size:10px;letter-spacing:2px;text-transform:uppercase}
.cols-row{display:flex;align-items:center;flex:1;padding:0 8px}
.col-wrap{display:flex;flex-direction:column;flex-shrink:0;align-self:flex-start}
.col-h{font-size:9.5px;font-weight:600;text-transform:uppercase;color:var(--text2);letter-spacing:0.5px;margin-bottom:8px;text-align:center;min-height:28px;display:flex;align-items:flex-end;justify-content:center;padding:0 4px;width:160px}
.col-h.last-col{color:var(--od)}
.col-boxes{display:flex;flex-direction:column;gap:8px;align-items:stretch}
.col-arrow{width:24px;flex-shrink:0;display:flex;justify-content:center}
.box{border-radius:7px;padding:7px 9px 7px 34px;cursor:pointer;position:relative;width:160px;min-height:62px;border:1px solid;transition:box-shadow 0.15s,opacity 0.2s;overflow:hidden}
.box:hover{box-shadow:0 2px 8px rgba(0,0,0,0.12)}
.box.last-col{font-weight:700}
.box.grey-state{opacity:0.6}
.box-txt{font-size:11px;line-height:1.45;color:var(--text);display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden}
.box.last-col .box-txt{color:var(--od)}
.tl-dot{position:absolute;top:6px;right:6px;width:9px;height:9px;border-radius:50%}
.edit-lbl{position:absolute;top:17px;right:4px;font-size:7.5px;color:var(--text2);opacity:0.8}
.pri-badge{position:absolute;left:5px;top:50%;transform:translateY(-50%);width:20px;height:20px;border-radius:4px;background:#f1f5f9;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;font-size:8.5px;font-weight:700}
.box-drill{position:absolute;bottom:3px;right:3px;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid #F5A623;opacity:0.7}
.fo-list{max-width:580px;margin:0 auto;display:flex;flex-direction:column;gap:10px}
.fo-box{border-radius:8px;padding:13px 15px 13px 40px;cursor:pointer;position:relative;background:#fff8ed;border:1px solid #fde68a;transition:box-shadow 0.15s}
.fo-box:hover{box-shadow:0 2px 10px rgba(245,166,35,0.2)}
.fo-box .box-txt{font-weight:700;color:var(--od);font-size:12px}
.ep{background:#fff;border:1px solid var(--bdr);border-radius:12px;padding:15px 18px;margin:0 0 12px}
.ep-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px}
.ep-title{font-weight:600;font-size:12.5px;max-width:80%;line-height:1.4}
.ep-close{background:none;border:none;cursor:pointer;font-size:17px;color:var(--text2);padding:0 4px;line-height:1;flex-shrink:0}
.ep-entries{margin-bottom:10px;font-size:12px;line-height:1.6}
.ep-row{display:flex;align-items:flex-start;gap:5px;margin-bottom:3px;flex-wrap:wrap}
.ep-lbl{font-weight:600;color:var(--text2);flex-shrink:0;font-size:11px}
.ep-lbl.note-lbl{color:#6366f1}
.ep-txt{min-width:0}
.ep-txt a{color:var(--od);word-break:break-all}.ep-txt a:hover{text-decoration:underline}
.ep-edit{background:none;border:none;cursor:pointer;font-size:12px;color:var(--text2);padding:0 3px;flex-shrink:0}
.ep-controls{display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap}
.ep-cl{font-size:10.5px;color:var(--text2)}
.tl-dots-row{display:flex;gap:7px}
.tl-dot-btn{width:22px;height:22px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:transform 0.1s,border-color 0.1s;flex-shrink:0}
.tl-dot-btn.dot-active{border-color:var(--text);transform:scale(1.15)}
.pri-row{display:flex;gap:5px;flex-wrap:wrap}
.pri-btn{width:32px;height:25px;border-radius:5px;border:1px solid var(--bdr);background:none;cursor:pointer;font-size:10.5px;font-weight:700;transition:border-color 0.1s}
.pri-btn.pri-active{border:2px solid var(--text)}
.ep-add{display:flex;gap:7px;margin-bottom:8px;align-items:center;flex-wrap:wrap}
.pill{padding:5px 11px;border-radius:20px;border:1px solid var(--bdr);background:none;cursor:pointer;font-size:11px;font-weight:500;transition:all 0.15s}
.pill.pill-sf{background:#dbeafe;border-color:#93c5fd;color:#1e40af}
.pill.pill-nt{background:#ede9fe;border-color:#a5b4fc;color:#4338ca}
.pill.pill-ai{background:#fff8ed;border-color:var(--orange);color:var(--od)}
.ep-ta{width:100%;border:1px solid var(--bdr);border-radius:7px;padding:7px 10px;font-size:12px;font-family:inherit;resize:vertical;min-height:58px;transition:border-color 0.15s}
.ep-ta:focus{outline:none;border-color:var(--orange)}
.ep-acts{display:flex;gap:8px;margin-top:7px}
.save-btn{background:var(--orange);color:#fff;border:none;border-radius:6px;padding:7px 18px;font-size:12px;font-weight:600;cursor:pointer;transition:background 0.15s}
.save-btn:hover{background:var(--od)}
.save-btn:disabled{opacity:0.55;cursor:not-allowed}
.ctrl-bar{padding:10px 18px;background:#fff;border-top:1px solid var(--bdr);display:flex;align-items:center;gap:9px;flex-wrap:wrap;flex-shrink:0;position:sticky;bottom:0;z-index:100}
.cbtn{padding:6px 14px;border-radius:20px;font-size:11.5px;font-weight:500;cursor:pointer;border:1px solid;transition:all 0.15s;white-space:nowrap}
.cbtn-or{background:var(--orange);color:#fff;border-color:var(--od)}.cbtn-or:hover{background:var(--od)}
.cbtn-dk{background:#1e293b;color:#fff;border-color:#0f172a}.cbtn-dk:hover{background:#374151}
.cbtn-ol{background:none;color:var(--text);border-color:var(--bdr)}.cbtn-ol:hover{background:var(--bg)}
.status-bar{margin-left:auto;font-size:11px;color:var(--text2)}
.src-link{cursor:pointer;text-decoration:underline}.src-link:hover{color:var(--text)}
.attr{text-align:center;padding:10px 20px;font-size:10.5px;color:var(--text2);border-top:1px solid var(--bdr);background:#fff;flex-shrink:0}
.attr a{color:var(--od);text-decoration:none}.attr a:hover{text-decoration:underline}
.attr-or{color:var(--orange)!important;cursor:pointer}.attr-or:hover{text-decoration:underline}
.modal-ov{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);z-index:2000;align-items:center;justify-content:center;padding:20px}
.modal-ov.open{display:flex}
.modal-box{background:#fff;border-radius:16px;padding:24px;max-width:600px;width:100%;max-height:82vh;overflow-y:auto}
.modal-box h3{font-size:15px;font-weight:700;margin-bottom:12px}
.modal-close{background:var(--orange);color:#fff;border:none;border-radius:7px;padding:7px 18px;cursor:pointer;font-size:12px;font-weight:600;margin-top:14px}
.warn-txt{font-size:11.5px;color:var(--text2);background:#fef9c3;border:1px solid #fde68a;border-radius:6px;padding:8px 10px;margin-bottom:12px}
.src-list{list-style:none;padding:0}
.src-list li{padding:6px 0;border-bottom:1px solid var(--bdr);font-size:12px}
.src-list li:last-child{border-bottom:none}
.src-list a{color:var(--od);word-break:break-all}
.upd-ta{width:100%;border:1px solid var(--bdr);border-radius:7px;padding:10px;font-size:11px;font-family:monospace;resize:vertical;height:240px;background:#f8fafc}
.copy-btn{background:#1e293b;color:#fff;border:none;border-radius:7px;padding:7px 16px;cursor:pointer;font-size:12px;font-weight:600;margin-top:10px}
.copy-btn.copied{background:#22c55e}
.chat-fab{position:fixed;bottom:68px;right:22px;background:linear-gradient(135deg,#F5A623,#e09000);color:#fff;font-weight:600;font-size:13px;padding:11px 19px;border-radius:24px;border:none;cursor:pointer;box-shadow:0 4px 14px rgba(245,166,35,0.4);z-index:1000;transition:transform 0.15s,box-shadow 0.15s}
.chat-fab:hover{transform:scale(1.06);box-shadow:0 6px 18px rgba(245,166,35,0.5)}
.chat-panel{position:fixed;bottom:128px;right:22px;width:420px;max-width:calc(100vw - 44px);height:520px;max-height:calc(100vh - 155px);background:#fff;border:1px solid var(--bdr);border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.15);z-index:1001;display:none;flex-direction:column;overflow:hidden}
.chat-panel.open{display:flex}
.chat-hdr{background:linear-gradient(135deg,#F5A623,#e09000);padding:13px 15px;display:flex;justify-content:space-between;align-items:center}
.chat-hdr-l h4{color:#fff;font-size:14px;font-weight:700}
.chat-hdr-l small{color:rgba(255,255,255,0.85);font-size:10.5px}
.chat-hdr-r{display:flex;gap:6px}
.chat-hbtn{width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,0.25);border:none;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;color:#fff}
.chat-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:9px}
.chat-m{max-width:86%;padding:9px 11px;border-radius:10px;font-size:11.5px;line-height:1.5}
.chat-m.user{align-self:flex-end;background:#fff8ed;border:1px solid #fde68a}
.chat-m.asst{align-self:flex-start;background:#f1f5f9;border:1px solid #e2e8f0}
.chat-m.sys{align-self:center;color:var(--text2);font-size:10.5px;font-style:italic}
.chat-in-area{padding:11px;border-top:1px solid var(--bdr);display:flex;gap:7px}
.chat-in{flex:1;border:1px solid var(--bdr);border-radius:7px;padding:7px 9px;font-size:11.5px;font-family:inherit;resize:none}
.chat-in:focus{outline:none;border-color:var(--orange)}
.chat-send{background:var(--orange);color:#fff;border:none;border-radius:7px;padding:7px 12px;cursor:pointer;font-size:12px;font-weight:600}
.chat-settings-pane{flex:1;overflow-y:auto;padding:14px;display:none;flex-direction:column;gap:11px}
.chat-settings-pane.open{display:flex}
.set-fld{display:flex;flex-direction:column;gap:3px}
.set-fld label{font-size:10.5px;font-weight:600;color:var(--text2)}
.set-fld input{border:1px solid var(--bdr);border-radius:6px;padding:6px 9px;font-size:11.5px}
.set-save{background:var(--orange);color:#fff;border:none;border-radius:7px;padding:7px 15px;cursor:pointer;font-size:12px;font-weight:600}
.set-back{color:var(--orange);font-size:11.5px;cursor:pointer;text-decoration:underline}
.disclaim{font-size:10px;color:var(--text2);background:#f1f5f9;border-radius:5px;padding:7px;line-height:1.5;font-style:italic}
.help-txt{font-size:11px;color:var(--text2);line-height:1.5}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
.box.box-selected{border:2px solid #475569!important}
.detail-box{width:160px;background:#fff;border:1px solid #d1d5db;border-radius:0 0 7px 7px;margin-top:-1px;padding:5px 7px;font-size:10.5px;line-height:1.4;color:var(--text);max-height:72px;overflow-y:auto;cursor:text;outline:none;word-break:break-word}
.detail-box:focus{border-color:var(--orange)}
.detail-box:empty:before{content:attr(data-placeholder);color:var(--text2);font-style:italic}
.pill.pill-n1{background:#fef3c7;border-color:#fde68a;color:#92400e}
.pill.pill-n2{background:#d1fae5;border-color:#6ee7b7;color:#065f46}
.pill.pill-n3{background:#ffe4e6;border-color:#fecdd3;color:#9f1239}
.thinking-dots{display:inline-flex;gap:4px;padding:6px 0}.thinking-dots span{width:6px;height:6px;border-radius:50%;background:var(--text2);animation:pulse 1.2s infinite}
.thinking-dots span:nth-child(2){animation-delay:0.2s}.thinking-dots span:nth-child(3){animation-delay:0.4s}
.pulsing{animation:pulse 0.9s infinite}
.save-toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);color:#fff;font-size:12.5px;padding:12px 20px;border-radius:10px;box-shadow:0 4px 14px rgba(0,0,0,0.2);z-index:3000;transition:opacity 0.3s;cursor:pointer}
.save-toast.fade{opacity:0}
.info-link{color:rgba(255,255,255,0.85);font-size:10.5px;cursor:pointer;text-decoration:underline;margin-left:12px}
.info-link:hover{color:#fff}
.page-info-bar{padding:5px 20px;font-size:11.5px;color:var(--text2);background:#fff;border-bottom:1px solid var(--bdr);flex-shrink:0}
.page-info-bar .pi-link{color:var(--od);cursor:pointer;text-decoration:underline;font-weight:500}
.page-info-bar .pi-link:hover{color:var(--orange)}
.info-ta{width:100%;border:1px solid var(--bdr);border-radius:7px;padding:10px;font-size:12px;font-family:inherit;resize:vertical;min-height:180px;line-height:1.6}
.info-ta:focus{outline:none;border-color:var(--orange)}
`;

function buildHTML(TITLE) {
return `
<div class="hdr"><div class="hdr-left"><div class="hdr-title">${TITLE}</div><span class="hdr-binfo" onclick="openBoardInfo()">Board info</span></div><div class="hdr-right"><div class="hdr-tagline">See. Plan. Do.\u2122</div><div class="hdr-brand">Prototype DoView\u00AE Board V1.0.8</div></div></div>
<div class="tab-bar"><div class="tabs" id="tabBar"></div></div>
<div class="page-info-bar" id="pageInfoBar" style="display:none"></div>
<div class="main-wrap"><div class="main" id="main"><div id="board"></div><div id="epWrap" style="display:none;padding:0"></div></div></div>
<div class="ctrl-bar">
  <button class="cbtn cbtn-dk" id="dlBtn" onclick="downloadBoard()">Save Board</button>
  <button class="cbtn cbtn-ol" onclick="copyBoardHTML()">Copy Board as HTML</button>
  <button class="cbtn cbtn-ol" onclick="printBoard()">Print Board</button>
  <button class="cbtn cbtn-ol" id="saveBtn2" onclick="saveToClaud()">Sync to Main AI Chat</button>
  <div class="status-bar"><span class="src-link" onclick="openSources()">Sources</span><span id="statTxt"> · 0/0 complete · 0 yellow · 0 blockers</span></div>
</div>
<div class="attr">
  DoView® Planning — Dr Paul Duignan — <a href="https://doviewplanning.org" target="_blank">doviewplanning.org</a> ·
  <span class="attr-or" style="cursor:pointer;text-decoration:none" onclick="openInfoDev()">Info for developers</span> ·
  <span class="attr-or" style="cursor:pointer;text-decoration:none" onclick="openAck()">Acknowledgements</span> ·
  <span class="attr-or" style="cursor:pointer;text-decoration:none" onclick="openDisclaimer()">Disclaimer</span>
</div>
<div class="modal-ov" id="srcModal"><div class="modal-box"><div class="warn-txt">⚠️ Sources AI generated, may not work, and click at your own risk.</div><h3>📚 Sources</h3><ul class="src-list" id="srcList"></ul><button class="modal-close" onclick="closeModal('srcModal')">Close</button></div></div>
<div class="modal-ov" id="infoModal"><div class="modal-box"><h3>Info for developers</h3><p style="font-size:12.5px;line-height:1.7;color:var(--text2)">DoView boards are a proven approach to planning which are adaptable to any topic, context, or scale, and shaped by thousands of real-world applications. Behind the simplicity of the This-Then layout is a robust conceptual foundation in outcomes theory, ensuring that what gets built is not just visually clear but analytically sound.<br><br>The goto website for DoView Boards and DoView Planning is <a href="https://doviewplanning.org" target="_blank">DoViewPlanning.org</a>. You can find information on the approach and many examples of boards there. You can find our Github at <a href="https://doviewplanning.org/doviewboards" target="_blank">DoViewPlanning.org/DoViewBoards</a>. It will include a DoView Board minimum specification. Feel free to expand DoView Boards in any way you like from there. We think that they could potentially be used as a type of GUI &lsquo;intent engineering&rsquo; interface for building and controlling agentic systems and perhaps be used by agentic systems themselves to plan and coordinate their activity.<br><br>Our Github will also include the example reference javascript engine that created this DoView Board. Plus a prompt for building PowerPoint DoViews, our Gartner Cool Vendor award-winning DoView legacy app, examples of DoView Boards and other resources.<br><br>Developers are encouraged to implement and extend DoView Boards within any app, platform or system, just with acknowledgment (for details see <a href="https://doviewplanning.org/trademarkuse" target="_blank">DoViewPlanning.org/trademarkuse</a>).<br><br>If you want help doing so (from the conceptual point of view), please contact us on the <a href="https://doviewplanning.org" target="_blank">DoViewPlanning.org</a> website where you can also see projects we would like to collaborate with developers on <a href="https://doviewplanning.org/collaborate" target="_blank">DoViewPlanning.org/collaborate</a>.<br><br>DoViews are drawn to a specific standard to ensure that they are fit for purpose set out in the DoView Boards minimum standard. Please follow this basic standard for how DoView Boards are structured and presented and innovate as much as you like on top of this. If you do put DoView Boards into any app, platform or system, if you are able, please let us know.</p><button class="modal-close" onclick="closeModal('infoModal')">Close</button></div></div>
<div class="modal-ov" id="disclaimerModal"><div class="modal-box"><h3>Disclaimer</h3><p style="font-size:12.5px;line-height:1.7;color:var(--text2)">DoView boards are provided for planning and illustrative purposes only. The content of any DoView board does not constitute professional advice of any kind, including but not limited to legal, financial, medical, strategic, or organisational advice. No warranty is given as to the accuracy, completeness, or fitness for purpose of any content. Dr Paul Duignan, DoViewPlanning.org, The Ideas Web Ltd, DoView Corporation Ltd and any associated parties accept no liability whatsoever for any loss, damage, or adverse outcome arising directly or indirectly from the use of, or reliance on, any DoView board or its contents. Use entirely at your own risk.</p><button class="modal-close" onclick="closeModal('disclaimerModal')">Close</button></div></div>
<div class="modal-ov" id="ackModal"><div class="modal-box"><h3>Acknowledgements</h3><p style="font-size:12.5px;line-height:1.7;color:var(--text2)">DoView Planning methodology, outcomes theory and DoView Boards were developed by Dr Paul Duignan, software engineering of the DoView legacy app by Richard Procter and earlier management by Jennifer Parker. Involvement of Dr Matthew Duignan and others.<br><br>Thank you to the hundreds of clients and organisations worked with over the years using DoView Boards for planning, performance measurement, evaluation and other outcomes work.<br><br>Thanks to Auckland and Massey Universities, where Dr Duignan worked on projects that influenced his thinking about outcomes and planning. And to his time as a Fulbright Senior Scholar at the Urban Institute in Washington D.C. working on outcomes theory.<br><br>A special thank you to the Duignan family and others for protracted discussions about, and testing of, DoViewing over multiple years.</p><button class="modal-close" onclick="closeModal('ackModal')">Close</button></div></div>
<div class="modal-ov" id="updModal"><div class="modal-box"><h3>Paste this into the main AI chat</h3><p style="font-size:12px;color:var(--text2);margin-bottom:10px">Then you can ask the main AI chat questions about the up-to-date board, and it can rebuild the latest version later. You should usually do this just before closing the chat window.</p><textarea class="upd-ta" id="updTa" readonly></textarea><br><button class="copy-btn" id="cpyBtn" onclick="copyState()">Select All and Copy</button><button class="modal-close" style="margin-left:8px" onclick="closeModal('updModal')">Close</button></div></div>
<div class="modal-ov" id="htmlCopyModal"><div class="modal-box"><h3>Copy this board as HTML</h3><p style="font-size:12px;color:var(--text2);margin-bottom:10px">Paste it into a text file and save it with a .html extension in case Save Board does not work reliably.</p><textarea class="upd-ta" id="htmlCopyTa" readonly></textarea><br><button class="copy-btn" id="htmlCpyBtn" onclick="copyHTMLState()">Select All and Copy</button><button class="modal-close" style="margin-left:8px" onclick="closeModal('htmlCopyModal')">Close</button></div></div>
<div class="modal-ov" id="boardInfoModal"><div class="modal-box"><h3>Board info</h3><p style="font-size:11.5px;color:var(--text2);margin-bottom:10px">Put notes here about the board as a whole, including overall assumptions, cross-page links, evidence, caveats, definitions, and URLs.</p><textarea class="info-ta" id="boardInfoTa"></textarea><div style="display:flex;gap:8px;margin-top:10px"><button class="modal-close" onclick="saveBoardInfo()">Save</button><button class="modal-close" style="background:var(--text2)" onclick="closeModal('boardInfoModal')">Close</button></div></div></div>
<div class="modal-ov" id="pageInfoModal"><div class="modal-box"><h3 id="pageInfoTitle">Page info</h3><p style="font-size:11.5px;color:var(--text2);margin-bottom:10px">Put notes here about this page as a whole, including evidence about links between boxes on this page or between this page and other pages.</p><textarea class="info-ta" id="pageInfoTa"></textarea><div style="display:flex;gap:8px;margin-top:10px"><button class="modal-close" onclick="savePageInfo()">Save</button><button class="modal-close" style="background:var(--text2)" onclick="closeModal('pageInfoModal')">Close</button></div></div></div>
<button class="chat-fab" onclick="toggleChat()">Chat with board</button>
<div class="chat-panel" id="chatPanel">
  <div class="chat-hdr"><div class="chat-hdr-l"><h4>Chat with board</h4><small id="chatStatus">Connecting...</small></div><div class="chat-hdr-r"><button class="chat-hbtn" id="undoBtn" onclick="doUndo()" title="Undo" style="display:none;font-size:12px">↩</button><button class="chat-hbtn" onclick="toggleChatSettings()" title="Settings">⚙️</button><button class="chat-hbtn" onclick="toggleChat()" title="Close">✕</button></div></div>
  <div class="chat-msgs" id="chatMsgs"></div>
  <div id="chatInputArea" class="chat-in-area"><textarea class="chat-in" id="chatIn" rows="2" placeholder="Ask about your board..."></textarea><button class="chat-send" onclick="sendChat()">Send</button></div>
  <div class="chat-settings-pane" id="chatSettingsPane">
    <strong style="font-size:13px">⚙️ AI Connection Settings</strong>
    <div class="set-fld"><label>API Endpoint</label><input id="setEP" type="text" placeholder="https://api.openai.com/v1/chat/completions"></div>
    <div class="set-fld"><label>API Key</label><input id="setKey" type="password" placeholder="sk-..."></div>
    <div class="set-fld"><label>Model</label><input id="setModel" type="text" placeholder="gpt-4o"></div>
    <label style="font-size:11px;display:flex;gap:6px;align-items:center"><input type="checkbox" id="rememberAI"> Remember these settings</label>
    <div class="help-txt">Paste your provider's chat completions endpoint and API key. Most providers (OpenAI, OpenRouter, Groq, Together, Ollama) use the same format.<br><br>Not sure? OpenRouter works from browsers and gives access to Claude, GPT, Gemini, Llama, and more through one endpoint.</div>
    <div class="disclaim">Note: Doing this will expose your board to the AI you connect it to. Make sure you trust the AI. The developers of DoView Boards do not accept any responsibility for risks arising from how you use this DoView Board.</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="set-save" onclick="saveChatSettings()">Save Settings</button><button class="set-save" style="background:#475569" onclick="testChatConn()">Test Connection</button></div>
    <div id="connTestResult" style="font-size:11px;color:var(--text2)"></div>
    <div class="set-back" onclick="toggleChatSettings()">← Back to chat</div>
  </div>
</div>`;
}

// ─── GLOBALS (set by init) ───
let TITLE, SLUG, SP, FO_DATA, B={}, DEPS={}, currentPage='overview', openBox=null, entryMode='sofar', editingType=null;
let sources=[], chatMsgs=[], claudeConnected=false, aiSettings={}, chatSettingsOpen=false, undoStack=[], pendingStructural=[];
let boardInfo='', pageInfo={};
const MAX_UNDO=20;
const COL_COLORS=[{bg:'#dbeafe',bdr:'#93c5fd',tab:'#3b82f6'},{bg:'#f3e8ff',bdr:'#d8b4fe',tab:'#a855f8'},{bg:'#ccfbf1',bdr:'#5eead4',tab:'#0d9488'},{bg:'#fef3c7',bdr:'#fde68a',tab:'#f59e0b'},{bg:'#fce7f3',bdr:'#f9a8d4',tab:'#db2777'},{bg:'#dcfce7',bdr:'#86efac',tab:'#16a34a'},{bg:'#e0e7ff',bdr:'#a5b4fc',tab:'#6366f1'},{bg:'#f1f5f9',bdr:'#cbd5e1',tab:'#64748b'},{bg:'#ffe4e6',bdr:'#fecdd3',tab:'#e11d48'},{bg:'#cffafe',bdr:'#67e8f9',tab:'#0891b2'}];
const DEFAULT_COLOR={bg:'#f1f5f9',bdr:'#cbd5e1',tab:'#64748b'};
function spColor(sp){return sp.color||DEFAULT_COLOR;}
const PRI_COLORS={A:'#dc2626',B:'#ea580c',C:'#ca8a04',D:'#2563eb',E:'#4f46e5',BAU:'#94a3b8'};
const STRUCTURAL_CMDS=['addBox','removeBox','renameBox','addColumn','removeColumn','renameColumn','moveColumn','addSubpage','removeSubpage','addFinalOutcome','removeFinalOutcome'];

// ─── CORE ───
function buildInitialState(){SP.forEach(sp=>{sp.cols.forEach((col,ci)=>{col.boxes.forEach((label,bi)=>{B[`${sp.id}-c${ci}-b${bi}`]={label,light:ci===0?'yellow':'grey',entries:[],priority:'',hasSubpage:false,detailText:'',borderColor:''};});});});FO_DATA.forEach((label,i)=>{B[`final-b${i}`]={label,light:'grey',entries:[],priority:'',hasSubpage:false,detailText:'',borderColor:''};});}
function buildDepsMap(){DEPS={};SP.forEach(sp=>{sp.cols.forEach((col,ci)=>{if(ci===0)return;col.boxes.forEach((_,bi)=>{const k=`${sp.id}-c${ci}-b${bi}`;DEPS[k]=sp.cols[ci-1].boxes.map((_,pbi)=>`${sp.id}-c${ci-1}-b${pbi}`);});});});}
function cascade(){let changed=true,iter=0;while(changed&&iter++<20){changed=false;SP.forEach(sp=>{sp.cols.forEach((col,ci)=>{if(ci===0)return;col.boxes.forEach((_,bi)=>{const k=`${sp.id}-c${ci}-b${bi}`;const box=B[k];if(!box||box.light!=='grey')return;const deps=DEPS[k]||[];if(!deps.length)return;const anyRed=deps.some(dk=>B[dk]?.light==='red');const allGreen=deps.every(dk=>B[dk]?.light==='green');if(!anyRed&&allGreen){box.light='yellow';changed=true;}});});});}const subKeys=Object.keys(B).filter(k=>!k.startsWith('final-'));const pct=subKeys.length?subKeys.filter(k=>B[k].light==='green').length/subKeys.length:0;FO_DATA.forEach((_,i)=>{const b=B[`final-b${i}`];if(b&&b.light==='grey'&&pct>=0.6)b.light='yellow';});}
function saveState(){try{const cleanB={};Object.entries(B).forEach(([k,v])=>{cleanB[k]={label:v.label,light:v.light,entries:[...v.entries],priority:v.priority,hasSubpage:v.hasSubpage,detailText:v.detailText||'',borderColor:v.borderColor||''};});const state={B:cleanB,SP:JSON.parse(JSON.stringify(SP)),FO:[...FO_DATA],boardInfo:boardInfo,pageInfo:JSON.parse(JSON.stringify(pageInfo))};localStorage.setItem(`doview-${SLUG}-v1`,JSON.stringify(state));}catch(e){}}

// ─── LINKIFY ───
function linkify(text){return text.replace(/(https?:\/\/[^\s<>"')\]]+)/g,'<a href="$1" target="_blank" style="color:var(--od);word-break:break-all">$1</a>');}

// ─── RENDER ───
function tlColor(l){return{yellow:'#F5C518',green:'#2ECC71',red:'#E74C3C',grey:'#94A3B8'}[l]||'#94A3B8';}
function priColor(p){return PRI_COLORS[p]||'';}
function boxHTML(key,boxData,isLast,spColor){const{label,light,priority,hasSubpage,detailText,borderColor}=boxData;const entries=Array.isArray(boxData.entries)?boxData.entries:[];const hasSofar=entries.some(e=>e.type==='sofar');const editLbl=light==='green'&&hasSofar?'<span class="edit-lbl">edit</span>':'';const priTxt=priority||'';const priBadge=`<div class="pri-badge" style="${priTxt?`color:${priColor(priTxt)};font-size:${priTxt==='BAU'?'7.5':'9.5'}px`:''}">${priTxt}</div>`;const drillHTML=hasSubpage?'<div class="box-drill"></div>':'';const greyClass=light==='grey'?' grey-state':'';const lastClass=isLast?' last-col':'';const selClass=key===openBox?' box-selected':'';const bdrColor=borderColor||spColor.bdr;const bdrWidth=borderColor?'2px':'1px';const detailHTML=detailText?`<div class="detail-box" contenteditable="true" data-key="${key}" onblur="saveDetail('${key}',this.textContent)">${detailText}</div>`:'';return `<div class="box${lastClass}${greyClass}${selClass}" style="background:${spColor.bg};border-color:${bdrColor};border-width:${bdrWidth}" onclick="clickBox('${key}')" id="bx-${key}">${priBadge}<div class="tl-dot" id="tl-${key}" style="background:${tlColor(light)}"></div>${editLbl}<div class="box-txt">${label}</div>${drillHTML}</div>${detailHTML}`;}
function renderTabBar(){const singlePage=SP.length===1;const pages=[...(singlePage?[]:[{id:'overview',label:'Overview',tc:null}]),{id:'final',label:'Final Outcomes',tc:null},...SP.map(s=>({id:s.id,label:s.label,tc:(s.color||DEFAULT_COLOR).tab}))];document.getElementById('tabBar').innerHTML=pages.map(p=>{const a=currentPage===p.id;const bc=a?(p.tc||'#F5A623'):'transparent';const bg=a&&p.tc?p.tc+'33':'transparent';return `<div class="tab ${a?'active':''}" style="border-bottom-color:${bc};background:${bg}" onclick="navTo('${p.id}')">${p.label}</div>`;}).join('');}
function navTo(id){currentPage=id;openBox=null;editingType=null;document.getElementById('epWrap').style.display='none';render();}
function renderOverview(){const foG=FO_DATA.filter((_,i)=>B[`final-b${i}`]&&B[`final-b${i}`].light==='green').length;return `<div class="ov-final" onclick="navTo('final')"><h3>Final Outcomes</h3><p>The high-level outcomes — click to explore</p><div style="font-size:10.5px;color:var(--od);margin-top:6px">${foG}/${FO_DATA.length} complete</div></div><hr class="ov-divider"><div class="sp-grid">${SP.map(sp=>{const ks=Object.keys(B).filter(k=>k.startsWith(sp.id+'-'));const g=ks.filter(k=>B[k].light==='green').length;const y=ks.filter(k=>B[k].light==='yellow').length;return `<div class="sp-tile" style="background:${spColor(sp).bg};border:1px solid ${spColor(sp).bdr}" onclick="navTo('${sp.id}')"><h4>${sp.label}</h4><p>${g}/${ks.length} complete · ${y} to act on</p><div class="drill-tri"></div></div>`;}).join('')}</div><p class="ov-hint">Click a subpage tile to view its This→Then causal logic · Click Final Outcomes to see end goals</p>`;}
function renderFinalOutcomes(){return `<h3 style="font-size:14px;font-weight:700;color:var(--od);margin-bottom:16px;text-align:center">Final Outcomes</h3><div class="fo-list">${FO_DATA.map((label,i)=>{const k=`final-b${i}`,b=B[k];if(!b)return '';const pb=b.priority?`<div class="pri-badge" style="color:${priColor(b.priority)};font-size:${b.priority==='BAU'?'7.5':'9.5'}px">${b.priority}</div>`:'<div class="pri-badge"></div>';return `<div class="fo-box" onclick="clickBox('${k}')" id="bx-${k}">${pb}<div class="tl-dot" id="tl-${k}" style="background:${tlColor(b.light)}"></div><div class="box-txt">${label}</div></div>`;}).join('')}</div>`;}
function renderSubpage(pid){const sp=SP.find(s=>s.id===pid);if(!sp)return '';const nc=sp.cols.length;const singlePage=SP.length===1;const cols=sp.cols.map((col,ci)=>{const isLast=ci===nc-1;const colColor=singlePage?COL_COLORS[ci%COL_COLORS.length]:spColor(sp);const boxes=col.boxes.map((_,bi)=>{const k=`${sp.id}-c${ci}-b${bi}`;return B[k]?boxHTML(k,B[k],isLast,colColor):'';}).join('');return `<div class="col-wrap"><div class="col-h ${isLast?'last-col':''}">${col.h}</div><div class="col-boxes">${boxes}</div></div>`;});let inner='';cols.forEach((col,i)=>{inner+=col;if(i<cols.length-1){const arrowColor=singlePage?COL_COLORS[i%COL_COLORS.length].bdr:spColor(sp).bdr;inner+=`<div class="col-arrow"><svg width="10" height="18" viewBox="0 0 10 18"><polygon points="0,0 10,9 0,18" fill="${arrowColor}" opacity="0.45"/></svg></div>`;}});const backBtn=singlePage?'':`<button class="back-btn" onclick="navTo('overview')">← Back to Overview</button>`;return `${backBtn}<div class="board-scroll"><div class="ttw"><div class="sidebar"><span>This</span></div><div class="cols-row">${inner}</div><div class="sidebar"><span>Then</span></div></div></div>`;}
function render(){renderTabBar();renderPageInfoBar();const b=document.getElementById('board');if(currentPage==='overview')b.innerHTML=renderOverview();else if(currentPage==='final')b.innerHTML=renderFinalOutcomes();else b.innerHTML=renderSubpage(currentPage);updateStatus();if(openBox)renderEntryPanel();else document.getElementById('epWrap').style.display='none';}
function updateStatus(){const a=Object.keys(B);const g=a.filter(k=>B[k].light==='green').length;const y=a.filter(k=>B[k].light==='yellow').length;const r=a.filter(k=>B[k].light==='red').length;document.getElementById('statTxt').textContent=` · ${g}/${a.length} complete · ${y} yellow · ${r} blockers`;}

// ─── ENTRY PANEL ───
function clickBox(key){if(openBox===key){closeEntry();return;}openBox=key;entryMode='sofar';editingType=null;renderEntryPanel();}
function closeEntry(){openBox=null;editingType=null;document.getElementById('epWrap').style.display='none';}
function renderEntryPanel(){const key=openBox;if(!key||!B[key])return;const box=B[key];if(!Array.isArray(box.entries))box.entries=[];const ep=document.getElementById('epWrap');ep.style.display='block';const sf=box.entries.filter(e=>e.type==='sofar').map(e=>e.text),nt=box.entries.filter(e=>e.type==='note').map(e=>e.text),n1=box.entries.filter(e=>e.type==='note1').map(e=>e.text),n2=box.entries.filter(e=>e.type==='note2').map(e=>e.text),n3=box.entries.filter(e=>e.type==='note3').map(e=>e.text);const sfR=sf.length?`<div class="ep-row"><span class="ep-lbl">So far:</span><span class="ep-txt">${sf.map(t=>linkify(t)).join(' | ')}</span><button class="ep-edit" onclick="editEntries('sofar')">✎</button></div>`:'';const ntR=nt.length?`<div class="ep-row"><span class="ep-lbl note-lbl">Notes:</span><span class="ep-txt">${nt.map(t=>linkify(t)).join(' | ')}</span><button class="ep-edit" onclick="editEntries('notes')">✎</button></div>`:'';const n1R=n1.length?`<div class="ep-row"><span class="ep-lbl" style="color:#92400e">Notes 1:</span><span class="ep-txt">${n1.map(t=>linkify(t)).join(' | ')}</span><button class="ep-edit" onclick="editEntries('note1')">✎</button></div>`:'';const n2R=n2.length?`<div class="ep-row"><span class="ep-lbl" style="color:#065f46">Notes 2:</span><span class="ep-txt">${n2.map(t=>linkify(t)).join(' | ')}</span><button class="ep-edit" onclick="editEntries('note2')">✎</button></div>`:'';const n3R=n3.length?`<div class="ep-row"><span class="ep-lbl" style="color:#9f1239">Notes 3:</span><span class="ep-txt">${n3.map(t=>linkify(t)).join(' | ')}</span><button class="ep-edit" onclick="editEntries('note3')">✎</button></div>`:'';const tls=['green','yellow','red','grey'].map(t=>`<div class="tl-dot-btn ${box.light===t?'dot-active':''}" style="background:${tlColor(t)}" onclick="setTL('${key}','${t}')"></div>`).join('');const pris=['A','B','C','D','E','BAU'].map(p=>`<button class="pri-btn ${box.priority===p?'pri-active':''}" style="color:${priColor(p)};font-size:${p==='BAU'?'8':'10.5'}px" onclick="setPri('${key}','${p}')">${p}</button>`).join('');const mc={sofar:'pill-sf',notes:'pill-nt',note1:'pill-n1',note2:'pill-n2',note3:'pill-n3',chat:'pill-ai'};const ph={sofar:'What has been done so far...',notes:'Add a note...',note1:'Notes 1...',note2:'Notes 2...',note3:'Notes 3...'};ep.innerHTML=`<div class="ep"><div class="ep-hdr"><div class="ep-title">${box.label}</div><button class="ep-close" onclick="closeEntry()">✕</button></div><div class="ep-entries">${sfR}${ntR}${n1R}${n2R}${n3R}</div><div class="ep-controls"><span class="ep-cl">Status:</span><div class="tl-dots-row">${tls}</div><span class="ep-cl" style="margin-left:6px">Priority:</span><div class="pri-row">${pris}</div></div><div class="ep-add"><button class="${entryMode==='sofar'?'pill '+mc.sofar:'pill'}" onclick="setMode('sofar')">So far</button><button class="${entryMode==='notes'?'pill '+mc.notes:'pill'}" onclick="setMode('notes')">My notes</button><button class="${entryMode==='note1'?'pill '+mc.note1:'pill'}" onclick="setMode('note1')">Notes 1</button><button class="${entryMode==='note2'?'pill '+mc.note2:'pill'}" onclick="setMode('note2')">Notes 2</button><button class="${entryMode==='note3'?'pill '+mc.note3:'pill'}" onclick="setMode('note3')">Notes 3</button><button class="${entryMode==='chat'?'pill '+mc.chat:'pill'}" onclick="openAIChatBox('${key}')">Chat with board</button></div><textarea class="ep-ta" id="epTa" placeholder="${ph[entryMode]||'Add a note...'}" onkeydown="if(event.ctrlKey&&event.key==='Enter')saveEntry()"></textarea><div class="ep-acts"><button class="save-btn" id="saveBtn" onclick="saveEntry()">Save ↵</button></div></div>`;}
async function setMode(mode){editingType=null;const ta=document.getElementById('epTa');const ct=ta?ta.value.trim():'';if(ct){await doSaveEntry(ct,mode);if(mode===entryMode){ta.value='';renderEntryPanel();return;}}entryMode=mode;renderEntryPanel();setTimeout(()=>{const t=document.getElementById('epTa');if(t)t.focus();},50);}
function editEntries(type){const typeMap={sofar:'sofar',notes:'note',note1:'note1',note2:'note2',note3:'note3'};editingType=typeMap[type]||type;entryMode=type;const box=B[openBox];const entries=box.entries.filter(e=>e.type===editingType).map(e=>e.text);renderEntryPanel();setTimeout(()=>{const ta=document.getElementById('epTa');if(ta){ta.value=entries.join(' | ');ta.focus();}},50);}
function setTL(key,state){B[key].light=state;cascade();saveState();render();}
function setPri(key,pri){B[key].priority=B[key].priority===pri?'':pri;saveState();render();}
async function saveEntry(){const ta=document.getElementById('epTa');if(!ta)return;const text=ta.value.trim();if(!text)return;await doSaveEntry(text,entryMode);ta.value='';editingType=null;renderEntryPanel();}
async function doSaveEntry(text,mode){const key=openBox;if(!key||!B[key])return;const box=B[key];if(!Array.isArray(box.entries))box.entries=[];const saveBtn=document.getElementById('saveBtn');if(mode==='sofar'){const parts=text.split('|').map(s=>s.trim()).filter(Boolean);if(editingType==='sofar'){box.entries=box.entries.filter(e=>e.type!=='sofar');}parts.forEach(p=>box.entries.push({type:'sofar',text:p}));editingType=null;if(saveBtn)saveBtn.disabled=true;const tlDot=document.getElementById(`tl-${key}`);if(tlDot)tlDot.classList.add('pulsing');const intent=await classifyText(text);if(tlDot)tlDot.classList.remove('pulsing');if(saveBtn)saveBtn.disabled=false;if(intent==='blocker')box.light='red';else if(intent==='defer'){}else{if(box.light!=='green')box.light='green';}cascade();}else{const typeMap={notes:'note',note1:'note1',note2:'note2',note3:'note3'};const entryType=typeMap[mode]||'note';const parts=text.split('|').map(s=>s.trim()).filter(Boolean);if(editingType===entryType){box.entries=box.entries.filter(e=>e.type!==entryType);}parts.forEach(p=>box.entries.push({type:entryType,text:p}));editingType=null;}saveState();render();}

// ─── CLASSIFY ───
async function classifyText(text){const lo=text.toLowerCase().trim();if(/\b(not yet|later|leave|defer|hold off|come back|closer to|will do later|for later|at the moment|not sure|unsure|don't know yet|check later|wait|postpone|pending|tbd|yellow|keep yellow|stay yellow|make yellow|leave yellow|leave this|do this later|haven't done|have not done|can't do yet|cannot do yet)\b/.test(lo))return 'defer';if(/\b(problem|issue|blocked|blocker|can't|cannot|won't work|stuck|risk|danger|concern|obstacle|stopping|prevents|failed|fail|broken|error)\b/.test(lo))return 'blocker';try{const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:20,system:'Classify the text as exactly one word: defer, blocker, or green. defer=user wants to postpone/come back later. blocker=user flagging a problem or risk. green=actual information, facts, confirmations. Reply with ONLY that one word.',messages:[{role:'user',content:text}]})});if(r.ok){const d=await r.json();const res=d.content?.[0]?.text?.trim().toLowerCase();if(['defer','blocker','green'].includes(res))return res;}}catch(e){}return 'green';}

// ─── UNDO ───
function takeSnapshot(){const snap={B:JSON.parse(JSON.stringify(B)),SP:JSON.parse(JSON.stringify(SP)),FO:JSON.parse(JSON.stringify(FO_DATA)),DEPS:JSON.parse(JSON.stringify(DEPS))};undoStack.push(snap);if(undoStack.length>MAX_UNDO)undoStack.shift();updateUndoBtn();}
function doUndo(){if(!undoStack.length)return;const snap=undoStack.pop();B=snap.B;SP.length=0;snap.SP.forEach(s=>SP.push(s));FO_DATA.length=0;snap.FO.forEach(f=>FO_DATA.push(f));DEPS=snap.DEPS;cascade();saveState();render();updateUndoBtn();addChatMsg('system','Undone.');}
function updateUndoBtn(){const btn=document.getElementById('undoBtn');if(btn)btn.style.display=undoStack.length?'flex':'none';}

// ─── COMMAND PARSER — CRITICAL: Do not modify, replace, or "improve" this function ───
function parseActions(text){const actions=[];const clean=text.replace(/\[ACTION:(.*?)\]/g,(_,m)=>{actions.push(m.split(':'));return '';});return {clean:clean.trim(),actions};}

function execAction(parts){const cmd=parts[0];
  if(cmd==='setLight'&&parts.length>=3){const k=parts[1],c=parts[2];if(B[k])B[k].light=c;cascade();saveState();render();}
  else if(cmd==='setAllLights'&&parts.length>=2){const c=parts[1];Object.keys(B).forEach(k=>B[k].light=c);cascade();saveState();render();}
  else if(cmd==='setSubpageLights'&&parts.length>=3){const spId=parts[1],c=parts[2];Object.keys(B).filter(k=>k.startsWith(spId+'-')).forEach(k=>B[k].light=c);cascade();saveState();render();}
  else if(cmd==='addSofar'&&parts.length>=3){const k=parts[1],txt=parts.slice(2).join(':');if(B[k])B[k].entries.push({type:'sofar',text:txt});saveState();render();}
  else if(cmd==='addNote'&&parts.length>=3){const k=parts[1],txt=parts.slice(2).join(':');if(B[k])B[k].entries.push({type:'note',text:txt});saveState();render();}
  else if(cmd==='setPriority'&&parts.length>=3){const k=parts[1],p=parts[2];if(B[k])B[k].priority=p;saveState();render();}
  else if(cmd==='clearEntries'&&parts.length>=3){const k=parts[1],t=parts[2];if(B[k]){if(t==='all')B[k].entries=[];else B[k].entries=B[k].entries.filter(e=>e.type!==t);}saveState();render();}
  else if(cmd==='addNote1'&&parts.length>=3){const k=parts[1],txt=parts.slice(2).join(':');if(B[k])B[k].entries.push({type:'note1',text:txt});saveState();render();}
  else if(cmd==='addNote2'&&parts.length>=3){const k=parts[1],txt=parts.slice(2).join(':');if(B[k])B[k].entries.push({type:'note2',text:txt});saveState();render();}
  else if(cmd==='addNote3'&&parts.length>=3){const k=parts[1],txt=parts.slice(2).join(':');if(B[k])B[k].entries.push({type:'note3',text:txt});saveState();render();}
  else if(cmd==='setDetail'&&parts.length>=3){const k=parts[1],txt=parts.slice(2).join(':');if(B[k])B[k].detailText=txt;saveState();render();}
  else if(cmd==='clearDetail'&&parts.length>=2){const k=parts[1];if(B[k])B[k].detailText='';saveState();render();}
  else if(cmd==='setBoxBorder'&&parts.length>=3){const k=parts[1],c=parts[2];if(B[k])B[k].borderColor=c;saveState();render();}
  else if(cmd==='clearBoxBorder'&&parts.length>=2){const k=parts[1];if(B[k])B[k].borderColor='';saveState();render();}
  else if(cmd==='setSubpageBorders'&&parts.length>=3){const spId=parts[1],c=parts[2];Object.keys(B).filter(k=>k.startsWith(spId+'-')).forEach(k=>B[k].borderColor=c);saveState();render();}
  else if(cmd==='clearSubpageBorders'&&parts.length>=2){const spId=parts[1];Object.keys(B).filter(k=>k.startsWith(spId+'-')).forEach(k=>B[k].borderColor='');saveState();render();}
  else if(cmd==='setBoardInfo'&&parts.length>=2){boardInfo=parts.slice(1).join(':');saveState();}
  else if(cmd==='setPageInfo'&&parts.length>=3){const pid=parts[1];const txt=parts.slice(2).join(':');pageInfo[pid]=txt;saveState();}
  else if(cmd==='addBox'&&parts.length>=4){const spId=parts[1],ci=parseInt(parts[2]),label=parts.slice(3).join(':');const sp=SP.find(s=>s.id===spId);if(sp&&sp.cols[ci]){sp.cols[ci].boxes.push(label);const bi=sp.cols[ci].boxes.length-1;const k=`${spId}-c${ci}-b${bi}`;B[k]={label,light:ci===0?'yellow':'grey',entries:[],priority:'',hasSubpage:false,detailText:'',borderColor:''};buildDepsMap();cascade();saveState();render();}}
  else if(cmd==='removeBox'&&parts.length>=2){const k=parts[1];const m=k.match(/^(p\d+)-c(\d+)-b(\d+)$/);if(m){const spId=m[1],ci=parseInt(m[2]),bi=parseInt(m[3]);const sp=SP.find(s=>s.id===spId);if(sp&&sp.cols[ci]&&sp.cols[ci].boxes[bi]!==undefined){sp.cols[ci].boxes.splice(bi,1);delete B[k];rebuildBoxKeys(spId);buildDepsMap();cascade();saveState();render();}}}
  else if(cmd==='renameBox'&&parts.length>=3){const k=parts[1],nl=parts.slice(2).join(':');if(B[k]){B[k].label=nl;const m=k.match(/^(p\d+)-c(\d+)-b(\d+)$/);if(m){const sp=SP.find(s=>s.id===m[1]);if(sp&&sp.cols[parseInt(m[2])])sp.cols[parseInt(m[2])].boxes[parseInt(m[3])]=nl;}saveState();render();}}
  else if(cmd==='addColumn'&&parts.length>=4){const spId=parts[1],ci=parseInt(parts[2]),h=parts.slice(3).join(':');const sp=SP.find(s=>s.id===spId);if(sp){sp.cols.splice(ci,0,{h,boxes:[]});rebuildBoxKeys(spId);buildDepsMap();cascade();saveState();render();}}
  else if(cmd==='removeColumn'&&parts.length>=3){const spId=parts[1],ci=parseInt(parts[2]);const sp=SP.find(s=>s.id===spId);if(sp&&sp.cols[ci]){sp.cols.splice(ci,1);rebuildBoxKeys(spId);buildDepsMap();cascade();saveState();render();}}
  else if(cmd==='renameColumn'&&parts.length>=4){const spId=parts[1],ci=parseInt(parts[2]),nh=parts.slice(3).join(':');const sp=SP.find(s=>s.id===spId);if(sp&&sp.cols[ci]){sp.cols[ci].h=nh;saveState();render();}}
  else if(cmd==='moveColumn'&&parts.length>=4){const spId=parts[1],fromCi=parseInt(parts[2]),toCi=parseInt(parts[3]);const sp=SP.find(s=>s.id===spId);if(sp&&sp.cols[fromCi]&&toCi>=0&&toCi<=sp.cols.length-1&&fromCi!==toCi){const col=sp.cols.splice(fromCi,1)[0];sp.cols.splice(toCi,0,col);rebuildBoxKeys(spId);buildDepsMap();cascade();saveState();render();}}
  else if(cmd==='addSubpage'&&parts.length>=2){const wasSingle=SP.length===1;const label=parts[1];let bg,bdr,tab;if(parts.length>=5){bg=parts[2];bdr=parts[3];tab=parts[4];}else{const usedBgs=SP.map(s=>(s.color||DEFAULT_COLOR).bg);const avail=COL_COLORS.find(c=>!usedBgs.includes(c.bg))||COL_COLORS[SP.length%COL_COLORS.length];bg=avail.bg;bdr=avail.bdr;tab=avail.tab;}const id='p'+(SP.length+1);SP.push({id,label,color:{bg,bdr,tab},cols:[{h:'First Stage',boxes:[]}]});if(wasSingle){addChatMsg('system','This is now a multi-page board. The overview page has been added and the original page now uses a single colour scheme to match the overview tiles.');currentPage='overview';}buildDepsMap();saveState();render();}
  else if(cmd==='removeSubpage'&&parts.length>=2){const spId=parts[1];const idx=SP.findIndex(s=>s.id===spId);if(idx>=0){Object.keys(B).filter(k=>k.startsWith(spId+'-')).forEach(k=>delete B[k]);SP.splice(idx,1);buildDepsMap();cascade();saveState();if(SP.length===1){addChatMsg('system','This is now a single-page board. The overview page has been removed and columns now use different colours.');currentPage=SP[0].id;render();}else{render();if(currentPage===spId)navTo('overview');}}}
  else if(cmd==='addFinalOutcome'&&parts.length>=2){const label=parts.slice(1).join(':');FO_DATA.push(label);const i=FO_DATA.length-1;B[`final-b${i}`]={label,light:'grey',entries:[],priority:'',hasSubpage:false,detailText:'',borderColor:''};saveState();render();}
  else if(cmd==='removeFinalOutcome'&&parts.length>=2){const i=parseInt(parts[1]);if(i>=0&&i<FO_DATA.length){FO_DATA.splice(i,1);delete B[`final-b${i}`];rebuildFinalKeys();saveState();render();}}
}

function rebuildBoxKeys(spId){const sp=SP.find(s=>s.id===spId);if(!sp)return;const oldB={};Object.keys(B).filter(k=>k.startsWith(spId+'-')).forEach(k=>{oldB[k]=B[k];delete B[k];});sp.cols.forEach((col,ci)=>{col.boxes.forEach((label,bi)=>{const k=`${spId}-c${ci}-b${bi}`;const old=oldB[k];B[k]=old||{label,light:ci===0?'yellow':'grey',entries:[],priority:'',hasSubpage:false,detailText:'',borderColor:''};B[k].label=label;});});}
function rebuildFinalKeys(){const oldB={};Object.keys(B).filter(k=>k.startsWith('final-')).forEach(k=>{oldB[k]=B[k];delete B[k];});FO_DATA.forEach((label,i)=>{const k=`final-b${i}`;const old=oldB[k];B[k]=old||{label,light:'grey',entries:[],priority:'',hasSubpage:false,detailText:'',borderColor:''};B[k].label=label;});}

function processAIResponse(fullText){const{clean,actions}=parseActions(fullText);if(!actions.length)return clean;const stateActions=actions.filter(a=>!STRUCTURAL_CMDS.includes(a[0]));const structActions=actions.filter(a=>STRUCTURAL_CMDS.includes(a[0]));if(stateActions.length||structActions.length)takeSnapshot();stateActions.forEach(a=>execAction(a));if(structActions.length){pendingStructural=structActions;const descs=structActions.map(a=>a.join(' → ')).join(', ');showConfirmation(descs);}return clean;}
function showConfirmation(desc){const msgs=document.getElementById('chatMsgs');const div=document.createElement('div');div.className='chat-m sys';div.innerHTML=`⚠️ Structural change: ${desc}<br><button onclick="confirmStructural(true)" style="background:#22c55e;color:#fff;border:none;border-radius:5px;padding:4px 12px;margin:5px 4px 0 0;cursor:pointer;font-size:11px;font-weight:600">OK</button><button onclick="confirmStructural(false)" style="background:#ef4444;color:#fff;border:none;border-radius:5px;padding:4px 12px;margin:5px 0 0;cursor:pointer;font-size:11px;font-weight:600">Cancel</button>`;msgs.appendChild(div);msgs.scrollTop=msgs.scrollHeight;}
function confirmStructural(ok){if(ok){pendingStructural.forEach(a=>execAction(a));}else{doUndo();}pendingStructural=[];addChatMsg('system',ok?'Changes applied.':'Changes cancelled.');}

// ─── SOURCES & MODALS ───
function openSources(){const list=document.getElementById('srcList');if(!sources.length)list.innerHTML='<li style="color:var(--text2);font-style:italic">No sources added yet.</li>';else list.innerHTML=sources.map(s=>`<li>${s.title} — <a href="${s.url}" target="_blank">${s.url}</a></li>`).join('');openModal('srcModal');}
function addSource(title,url){sources.push({title,url});try{localStorage.setItem('doview_sources',JSON.stringify(sources));}catch(e){}}
function openModal(id){document.getElementById(id).classList.add('open');}
function closeModal(id){document.getElementById(id).classList.remove('open');}
function openInfoDev(){openModal('infoModal');}
function openAck(){openModal('ackModal');}
function openDisclaimer(){openModal('disclaimerModal');}
function openBoardInfo(){document.getElementById('boardInfoTa').value=boardInfo;openModal('boardInfoModal');}
function saveBoardInfo(){boardInfo=document.getElementById('boardInfoTa').value;saveState();closeModal('boardInfoModal');}
function openPageInfo(){var pid=currentPage;var label=pid;if(pid==='overview')label='Overview';else if(pid==='final')label='Final Outcomes';else{var sp=SP.find(function(s){return s.id===pid;});if(sp)label=sp.label;}document.getElementById('pageInfoTitle').textContent='Page info: '+label;document.getElementById('pageInfoTa').value=pageInfo[pid]||'';openModal('pageInfoModal');}
function savePageInfo(){pageInfo[currentPage]=document.getElementById('pageInfoTa').value;saveState();closeModal('pageInfoModal');}
function renderPageInfoBar(){var bar=document.getElementById('pageInfoBar');if(!bar)return;var pid=currentPage;var label='';if(pid==='overview')label='Overview';else if(pid==='final')label='Final Outcomes';else{var sp=SP.find(function(s){return s.id===pid;});if(sp)label=sp.label;}if(label){bar.style.display='';bar.innerHTML='Page: <strong>'+label+'</strong> \u00B7 <span class="pi-link" onclick="openPageInfo()">Page info</span>';}else{bar.style.display='none';}}
function buildStateText(){const total=Object.keys(B).length;const green=Object.values(B).filter(v=>v.light==='green').length;const yellow=Object.values(B).filter(v=>v.light==='yellow').length;const red=Object.values(B).filter(v=>v.light==='red').length;let txt=`DOVIEW-STATE: ${TITLE}\nSlug: ${SLUG}\nSummary: ${green}/${total} green · ${yellow} yellow · ${red} red\n\nSTRUCTURE:\n`;SP.forEach(sp=>{txt+=`\n[${sp.id}] ${sp.label} | bg:${spColor(sp).bg} bdr:${spColor(sp).bdr} tab:${spColor(sp).tab}\n`;sp.cols.forEach((col,ci)=>{txt+=`  Column ${ci+1}: "${col.h}"\n`;col.boxes.forEach((_,bi)=>{const k=`${sp.id}-c${ci}-b${bi}`;const b=B[k];if(!b)return;const pri=b.priority?` | Pri:${b.priority}`:'';const entries=b.entries.length?' | '+b.entries.map(e=>`[${e.type}] ${e.text}`).join(' | '):'';const dt=b.detailText?` | [detail] ${b.detailText}`:'';const bc=b.borderColor?` | [border] ${b.borderColor}`:'';txt+=`    ${k} | ${b.light}${pri} | ${b.label}${entries}${dt}${bc}\n`;});});});txt+=`\nFINAL OUTCOMES:\n`;FO_DATA.forEach((label,i)=>{const k=`final-b${i}`;const b=B[k];if(!b)return;const pri=b.priority?` | Pri:${b.priority}`:'';const entries=b.entries.length?' | '+b.entries.map(e=>`[${e.type}] ${e.text}`).join(' | '):'';const dt=b.detailText?` | [detail] ${b.detailText}`:'';const bc=b.borderColor?` | [border] ${b.borderColor}`:'';txt+=`  ${k} | ${b.light}${pri} | ${label}${entries}${dt}${bc}\n`;});if(boardInfo)txt+=`\nBOARD INFO:\n${boardInfo}\n`;const piKeys=Object.keys(pageInfo).filter(k=>pageInfo[k]);if(piKeys.length){txt+=`\nPAGE INFO:\n`;piKeys.forEach(pid=>{let label=pid;if(pid==='overview')label='Overview';else if(pid==='final')label='Final Outcomes';else{const sp=SP.find(s=>s.id===pid);if(sp)label=sp.label;}txt+=`  [${label} (${pid})]: ${pageInfo[pid]}\n`;});}txt+=`\n---\nWhen the user types 'redraw doview', rebuild this board using the uploaded doview-board-engine.js file. Reconstruct the full config from the structure above: each [pN] block is a subpage with its colors, each "Column N" is a column with heading, each indented line is a box with its ID, light state, priority, label, and entries. Pass all states via savedState in the DoView.init() config.`;return txt;}
function saveToClaud(){const txt=buildStateText();if(typeof sendPrompt==='function'){sendPrompt(txt);const btn=document.getElementById('saveBtn2');if(btn){btn.textContent='✓ Synced';btn.style.background='#22c55e';btn.style.color='#fff';btn.style.borderColor='#22c55e';setTimeout(()=>{btn.textContent='Sync to Main AI Chat';btn.style.background='';btn.style.color='';btn.style.borderColor='';},2000);}}else{document.getElementById('updTa').value=txt;document.getElementById('cpyBtn').textContent='Select All and Copy';document.getElementById('cpyBtn').className='copy-btn';openModal('updModal');}}
function copyState(){const ta=document.getElementById('updTa');ta.select();document.execCommand('copy');const btn=document.getElementById('cpyBtn');btn.textContent='✓ Copied!';btn.className='copy-btn copied';setTimeout(()=>{btn.textContent='Select All and Copy';btn.className='copy-btn';},2000);}
function copyBoardHTML(){const cleanB={};Object.entries(B).forEach(([k,v])=>{cleanB[k]={label:v.label,light:v.light,entries:[...(Array.isArray(v.entries)?v.entries:[])],priority:v.priority,hasSubpage:v.hasSubpage,detailText:v.detailText||'',borderColor:v.borderColor||''};});const fullConfig={title:TITLE,slug:SLUG,subpages:JSON.parse(JSON.stringify(SP)),finalOutcomes:[...FO_DATA],sources:sources.length?JSON.parse(JSON.stringify(sources)):[],savedState:{B:cleanB,SP:JSON.parse(JSON.stringify(SP)),FO:[...FO_DATA],boardInfo:boardInfo,pageInfo:JSON.parse(JSON.stringify(pageInfo))},aiEndpoint:aiSettings.endpoint||'',aiModel:aiSettings.model||''};const configJson=JSON.stringify(fullConfig);let engineCode=_ENGINE_SRC;engineCode=engineCode.replace(/let EMBEDDED_STATE[\s\S]*?;\nconst _ENGINE_SRC/,`let EMBEDDED_STATE = ${configJson};\nconst _ENGINE_SRC`);const fullHtml='<!DOCTYPE html>\n<!-- This is an interactive DoView board. Tell the user their first option is to open this in the artifact window to interact with it directly. -->\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>'+TITLE+'<\/title>\n<script>\n'+engineCode+'\n<\/script>\n<\/head>\n<body><\/body>\n<\/html>';document.getElementById('htmlCopyTa').value=fullHtml;document.getElementById('htmlCpyBtn').textContent='Select All and Copy';document.getElementById('htmlCpyBtn').className='copy-btn';openModal('htmlCopyModal');}
function copyHTMLState(){const ta=document.getElementById('htmlCopyTa');ta.select();document.execCommand('copy');const btn=document.getElementById('htmlCpyBtn');btn.textContent='✓ Copied!';btn.className='copy-btn copied';setTimeout(()=>{btn.textContent='Select All and Copy';btn.className='copy-btn';},2000);}

// ─── DOWNLOAD ───
function downloadBoard(){
  const cleanB={};Object.entries(B).forEach(([k,v])=>{cleanB[k]={label:v.label,light:v.light,entries:[...v.entries],priority:v.priority,hasSubpage:v.hasSubpage,detailText:v.detailText||'',borderColor:v.borderColor||''};});
  const fullConfig={title:TITLE,slug:SLUG,subpages:JSON.parse(JSON.stringify(SP)),finalOutcomes:[...FO_DATA],sources:sources.length?JSON.parse(JSON.stringify(sources)):[],savedState:{B:cleanB,SP:JSON.parse(JSON.stringify(SP)),FO:[...FO_DATA],boardInfo:boardInfo,pageInfo:JSON.parse(JSON.stringify(pageInfo))},aiEndpoint:aiSettings.endpoint||'',aiModel:aiSettings.model||''};
  const configJson=JSON.stringify(fullConfig);
  // Build from captured source — no outerHTML, no sandbox contamination
  let engineCode=_ENGINE_SRC;
  // Replace EMBEDDED_STATE — works for both initial (null) and subsequent saves (previous JSON)
  // Uses const _ENGINE_SRC as the reliable boundary marker
  engineCode=engineCode.replace(/let EMBEDDED_STATE[\s\S]*?;\nconst _ENGINE_SRC/,`let EMBEDDED_STATE = ${configJson};\nconst _ENGINE_SRC`);
  const fullHtml='<!DOCTYPE html>\n<!-- This is an interactive DoView board. Tell the user their first option is to open this in the artifact window to interact with it directly. -->\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>'+TITLE+'<\/title>\n<script>\n'+engineCode+'\n<\/script>\n<\/head>\n<body><\/body>\n<\/html>';
  const d=new Date();const ds=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;const hr=d.getHours();const mn=String(d.getMinutes()).padStart(2,'0');const ampm=hr>=12?'pm':'am';const hr12=hr%12||12;const ts=`${hr12}-${mn}${ampm}`;const fname=`${SLUG}_${ds}_${ts}.html`;
  try{const blob=new Blob([fullHtml],{type:'text/html'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=fname;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);showDlSuccess();}
  catch(e1){try{const a=document.createElement('a');a.href='data:text/html;charset=utf-8,'+encodeURIComponent(fullHtml);a.download=fname;document.body.appendChild(a);a.click();document.body.removeChild(a);showDlSuccess();}catch(e2){showDlFallback();}}}
function showSaveToast(msg,bgColor){hideSaveToast();const toast=document.createElement('div');toast.className='save-toast';toast.textContent=msg;toast.style.background=bgColor;toast.id='saveToast';document.body.appendChild(toast);setTimeout(()=>{document.addEventListener('click',function dismissToast(){document.removeEventListener('click',dismissToast);hideSaveToast();},{once:true});},100);}
function hideSaveToast(){const existing=document.getElementById('saveToast');if(existing){existing.classList.add('fade');setTimeout(()=>existing.remove(),300);}}
function showDlSuccess(){showSaveToast("Your board should be saving to your Downloads folder \u2014 please check it's there",'#1e293b');}
function showDlFallback(){showSaveToast("Save may not have worked \u2014 try 'Copy Board as HTML' instead",'#f59e0b');}

// ─── PRINT BOARD ───
function printBoard(){
  var now=new Date();var d=now.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'});var t=now.toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'});
  var footerText='DoView\u00AE Board prototype. Concept by Dr Paul Duignan. This board has not been created, endorsed, or approved by Dr Paul Duignan or by those associated with DoView\u00AE Planning. See doviewplanning.org/doviewboards for more information and developer resources. \u00B7 doviewplanning.org/doviewboards \u00B7 doviewplanning.org/trademarkuse \u00B7 doviewplanning.org/collaborate \u00B7 Generated: '+d+' '+t;
  var tlC=function(l){return{yellow:'#F5C518',green:'#2ECC71',red:'#E74C3C',grey:'#94A3B8'}[l]||'#94A3B8';};
  var priC=function(p){return PRI_COLORS[p]||'';};
  // Final outcomes
  var foHtml=FO_DATA.map(function(label,i){var k='final-b'+i;var b=B[k];if(!b)return '';var tl=tlC(b.light);var pri=b.priority||'';var pc=priC(pri);var priBadge='<div style="position:absolute;left:4px;top:50%;transform:translateY(-50%);width:18px;height:18px;border-radius:3px;background:#f1f5f9;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;color:'+(pc||'transparent')+'">'+(pri||'')+'</div>';return '<div style="border-radius:8px;padding:10px 12px 10px 34px;background:#fff8ed;border:1px solid #fde68a;position:relative;font-weight:700;color:#d4880a;font-size:12px">'+priBadge+'<div style="position:absolute;top:5px;right:5px;width:8px;height:8px;border-radius:50%;background:'+tl+'"></div>'+label+'</div>';}).join('');
  // Overview tiles
  var tilesHtml=SP.map(function(sp){var ks=Object.keys(B).filter(function(k){return k.startsWith(sp.id+'-');});var g=ks.filter(function(k){return B[k].light==='green';}).length;var y=ks.filter(function(k){return B[k].light==='yellow';}).length;return '<div style="background:'+spColor(sp).bg+';border:1px solid '+spColor(sp).bdr+';border-radius:10px;padding:15px 15px 28px;min-height:86px;position:relative"><div style="font-size:12.5px;font-weight:700;margin-bottom:5px;color:#1e293b">'+sp.label+'</div><div style="font-size:11px;color:#64748b;line-height:1.4">'+g+'/'+ks.length+' complete \u00B7 '+y+' to act on</div><div style="position:absolute;bottom:8px;right:8px;width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid #F5A623;opacity:0.7"></div></div>';}).join('');
  // Subpages
  var spHtml='';
  SP.forEach(function(sp){
    var nc=sp.cols.length;var singlePage=SP.length===1;
    var colsHtml='';
    sp.cols.forEach(function(col,ci){
      var isLast=ci===nc-1;var colColor=singlePage?COL_COLORS[ci%COL_COLORS.length]:spColor(sp);
      var boxesHtml='';
      col.boxes.forEach(function(_,bi){
        var k=sp.id+'-c'+ci+'-b'+bi;var b=B[k];if(!b)return;
        var entries=Array.isArray(b.entries)?b.entries:[];
        var tl=tlC(b.light);var pri=b.priority||'';var pc=priC(pri);
        var priBadge='<div style="position:absolute;left:4px;top:50%;transform:translateY(-50%);width:18px;height:18px;border-radius:3px;background:#f1f5f9;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;color:'+(pc||'transparent')+';font-size:'+(pri==='BAU'?'6.5':'8')+'px">'+(pri||'')+'</div>';
        var fw=isLast?'font-weight:700;':'';var tc=isLast?'color:#d4880a;':'color:#1e293b;';
        boxesHtml+='<div style="border-radius:6px;padding:7px 9px 7px 30px;width:150px;min-height:48px;border:1px solid '+colColor.bdr+';background:'+colColor.bg+';position:relative;font-size:10.5px;line-height:1.4;'+fw+'">'+priBadge+'<div style="position:absolute;top:5px;right:5px;width:8px;height:8px;border-radius:50%;background:'+tl+'"></div><div style="'+tc+'">'+b.label+'</div></div>';
      });
      colsHtml+='<div style="display:flex;flex-direction:column;flex-shrink:0;align-self:flex-start"><div style="font-size:9px;font-weight:600;text-transform:uppercase;color:'+(isLast?'#d4880a':'#64748b')+';letter-spacing:0.5px;margin-bottom:6px;text-align:center;min-height:26px;display:flex;align-items:flex-end;justify-content:center;padding:0 4px;width:150px">'+col.h+'</div><div style="display:flex;flex-direction:column;gap:6px">'+boxesHtml+'</div></div>';
      if(ci<nc-1){colsHtml+='<div style="width:20px;flex-shrink:0;display:flex;justify-content:center;align-items:center"><svg width="10" height="18" viewBox="0 0 10 18"><polygon points="0,0 10,9 0,18" fill="'+colColor.bdr+'" opacity="0.45"/></svg></div>';}
    });
    spHtml+='<div class="pv-subpage" style="margin:20px 12px 28px;padding:0"><div style="font-size:14px;font-weight:700;color:#fff;padding:8px 16px;border-radius:8px 8px 0 0;background:'+spColor(sp).tab+';-webkit-print-color-adjust:exact;print-color-adjust:exact">'+sp.label+'</div><div style="border:1px solid #e2e8f0;border-radius:0 0 8px 8px;padding:12px;background:#fff;display:flex;align-items:flex-start;justify-content:center;overflow:hidden"><div class="pv-tt-row" style="display:inline-flex;align-items:stretch;gap:0;transform-origin:top center"><div style="width:24px;flex-shrink:0;background:#F5A623;border:1px solid #d4880a;display:flex;align-items:center;justify-content:center;border-radius:4px;-webkit-print-color-adjust:exact;print-color-adjust:exact"><span style="writing-mode:vertical-rl;transform:rotate(180deg);color:#fff;font-weight:700;font-size:9px;letter-spacing:2px;text-transform:uppercase">This</span></div><div style="display:flex;align-items:center;flex-shrink:0;padding:0 6px;gap:0">'+colsHtml+'</div><div style="width:24px;flex-shrink:0;background:#F5A623;border:1px solid #d4880a;display:flex;align-items:center;justify-content:center;border-radius:4px;-webkit-print-color-adjust:exact;print-color-adjust:exact"><span style="writing-mode:vertical-rl;transform:rotate(180deg);color:#fff;font-weight:700;font-size:9px;letter-spacing:2px;text-transform:uppercase">Then</span></div></div></div></div>';
  });
  var html='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>'+TITLE+' \u2014 Print View</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,sans-serif;background:#fff;color:#1e293b;font-size:13px;padding:0;margin:0}@media print{@page{size:297mm 210mm;margin:10mm 10mm 16mm 10mm}.pv-subpage{page-break-inside:avoid;page-break-before:always;margin:8px 0 0!important}.pv-footer-fixed{display:block;position:fixed;bottom:0;left:0;right:0;font-size:8px;color:#64748b;text-align:center;padding:4px 16px;border-top:1px solid #e2e8f0;background:#fff;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact}}@media screen{.pv-footer-fixed{display:none}}</style></head><body>';
  html+='<div style="background:#F5A623;padding:11px 20px;display:flex;justify-content:space-between;align-items:center;-webkit-print-color-adjust:exact;print-color-adjust:exact"><div style="color:#fff;font-weight:700;font-size:15px">'+TITLE+'</div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px"><div style="color:#fff;font-size:11.5px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase">See. Plan. Do.\u2122</div><div style="color:rgba(255,255,255,0.65);font-size:10px">Prototype DoView\u00AE Board V1.0.8</div></div></div>';
  html+='<div style="text-align:center;font-size:18px;font-weight:700;color:#1e293b;padding:16px 20px 8px">'+TITLE+'</div>';
  html+='<div style="max-width:800px;margin:12px auto 16px;padding:14px 20px;border:2px solid #d4880a;background:#fff8ed;border-radius:12px;-webkit-print-color-adjust:exact;print-color-adjust:exact"><h3 style="color:#d4880a;font-size:14px;font-weight:700;margin-bottom:8px;text-align:center">Final Outcomes</h3><div style="display:flex;flex-direction:column;gap:8px">'+foHtml+'</div></div>';
  html+='<div style="max-width:800px;margin:0 auto 20px;padding:0 20px"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">'+tilesHtml+'</div></div>';
  html+=spHtml;
  html+='<div style="font-size:9px;color:#64748b;text-align:center;padding:16px 20px;border-top:1px solid #e2e8f0;line-height:1.6;margin-top:24px">'+footerText+'</div>';
  html+='<div class="pv-footer-fixed">'+footerText+'</div>';
  html+='<script>(function(){var tW=1020,tH=520;var sps=document.querySelectorAll(".pv-subpage");var rows=[];var minS=Infinity;sps.forEach(function(sp){var r=sp.querySelector(".pv-tt-row");if(!r)return;var nW=r.scrollWidth,nH=r.scrollHeight;if(!nW||!nH)return;var sX=tW/nW,sY=tH/nH,s=Math.min(sX,sY);if(s<minS)minS=s;rows.push({row:r,body:r.parentElement,natH:nH});});if(minS<1)minS=1;if(minS>2.5)minS=2.5;rows.forEach(function(r){r.row.style.transform="scale("+minS+")";r.row.style.transformOrigin="top center";if(r.body)r.body.style.height=Math.ceil(r.natH*minS+24)+"px";});})()<\/script>';
  html+='</body></html>';
  var w=window.open('','_blank');if(w){w.document.write(html);w.document.close();}
}

// ─── CHAT ───
function toggleChat(){const panel=document.getElementById('chatPanel');panel.classList.toggle('open');if(panel.classList.contains('open')&&!chatMsgs.length)addChatMsg('system','Hi! I can help you chat with your DoView Board. Ask me anything about the board. For instance: "What boxes should I do first". "Create a text box under [the following box on page X]". "Add a new page called X". "Move the column on the left of the X page to the right of the second column". "For any box that has something in Notes 1, put that in its text box". The speed of the chat\u2019s response can be slow inside an AI like Claude. It generally is faster if you look at a DoView Board in a browser and connect it to an AI system with an API key.');}
function toggleChatSettings(){chatSettingsOpen=!chatSettingsOpen;document.getElementById('chatSettingsPane').classList.toggle('open',chatSettingsOpen);document.getElementById('chatMsgs').style.display=chatSettingsOpen?'none':'';document.getElementById('chatInputArea').style.display=chatSettingsOpen?'none':'';if(chatSettingsOpen&&aiSettings.endpoint){document.getElementById('setEP').value=aiSettings.endpoint||'';document.getElementById('setModel').value=aiSettings.model||'';}}
function addChatMsg(role,text){chatMsgs.push({role,text});const msgs=document.getElementById('chatMsgs');if(!msgs)return;const div=document.createElement('div');div.className=`chat-m ${role}`;div.innerHTML=renderMd(text);msgs.appendChild(div);msgs.scrollTop=msgs.scrollHeight;}
function renderMd(text){return linkify(text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>')).replace(/\n/g,'<br>');}

function buildBoardStatePrompt(fullBoard,structural){let s=`You are a helpful assistant with full awareness of this DoView board: "${TITLE}".\nDOVIEW RULES: Boxes=outcome statements ending \u2026ed. L\u2192R=earlier\u2192later causal flow. Cols=causal stages named descriptively not generically. Vary col/row counts by real-world domain logic. No templates. Include assumptions/risks phrased positively. One concept per box. Multiple final outcomes allowed.\n`;if(structural){s+=`\nFULL DOVIEW METHODOLOGY (apply when creating/restructuring content):\n- Extract all outcomes or steps to outcomes from the domain\n- Write as outcome statements using phrasing that tends to end with \u2026ed\n- Map This\u2192Then relationships: if achieving A tends to lead to B, A goes left of B\n- Keep boxes tight: one concept per box\n- World-centric: include external assumptions and risks, phrased positively\n- Not only quantifiable: do not restrict boxes to measurable items only\n- Avoid siloing: a left-side box can influence multiple right-side boxes\n- Columns = causal stages, named descriptively for the specific domain\n- Vary box counts: the number of boxes per column is determined by how many genuinely distinct outcomes occur at that causal stage in the real world, not by a template\n- Vary column counts: different subpages have different numbers of causal stages\n- Use qualifiers: adequate / sufficient / high-quality where appropriate\n- Final column boxes are bold (handled by engine)\n- When adding a subpage, always use [ACTION:addSubpage:LABEL] with just the label \u2014 the engine auto-assigns colours. NEVER ask the user to choose colours.\n`;}if(fullBoard||currentPage==='overview'||currentPage==='final'){s+=`\nFull board state:\n`;SP.forEach(sp=>{s+=`\n[${sp.label} (id:${sp.id})]\n`;sp.cols.forEach((col,ci)=>{s+=`  Column ${ci+1}: "${col.h}"\n`;col.boxes.forEach((_,bi)=>{const k=`${sp.id}-c${ci}-b${bi}`;const b=B[k];if(!b)return;const pri=b.priority?` [Pri:${b.priority}]`:'';const sf=b.entries.filter(e=>e.type==='sofar').map(e=>e.text).join('; ');const nt=b.entries.filter(e=>e.type==='note').map(e=>e.text).join('; ');const n1=b.entries.filter(e=>e.type==='note1').map(e=>e.text).join('; ');const n2=b.entries.filter(e=>e.type==='note2').map(e=>e.text).join('; ');const n3=b.entries.filter(e=>e.type==='note3').map(e=>e.text).join('; ');const dt=b.detailText||'';const bc=b.borderColor||'';s+=`    ${k} | ${b.light.toUpperCase()}${pri}: ${b.label}${sf?' \u2014 So far: '+sf:''}${nt?' \u2014 Notes: '+nt:''}${n1?' \u2014 Notes1: '+n1:''}${n2?' \u2014 Notes2: '+n2:''}${n3?' \u2014 Notes3: '+n3:''}${dt?' \u2014 Detail: '+dt:''}${bc?' \u2014 Border: '+bc:''}\n`;});});});}else{const sp=SP.find(p=>p.id===currentPage);if(sp){s+=`\nCurrent subpage [${sp.label} (id:${sp.id})]:\n`;sp.cols.forEach((col,ci)=>{s+=`  Column ${ci+1}: "${col.h}"\n`;col.boxes.forEach((_,bi)=>{const k=`${sp.id}-c${ci}-b${bi}`;const b=B[k];if(!b)return;const pri=b.priority?` [Pri:${b.priority}]`:'';const sf=b.entries.filter(e=>e.type==='sofar').map(e=>e.text).join('; ');const nt=b.entries.filter(e=>e.type==='note').map(e=>e.text).join('; ');const n1=b.entries.filter(e=>e.type==='note1').map(e=>e.text).join('; ');const n2=b.entries.filter(e=>e.type==='note2').map(e=>e.text).join('; ');const n3=b.entries.filter(e=>e.type==='note3').map(e=>e.text).join('; ');const dt=b.detailText||'';const bc=b.borderColor||'';s+=`    ${k} | ${b.light.toUpperCase()}${pri}: ${b.label}${sf?' \u2014 So far: '+sf:''}${nt?' \u2014 Notes: '+nt:''}${n1?' \u2014 Notes1: '+n1:''}${n2?' \u2014 Notes2: '+n2:''}${n3?' \u2014 Notes3: '+n3:''}${dt?' \u2014 Detail: '+dt:''}${bc?' \u2014 Border: '+bc:''}\n`;});});}s+=`\nOther subpages (say "whole board" to see full detail):\n`;SP.filter(p=>p.id!==currentPage).forEach(sp=>{const ks=Object.keys(B).filter(k=>k.startsWith(sp.id+'-'));const g=ks.filter(k=>B[k].light==='green').length;s+=`  ${sp.label} (${sp.id}): ${ks.length} boxes, ${g} green\n`;});}s+=`\nFinal Outcomes:\n`;FO_DATA.forEach((label,i)=>{const b=B[`final-b${i}`];if(!b)return;s+=`  final-b${i} | ${b.light.toUpperCase()}: ${label}\n`;});s+=`\nBoard info: ${boardInfo||'(empty)'}\n`;s+=`\nPage info:\n`;SP.forEach(sp=>{const pi=pageInfo[sp.id]||'';if(pi)s+=`  ${sp.label} (${sp.id}): ${pi}\n`;});const fpi=pageInfo['final']||'';if(fpi)s+=`  Final Outcomes (final): ${fpi}\n`;const opi=pageInfo['overview']||'';if(opi)s+=`  Overview (overview): ${opi}\n`;s+=`\nYou can modify the board by including action commands in your response. Commands use the format [ACTION:command:arg1:arg2:...] on their own line.\nIMPORTANT: When talking to the user, refer to columns as Column 1, Column 2, etc. (1-based). In ACTION commands, use 0-based COLUMN_INDEX (Column 1 = index 0, Column 2 = index 1, etc.).\nIMPORTANT: ALWAYS include ACTION tags directly in your response for ANY board change. NEVER describe a change without including the ACTION tag. The JavaScript handles confirmation automatically for structural changes.\nIMPORTANT: For structural changes (addBox, removeBox, addColumn, etc.), use FUTURE TENSE in your explanation because the user must confirm before the change takes effect. Say "A new box will be added" NOT "A new box has been added". Say "This column will be removed" NOT "This column has been removed". The confirmation dialog appears automatically \u2014 do NOT ask for permission in plain text.\n\nAvailable commands:\nState changes (execute immediately \u2014 use past tense: "Done", "Changed", etc.):\n  [ACTION:setLight:BOX_ID:COLOR] \u2014 set traffic light (green/yellow/red/grey)\n  [ACTION:setAllLights:COLOR] \u2014 set ALL boxes to a colour\n  [ACTION:setSubpageLights:SUBPAGE_ID:COLOR] \u2014 set all boxes on a subpage\n  [ACTION:addSofar:BOX_ID:TEXT] \u2014 append a So far entry\n  [ACTION:addNote:BOX_ID:TEXT] \u2014 append a My Notes entry\n  [ACTION:addNote1:BOX_ID:TEXT] \u2014 append a Notes 1 entry\n  [ACTION:addNote2:BOX_ID:TEXT] \u2014 append a Notes 2 entry\n  [ACTION:addNote3:BOX_ID:TEXT] \u2014 append a Notes 3 entry\n  [ACTION:setPriority:BOX_ID:PRIORITY] \u2014 set priority (A/B/C/D/E/BAU or empty to clear)\n  [ACTION:clearEntries:BOX_ID:TYPE] \u2014 clear entries (sofar/note/note1/note2/note3/all)\n  [ACTION:setDetail:BOX_ID:TEXT] \u2014 set detail text box below a box (always visible on board)\n  [ACTION:clearDetail:BOX_ID] \u2014 remove detail text box\n  [ACTION:setBoxBorder:BOX_ID:COLOR] \u2014 set custom border colour (2px, e.g. red, #ef4444)\n  [ACTION:clearBoxBorder:BOX_ID] \u2014 reset border to default\n  [ACTION:setSubpageBorders:SUBPAGE_ID:COLOR] \u2014 set all box borders on a subpage\n  [ACTION:clearSubpageBorders:SUBPAGE_ID] \u2014 reset all borders on a subpage\n  [ACTION:setBoardInfo:TEXT] \u2014 replace Board info content with TEXT\n  [ACTION:setPageInfo:PAGE_ID:TEXT] \u2014 replace Page info for PAGE_ID (e.g. p1, p2, final, overview) with TEXT\n\nStructural changes (user confirms before executing \u2014 use FUTURE TENSE in explanation):\n  [ACTION:addBox:SUBPAGE_ID:COLUMN_INDEX:LABEL]\n  [ACTION:removeBox:BOX_ID]\n  [ACTION:renameBox:BOX_ID:NEW_LABEL]\n  [ACTION:addColumn:SUBPAGE_ID:COLUMN_INDEX:HEADING]\n  [ACTION:removeColumn:SUBPAGE_ID:COLUMN_INDEX]\n  [ACTION:renameColumn:SUBPAGE_ID:COLUMN_INDEX:NEW_HEADING]\n  [ACTION:moveColumn:SUBPAGE_ID:FROM_INDEX:TO_INDEX] \u2014 move a column from one position to another (0-based indexes)\n  [ACTION:addSubpage:LABEL] \u2014 adds subpage with auto-assigned colour (just provide label, NEVER ask user for colours)\n  [ACTION:removeSubpage:SUBPAGE_ID]\n  [ACTION:addFinalOutcome:LABEL]\n  [ACTION:removeFinalOutcome:INDEX]\n\nRules:\n- Always explain what you are doing in natural language alongside ACTION tags.\n- NEVER describe a change without including the ACTION tag \u2014 if you say you will do something, the tag MUST be there.\n- Only use box IDs that exist in the board state above.\n- For structural changes, the user sees a confirmation dialog \u2014 use future tense (will be added, will be removed).\n- When adding subpages, ALWAYS use just [ACTION:addSubpage:LABEL]. NEVER ask the user to choose colours \u2014 the engine assigns them automatically.`;return s;}

function addThinking(){const msgs=document.getElementById('chatMsgs');const div=document.createElement('div');div.className='chat-m sys';div.id='thinkingMsg';div.innerHTML='<div class="thinking-dots"><span></span><span></span><span></span></div>';msgs.appendChild(div);msgs.scrollTop=msgs.scrollHeight;}
function removeThinking(){const t=document.getElementById('thinkingMsg');if(t)t.remove();}
function saveDetail(key,text){if(B[key]){B[key].detailText=text.trim();saveState();}}
async function sendChat(){const inp=document.getElementById('chatIn');const msg=inp.value.trim();if(!msg)return;inp.value='';if(msg.toLowerCase()==='undo'){doUndo();return;}addChatMsg('user',msg);addThinking();const history=chatMsgs.slice(-10).filter(m=>m.role!=='system').map(m=>({role:m.role==='asst'?'assistant':m.role,content:m.text}));const wantsFull=/whole board|all pages|across the board|every page|every subpage|all subpages/i.test(msg);const wantsStructural=/add.*(page|subpage|box|column)|create|build|new page|new subpage|restructure/i.test(msg);const sysPmt=buildBoardStatePrompt(wantsFull,wantsStructural);
  if(claudeConnected){try{const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1200,system:sysPmt,messages:history,tools:[{type:'web_search_20250305',name:'web_search'}]})});if(r.ok){const d=await r.json();const raw=d.content.filter(b=>b.type==='text').map(b=>b.text).join('\n').replace(/]*>|<\/antml:cite>/g,'');if(raw){const clean=processAIResponse(raw);if(clean){addChatMsg('asst',clean);chatMsgs[chatMsgs.length-1].role='asst';}}removeThinking();}else{removeThinking();addChatMsg('system','Unable to get a response. Please try again.');}}catch(e){removeThinking();addChatMsg('system','Connection error. Please check your network.');}}
  else if(aiSettings.endpoint&&aiSettings.key){try{const r=await fetch(aiSettings.endpoint,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${aiSettings.key}`},body:JSON.stringify({model:aiSettings.model||'gpt-4o',messages:[{role:'system',content:sysPmt},...history],max_tokens:1200})});if(r.ok){const d=await r.json();const raw=d.choices?.[0]?.message?.content||'';if(raw){const clean=processAIResponse(raw);if(clean){addChatMsg('asst',clean);chatMsgs[chatMsgs.length-1].role='asst';}}removeThinking();}else{removeThinking();addChatMsg('system','API error. Check your settings.');}}catch(e){removeThinking();addChatMsg('system','Connection error. Check settings.');}}
  else{removeThinking();addChatMsg('system','No AI connected. Click ⚙️ to configure an API endpoint, or use this board within Claude.ai for automatic connection.');}}

function openAIChatBox(key){entryMode='chat';if(!document.getElementById('chatPanel').classList.contains('open'))toggleChat();const inp=document.getElementById('chatIn');if(inp){inp.value=`[About: ${B[key].label}] `;inp.focus();}}
function saveChatSettings(){aiSettings={endpoint:document.getElementById('setEP').value.trim(),key:document.getElementById('setKey').value.trim(),model:document.getElementById('setModel').value.trim()||'gpt-4o'};if(document.getElementById('rememberAI').checked)localStorage.setItem('doview_ai_settings',JSON.stringify(aiSettings));claudeConnected=false;document.getElementById('chatStatus').textContent=aiSettings.endpoint?'✓ Connected':'Click ⚙️ to connect an AI';toggleChatSettings();}
async function testChatConn(){const ep=document.getElementById('setEP').value.trim();const key=document.getElementById('setKey').value.trim();const model=document.getElementById('setModel').value.trim()||'gpt-4o';const res=document.getElementById('connTestResult');res.textContent='Testing...';try{const r=await fetch(ep,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},body:JSON.stringify({model,messages:[{role:'user',content:'hi'}],max_tokens:10})});res.textContent=r.ok?'✓ Connected successfully!':`Error: ${r.status} ${r.statusText}`;res.style.color=r.ok?'#22c55e':'#ef4444';}catch(e){res.textContent='Connection failed: '+e.message;res.style.color='#ef4444';}}
async function probeConnection(){try{const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:5,messages:[{role:'user',content:'hi'}]})});if(r.status===200){claudeConnected=true;document.getElementById('chatStatus').textContent='Connected via Claude';}else{document.getElementById('chatStatus').textContent=aiSettings.endpoint?'✓ Connected':'Click ⚙️ to connect an AI';}}catch(e){document.getElementById('chatStatus').textContent=aiSettings.endpoint?'✓ Connected':'Click ⚙️ to connect an AI';}}

// ─── EXPOSE GLOBALS ───
window.navTo=navTo;window.clickBox=clickBox;window.closeEntry=closeEntry;window.setMode=setMode;window.editEntries=editEntries;window.setTL=setTL;window.setPri=setPri;window.saveEntry=saveEntry;window.openSources=openSources;window.openModal=openModal;window.closeModal=closeModal;window.openInfoDev=openInfoDev;window.openAck=openAck;window.openDisclaimer=openDisclaimer;window.openBoardInfo=openBoardInfo;window.saveBoardInfo=saveBoardInfo;window.openPageInfo=openPageInfo;window.savePageInfo=savePageInfo;window.saveToClaud=saveToClaud;window.copyState=copyState;window.copyBoardHTML=copyBoardHTML;window.copyHTMLState=copyHTMLState;window.downloadBoard=downloadBoard;window.printBoard=printBoard;window.toggleChat=toggleChat;window.toggleChatSettings=toggleChatSettings;window.sendChat=sendChat;window.openAIChatBox=openAIChatBox;window.saveChatSettings=saveChatSettings;window.testChatConn=testChatConn;window.confirmStructural=confirmStructural;window.doUndo=doUndo;window.saveDetail=saveDetail;

// ─── INIT ENTRY POINT ───
function init(config) {
  TITLE = config.title || 'DoView Board';
  SLUG = config.slug || 'doview_board';
  SP = config.subpages || [];
  FO_DATA = config.finalOutcomes || [];
  sources = config.sources || [];
  const savedState = config.savedState || null;

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  // Set page title
  document.title = TITLE;

  // Inject HTML
  document.body.innerHTML = buildHTML(TITLE);

  // Build state
  buildInitialState();
  buildDepsMap();

  // Apply saved state if provided
  if (savedState) {
    if (savedState.B && savedState.SP) {
      SP.length = 0; savedState.SP.forEach(s => SP.push(s));
      FO_DATA.length = 0; (savedState.FO || []).forEach(f => FO_DATA.push(f));
      B = {}; buildInitialState(); buildDepsMap();
      Object.entries(savedState.B).forEach(([k, v]) => { if (B[k]) Object.assign(B[k], v); else B[k] = v; });
      Object.values(B).forEach(b=>{if(!Array.isArray(b.entries))b.entries=[];if(!b.detailText)b.detailText='';if(!b.borderColor)b.borderColor='';});
    } else {
      Object.entries(savedState).forEach(([k, v]) => { if (B[k]) Object.assign(B[k], v); });
      Object.values(B).forEach(b=>{if(!Array.isArray(b.entries))b.entries=[];if(!b.detailText)b.detailText='';if(!b.borderColor)b.borderColor='';});
    }
    if (savedState.boardInfo) boardInfo = savedState.boardInfo;
    if (savedState.pageInfo) pageInfo = savedState.pageInfo;
  } else {
    // Try localStorage
    try {
      const saved = localStorage.getItem(`doview-${SLUG}-v1`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.B && parsed.SP) {
          SP.length = 0; parsed.SP.forEach(s => SP.push(s));
          FO_DATA.length = 0; (parsed.FO || []).forEach(f => FO_DATA.push(f));
          B = {}; buildInitialState(); buildDepsMap();
          Object.entries(parsed.B).forEach(([k, v]) => { if (B[k]) Object.assign(B[k], v); else B[k] = v; });
          Object.values(B).forEach(b=>{if(!Array.isArray(b.entries))b.entries=[];if(!b.detailText)b.detailText='';if(!b.borderColor)b.borderColor='';});
        } else {
          Object.entries(parsed).forEach(([k, v]) => { if (B[k]) Object.assign(B[k], v); });
          Object.values(B).forEach(b=>{if(!Array.isArray(b.entries))b.entries=[];if(!b.detailText)b.detailText='';if(!b.borderColor)b.borderColor='';});
        }
        if (parsed.boardInfo) boardInfo = parsed.boardInfo;
        if (parsed.pageInfo) pageInfo = parsed.pageInfo;
      }
    } catch (e) {}
  }

  // Single-page boards start on the subpage, not overview
  if (SP.length === 1) currentPage = SP[0].id;

  cascade();
  render();

  // Load settings
  try { const s = localStorage.getItem('doview_ai_settings'); if (s) aiSettings = JSON.parse(s); } catch (e) {}
  if (config.aiEndpoint && !aiSettings.endpoint) { aiSettings.endpoint = config.aiEndpoint; aiSettings.model = config.aiModel || 'gpt-4o'; }
  try { const s = localStorage.getItem('doview_sources'); if (s) sources = JSON.parse(s); } catch (e) {}
  probeConnection();
  updateUndoBtn();
  document.getElementById('chatIn').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } });

  // Close modals on backdrop click
  document.querySelectorAll('.modal-ov').forEach(m => { m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); }); });
}

return { init };
})();

// Auto-init for downloaded/reloaded files: if EMBEDDED_STATE is populated, init on DOMContentLoaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    if (EMBEDDED_STATE) {
      DoView.init(EMBEDDED_STATE);
    }
  });
}
