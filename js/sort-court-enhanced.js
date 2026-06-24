// Enhanced Sort The Court engine and UI
// Overrides previous initSortCourt to provide a long branching experience

(function(){
  // Load data if available as a separate module; fallback to embedded data
  // We'll place decision nodes in js/sort-court-data.js but allow fallback.

  const STORAGE_KEY = 'sortCourtState_v1';

  function defaultData(){
    return {
      start: 'node_1',
      nodes: {
        node_1: {
          id: 'node_1',
          role: 'Farmer',
          portrait: '🌾',
          name: 'Elda the Farmer',
          text: 'My crops failed this season. Could the crown provide seeds and tools so I can feed my family?',
          choices: [
            { id: 'c1', text: 'Provide seeds and tools (cost 50 gold)', delta:{gold:-50,happiness:8,population:0,army:0,rep:3}, next: 'node_2' },
            { id: 'c2', text: 'Offer a small loan (cost 20 gold)', delta:{gold:-20,happiness:4,rep:1}, next: 'node_3' },
            { id: 'c3', text: 'Decline; funds are low', delta:{gold:0,happiness:-6,rep:-2}, next: 'node_4' }
          ]
        },
        node_2: { id:'node_2', role:'Merchant', portrait:'🧺', name:'Borin the Merchant', text:'I can import grain if you lower tariffs for a season. It will cost short-term revenue but help people.',
          choices:[
            {id:'c1', text:'Lower tariffs for 1 season (gain happiness +6, lose gold 30)', delta:{gold:-30,happiness:6,rep:2}, next:'node_5'},
            {id:'c2', text:'Refuse; protect long-term revenue', delta:{rep: -1, happiness:-2}, next:'node_6'},
            {id:'c3', text:'Offer subsidy instead (cost 40 gold)', delta:{gold:-40,happiness:8,rep:3}, next:'node_5'}
          ]},
        node_3: { id:'node_3', role:'Blacksmith', portrait:'🔨', name:'Garna the Smith', text:'If you invest in my forge, I can produce tools and weapons for the militia.',
          choices:[{id:'c1', text:'Invest (cost 80 gold, army +5)', delta:{gold:-80,army:5,rep:4}, next:'node_7'},{id:'c2', text:'Fund smaller grant (cost 30 gold)', delta:{gold:-30,army:2,rep:2}, next:'node_7'},{id:'c3', text:'No funding', delta:{rep:-1}, next:'node_8'}]},
        node_4: { id:'node_4', role:'Beggar', portrait:'🧑‍🦯', name:'Marr', text:'My children are starving. Please help or we will not survive the winter.',
          choices:[{id:'c1', text:'Open royal kitchens today (cost 25 gold)', delta:{gold:-25,happiness:10,rep:2}, next:'node_5'},{id:'c2', text:'Offer jobless relief (cost 40 gold)', delta:{gold:-40,happiness:8,rep:3}, next:'node_5'},{id:'c3', text:'Turn them away', delta:{happiness:-10,rep:-5}, next:'node_6'}]},
        node_5: { id:'node_5', role:'Priest', portrait:'⛪', name:'Sister Tova', text:'The temple asks to host refugees from the north. Will you allow sanctuary?',
          choices:[{id:'c1', text:'Allow sanctuary (cost 20 gold, population +3)', delta:{gold:-20,population:3,happiness:3,rep:2}, next:'node_9'},{id:'c2', text:'Refuse; strain on resources', delta:{happiness:-4,rep:-2}, next:'node_6'},{id:'c3', text:'Allow temporarily with donations', delta:{gold:-10,population:1,happiness:2,rep:1}, next:'node_9'}]},
        node_6: { id:'node_6', role:'Soldier', portrait:'🛡️', name:'Captain Hurn', text:'Bandits threaten the eastern road. Increase patrols or wait for militia?',
          choices:[{id:'c1', text:'Send patrols (cost 30 gold, army -1 for upkeep)', delta:{gold:-30,army:-1,happiness:1,rep:1}, next:'node_10'},{id:'c2', text:'Raise militia (cost 50 gold, army +3)', delta:{gold:-50,army:3,rep:2}, next:'node_10'},{id:'c3', text:'Do nothing for now', delta:{rep:-2,happiness:-3}, next:'node_11'}]},
        node_7: { id:'node_7', role:'Scholar', portrait:'📜', name:'Lira the Scholar', text:'Teach craftsmen new techniques to increase productivity long-term.',
          choices:[{id:'c1', text:'Fund schools (cost 60 gold, happiness +5)', delta:{gold:-60,happiness:5,rep:3}, next:'node_12'},{id:'c2', text:'Encourage apprenticeships (cost 20 gold)', delta:{gold:-20,happiness:2,rep:1}, next:'node_12'},{id:'c3', text:'No action', delta:{rep:-1}, next:'node_11'}]},
        node_8: { id:'node_8', role:'Trader', portrait:'📦', name:'Kess', text:'I offer a risky trade that could bring in big profits but could fail.',
          choices:[{id:'c1', text:'Fund the trade (cost 70 gold) - risky', delta:{gold:-70}, success:{chance:0.5, onSuccess:{gold:+150,rep:+5,happiness:+5}, onFail:{gold:-30,rep:-3,happiness:-6}}, next:'node_13'},{id:'c2', text:'Decline the risk', delta:{rep:-1}, next:'node_11'},{id:'c3', text:'Negotiate partnership (cost 30 gold)', delta:{gold:-30,rep:2}, next:'node_13'}]},
        node_9: { id:'node_9', role:'Farmer', portrait:'🌻', name:'Torin', text:'The harvest is promising if we protect the fields. Do we subsidize plows?',
          choices:[{id:'c1', text:'Subsidize plows (cost 40 gold)', delta:{gold:-40,happiness:6,rep:2}, next:'node_14'},{id:'c2', text:'Let market decide', delta:{happiness:-2,rep:-1}, next:'node_11'},{id:'c3', text:'Tax relief for farmers', delta:{gold:-20,happiness:4,rep:2}, next:'node_14'}]},
        node_10: { id:'node_10', role:'Innkeeper', portrait:'🍺', name:'Magg', text:'Soldiers demand lodging; our coffers are strained. Charge them or host for free?',
          choices:[{id:'c1', text:'Charge soldiers (gain 15 gold, anger army -1)', delta:{gold:+15,army:-1,happiness:-2}, next:'node_15'},{id:'c2', text:'Host for free (cost 20 gold)', delta:{gold:-20,happiness:3,rep:1}, next:'node_15'},{id:'c3', text:'Alternate lodging', delta:{rep:0,happiness:0}, next:'node_11'}]},
        node_11: { id:'node_11', role:'Child', portrait:'👦', name:'Lena', text:'The schoolteacher needs supplies to teach. Will you fund the school?',
          choices:[{id:'c1', text:'Fund school (cost 30 gold, happiness +5)', delta:{gold:-30,happiness:5,rep:2}, next:'node_16'},{id:'c2', text:'Provide books only (cost 10 gold)', delta:{gold:-10,happiness:2}, next:'node_16'},{id:'c3', text:'No funding', delta:{happiness:-4,rep:-1}, next:'node_17'}]},
        node_12: { id:'node_12', role:'Merchant', portrait:'🧾', name:'Sela', text:'Foreign traders want stable tariffs. Stability increases trade over time.',
          choices:[{id:'c1', text:'Commit to stable tariffs (no immediate cost)', delta:{rep:2,happiness:1}, next:'node_18'},{id:'c2', text:'Refuse to commit', delta:{rep:-1}, next:'node_17'}]},
        node_13: { id:'node_13', role:'Seer', portrait:'🔮', name:'Zeen', text:'I foresee a festival soon that could raise morale but costs resources. Hold it?',
          choices:[{id:'c1', text:'Hold festival (cost 60 gold, happiness +15)', delta:{gold:-60,happiness:15,rep:5}, next:'node_19'},{id:'c2', text:'Skip festival', delta:{rep:-1}, next:'node_17'}]},
        node_14: { id:'node_14', role:'Builder', portrait:'🏗️', name:'Harl', text:'We can improve irrigation which increases future yields but requires labor.',
          choices:[{id:'c1', text:'Build irrigation (cost 80 gold, population -1 during work)', delta:{gold:-80,population:-1,happiness:4,rep:3}, next:'node_20'},{id:'c2', text:'Delay project', delta:{rep:-1,happiness:-2}, next:'node_17'}]},
        node_15: { id:'node_15', role:'Bard', portrait:'🎻', name:'Rin', text:'Traveler tales bring tourists. Sponsor his troupe?',
          choices:[{id:'c1', text:'Sponsor (cost 20 gold, happiness +6)', delta:{gold:-20,happiness:6,rep:2}, next:'node_19'},{id:'c2', text:'Decline', delta:{rep:-1}, next:'node_17'}]},
        node_16: { id:'node_16', role:'Elder', portrait:'🧓', name:'Old Mar', text:'We need to repair the bridge or trade will halt on the eastern route.',
          choices:[{id:'c1', text:'Repair bridge (cost 70 gold)', delta:{gold:-70,rep:3,happiness:4}, next:'node_19'},{id:'c2', text:'Patch temporarily (cost 20 gold)', delta:{gold:-20,happiness:1}, next:'node_17'},{id:'c3', text:'Ignore', delta:{rep:-3,happiness:-6}, next:'node_20'}]},
        node_17: { id:'node_17', role:'Traveler', portrait:'🚶', name:'Nov', text:'A merchant caravan was attacked nearby. Will you offer a reward for information?',
          choices:[{id:'c1', text:'Reward (cost 40 gold)', delta:{gold:-40,rep:3,army:1}, next:'node_19'},{id:'c2', text:'No reward', delta:{rep:-2,happiness:-3}, next:'node_20'}]},
        node_18: { id:'node_18', role:'Advisor', portrait:'🧠', name:'Ves', text:'We can formalize a trade agreement which slowly increases gold income (long-term).',
          choices:[{id:'c1', text:'Formalize (cost 30 gold)', delta:{gold:-30,rep:3}, next:'node_19'},{id:'c2', text:'Postpone', delta:{rep:-1}, next:'node_20'}]},
        node_19: { id:'node_19', role:'Citizen', portrait:'🙂', name:'Crowd', text:'The people celebrate your recent choices, morale is high.', choices:[{id:'c1', text:'Continue (no cost)', delta:{happiness:2,rep:1}, next:'node_20'}]},
        node_20: { id:'node_20', role:'Herald', portrait:'📣', name:'Town Crier', text:'News arrives from the capital with a request for tribute.',
          choices:[{id:'c1', text:'Pay tribute (cost 100 gold, rep +5)', delta:{gold:-100,rep:5,happiness:0}, next:null},{id:'c2', text:'Negotiate delay (rep +1)', delta:{rep:1,happiness:-1}, next:null},{id:'c3', text:'Refuse (risk war)', delta:{rep:-5, army:-3, happiness:-10, hiddenRisk:{chance:0.4, onFail:{army:-10, population:-5, happiness:-20}} , next:null} ] }
      }
    };
  }

  // Choose data source: if js/sort-court-data.js provides `SORT_COURT_DATA`, use that.
  let SORT_DATA = null;
  if(window.SORT_COURT_DATA){ SORT_DATA = window.SORT_COURT_DATA; }
  else { SORT_DATA = defaultData(); }

  // Utility functions
  function clamp(v,min,max){ return Math.max(min,Math.min(max,v)); }

  // The init function will override the simple one
  window.initSortCourt = function(){
    const frame = document.getElementById('gameFrame');
    if(!frame) return;

    // Build UI
    frame.innerHTML = `
      <div id="sc-root" style="max-width:900px;margin:0 auto;text-align:left;">
        <div style="display:flex;gap:12px;align-items:center;justify-content:space-between;">
          <div id="sc-stats" style="display:flex;gap:12px;align-items:center"></div>
          <div style="display:flex;gap:8px;align-items:center">
            <button id="sc-save" class="small-btn">Save</button>
            <button id="sc-load" class="small-btn">Load</button>
            <button id="sc-reset" class="small-btn">Restart</button>
          </div>
        </div>
        <hr>
        <div id="sc-encounter" style="display:flex;gap:16px;align-items:flex-start;margin-top:12px;">
          <div id="sc-portrait" style="width:160px;height:160px;border-radius:8px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-size:64px;">🙂</div>
          <div style="flex:1;">
            <div id="sc-role" style="font-weight:700;margin-bottom:6px"></div>
            <div id="sc-text" style="margin-bottom:12px"></div>
            <div id="sc-choices" style="display:flex;flex-direction:column;gap:8px"></div>
          </div>
          <div style="width:260px;border-left:1px solid #eee;padding-left:12px">
            <div><strong>Consequence preview</strong></div>
            <div id="sc-preview" style="margin-top:8px;color:#111"></div>
            <hr>
            <div><strong>History</strong></div>
            <div id="sc-history" style="max-height:240px;overflow:auto;margin-top:8px;font-size:0.9em;color:#333"></div>
          </div>
        </div>
      </div>
    `;

    // initial kingdom state
    let state = loadState() || {
      gold: 200,
      happiness: 50,
      population: 20,
      army: 10,
      rep: 0,
      flags: {},
      history: [],
      currentNode: SORT_DATA.start
    };

    // Render stats
    function renderStats(){
      const s = document.getElementById('sc-stats');
      s.innerHTML = `
        <div style="display:flex;gap:8px;align-items:center">💰 <strong>Gold:</strong> <span id="stat-gold">${state.gold}</span></div>
        <div style="display:flex;gap:8px;align-items:center">😊 <strong>Happiness:</strong> <span id="stat-hap">${state.happiness}</span></div>
        <div style="display:flex;gap:8px;align-items:center">👥 <strong>Population:</strong> <span id="stat-pop">${state.population}</span></div>
        <div style="display:flex;gap:8px;align-items:center">🛡️ <strong>Army:</strong> <span id="stat-army">${state.army}</span></div>
        <div style="display:flex;gap:8px;align-items:center">🏛️ <strong>Reputation:</strong> <span id="stat-rep">${state.rep}</span></div>
      `;
    }

    // Show node
    function showNode(nodeId){
      if(!nodeId){ endGame(); return; }
      const node = SORT_DATA.nodes[nodeId];
      if(!node){ endGame(); return; }
      state.currentNode = nodeId;
      renderStats();
      const portrait = document.getElementById('sc-portrait');
      portrait.textContent = node.portrait || '🙂';
      document.getElementById('sc-role').textContent = `${node.name} — ${node.role}`;
      document.getElementById('sc-text').textContent = node.text;
      const choicesEl = document.getElementById('sc-choices');
      choicesEl.innerHTML = '';
      node.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'small-btn';
        // build preview string
        const parts = [];
        if(choice.delta){ for(const k in choice.delta){ if(typeof choice.delta[k] === 'number' && choice.delta[k] !== 0){ parts.push(`${k}:${choice.delta[k]>0?'+':''}${choice.delta[k]}`); } } }
        if(choice.success && choice.success.chance){ parts.push(`risk:${Math.round(choice.success.chance*100)}%`); }
        btn.textContent = choice.text + (parts.length? ` — (${parts.join(', ')})` : '');
        btn.addEventListener('click', ()=>applyChoice(nodeId, choice));
        btn.addEventListener('mouseover', ()=>{
          document.getElementById('sc-preview').textContent = parts.length?parts.join(', '):'No immediate visible consequence';
        });
        btn.addEventListener('mouseout', ()=>{ document.getElementById('sc-preview').textContent = ''; });
        choicesEl.appendChild(btn);
      });
      // render history
      renderHistory();
    }

    // Apply choice
    function applyChoice(nodeId, choice){
      // Evaluate success chance if any
      let outcome = { success:true, delta: choice.delta || {} };
      if(choice.success && choice.success.chance){ if(Math.random() > choice.success.chance){ outcome.success = false; outcome.delta = choice.success.onFail || {}; } else { outcome.success = true; outcome.delta = choice.success.onSuccess || {}; } }

      // Apply deltas
      const d = outcome.delta;
      state.gold = clamp(state.gold + (d.gold||0), -99999, 999999);
      state.happiness = clamp(state.happiness + (d.happiness||0), -100, 100);
      state.population = clamp(state.population + (d.population||0), 0, 1000000);
      state.army = clamp(state.army + (d.army||0), 0, 1000000);
      state.rep = clamp(state.rep + (d.rep||0), -1000, 1000);
      // handle hidden risk
      if(choice.hiddenRisk){ if(Math.random() < (choice.hiddenRisk.chance||0)){ const hr = choice.hiddenRisk.onFail || {}; state.gold = clamp(state.gold + (hr.gold||0), -99999, 999999); state.happiness = clamp(state.happiness + (hr.happiness||0), -100, 100); state.population = clamp(state.population + (hr.population||0), 0, 1000000); state.army = clamp(state.army + (hr.army||0), 0, 1000000); state.rep = clamp(state.rep + (hr.rep||0), -1000, 1000); state.history.push({when:Date.now(), node:nodeId, choice:choice.text, hidden:true, effect:hr}); }
      }

      // push to history
      state.history.push({when:Date.now(), node:nodeId, choice:choice.text, effect: outcome.delta, success: outcome.success});

      // set flags if any
      if(choice.setFlags){ Object.assign(state.flags, choice.setFlags); }

      // determine next
      const next = choice.next || null;
      // Save automatically
      saveState();
      // show intermediate result overlay inside modal
      showResultOverlay(choice.text, outcome, ()=>{
        // after overlay, go to next node or end
        if(next) showNode(next);
        else {
          // pick random next node to keep game long if next is null
          const keys = Object.keys(SORT_DATA.nodes);
          // choose a random node that may be influenced by flags later (simple random for now)
          const candidate = keys[Math.floor(Math.random()*keys.length)];
          showNode(candidate);
        }
      });
    }

    function showResultOverlay(choiceText, outcome, cb){
      // create overlay area in the modal (replace any existing small overlay)
      const root = document.getElementById('sc-root');
      let ov = document.getElementById('sc-overlay');
      if(ov) ov.remove();
      ov = document.createElement('div'); ov.id='sc-overlay';
      ov.style.position='fixed'; ov.style.left='50%'; ov.style.top='50%'; ov.style.transform='translate(-50%,-50%)'; ov.style.zIndex='9999'; ov.style.background='white'; ov.style.color='#111'; ov.style.padding='18px'; ov.style.borderRadius='10px'; ov.style.boxShadow='0 10px 30px rgba(0,0,0,0.3)';
      ov.innerHTML = `<div><strong>Choice:</strong> ${choiceText}</div><div id="sc-outcome" style="margin-top:8px"></div><div style="margin-top:12px;text-align:right"><button id="sc-continue" class="small-btn">Continue</button></div>`;
      document.body.appendChild(ov);
      const out = ov.querySelector('#sc-outcome');
      if(outcome.success===false) out.innerHTML = `<div style="color:#b91c1c">The choice failed.</div>`;
      if(outcome.delta){ const parts = []; for(const k in outcome.delta){ if(typeof outcome.delta[k]==='number' && outcome.delta[k]!==0) parts.push(`${k} ${outcome.delta[k]>0?'+':''}${outcome.delta[k]}`); } if(parts.length) out.innerHTML += `<div>Effect: ${parts.join(', ')}</div>`; }
      ov.querySelector('#sc-continue').addEventListener('click', ()=>{ ov.remove(); cb(); renderStats(); renderHistory(); });
    }

    function renderHistory(){ const h = document.getElementById('sc-history'); h.innerHTML=''; state.history.slice().reverse().forEach(entry=>{ const date = new Date(entry.when); const el = document.createElement('div'); el.textContent = `${date.toLocaleTimeString()} — ${entry.choice} => ${JSON.stringify(entry.effect)}`; el.style.padding='4px 0'; h.appendChild(el); }); }

    function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    function loadState(){ try{ const raw = localStorage.getItem(STORAGE_KEY); return raw?JSON.parse(raw):null;}catch(e){return null;} }
    function resetState(){ localStorage.removeItem(STORAGE_KEY); state = null; location.reload(); }

    function endGame(){ alert('Sort The Court session ended. You can restart or continue.'); }

    // Wire save/load/reset buttons
    document.getElementById('sc-save').addEventListener('click', ()=>{ saveState(); alert('Game saved.'); });
    document.getElementById('sc-load').addEventListener('click', ()=>{ const s = loadState(); if(s){ state = s; showNode(state.currentNode||SORT_DATA.start); renderStats(); renderHistory(); alert('Game loaded.'); } else alert('No save found.'); });
    document.getElementById('sc-reset').addEventListener('click', ()=>{ if(confirm('Restart Sort The Court?')){ resetState(); } });

    // If there's a saved state, resume
    const saved = loadState(); if(saved){ state = saved; }
    // Start
    showNode(state.currentNode || SORT_DATA.start);
  };

  // If user opens Sort The Court while modal is open, re-init when needed.
})();
