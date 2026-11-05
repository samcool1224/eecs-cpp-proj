import createMovieCore from './movie-core.js';
const $ = (id) => document.getElementById(id);
const icons = {
 grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"/>',
 bookmark:'<path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17l-6-4Z"/>',
 chart:'<path d="M4 3v17h17M9 15v-4m5 4V6m5 9V9"/>',
 download:'<path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/>',
 upload:'<path d="M12 16V4m-4 4 4-4 4 4M4 16v5h16v-5"/>',
 code:'<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 20"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
 chevron:'<path d="m7 10 5 5 5-5"/>',
 sort:'<path d="M6 4v16m-3-3 3 3 3-3M12 6h9m-9 6h6m-6 6h3"/>',
 list:'<path d="M8 5h13M8 12h13M8 19h13M3 5h.1M3 12h.1M3 19h.1"/>',
 edit:'<path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14Z"/>',
 trash:'<path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>',
 arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
 spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>',
 film:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 8h4m10 0h4M3 16h4m10 0h4"/>'
};
const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.film}</svg>`;
function hydrateIcons(root=document){root.querySelectorAll('[data-icon]').forEach(n=>n.innerHTML=icon(n.dataset.icon));}
hydrateIcons();
const escape = (value) => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const genres=['Drama','Sci-Fi','Thriller','Animation','Comedy','Action','Documentary','Horror','Romance','Other'];
for(const genre of genres){$('genre-filter').add(new Option(genre,genre));$('movie-genre').add(new Option(genre,genre));}
const STORAGE_KEY='frame.movie-catalog.v1';
let Core, catalog, view='all', mode='grid', toastTimer, confirmAction, importBusy=false;
const labels={all:'All movies',recommended:'Recommended',watchlist:'Watchlist',insights:'Your insights'};
const titles={all:'Your collection',recommended:'Worth another watch',watchlist:'The next great story',insights:'Your taste in focus'};
const descriptions={all:'Every film has a story. This one is yours.',recommended:'The films that earned a place among your favorites.',watchlist:'A little anticipation. A lot to look forward to.',insights:'A few numbers behind the stories you love.'};
const allMovies=()=>JSON.parse(catalog.query('','All genres','all','newest'));
const stats=()=>JSON.parse(catalog.stats());
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,3600);}
function storageWarning(message){$('storage-warning').textContent=message;$('storage-warning').hidden=false;$('save-status').textContent='Export a backup to keep changes';}
function persist(){
 try{localStorage.setItem(STORAGE_KEY,catalog.snapshot());$('storage-warning').hidden=true;$('save-status').textContent='Saved on this device';}
 catch{storageWarning('Browser storage is unavailable or full. Your changes work for this session. Export a backup to keep them.');}
}
// Restore into a separate C++ Catalog, so an invalid record never damages live data.
function validatedCatalog(data){
 if(!data || data.version!==1 || !Array.isArray(data.movies) || data.movies.length>500)throw Error('Choose a Frame JSON export with version 1 and up to 500 movies.');
 const next=new Core.Catalog(false);
 try{
  for(const m of data.movies){
   if(!m || !Number.isInteger(m.id) || m.id<1 || m.id>1000000000 || !Number.isInteger(m.year) || m.year<1888 || m.year>2100 || typeof m.title!=='string' || typeof m.genre!=='string' || typeof m.rating!=='number' || typeof m.review!=='string')throw Error('A movie has missing or incorrectly typed fields.');
   if(!next.restore(m.id,m.title,m.genre,m.year,m.rating,m.review))throw Error(next.lastError());
  }
  return next;
 }catch(error){next.delete();throw error;}
}
function art(movie){
 const known={'Interstellar':'space','The Grand Budapest Hotel':'hotel','Spirited Away':'spirit','The Dark Knight':'knight','Past Lives':'lives','The Matrix':'matrix','Tenet':'time','Dune Part Two':'dune','The Truman Show':'show'};
 return `./art/${known[movie.title] || ({'Sci-Fi':'space',Animation:'spirit',Comedy:'hotel',Thriller:'time',Romance:'lives',Action:'knight',Drama:'show'}[movie.genre] || 'generic')}.svg`;
}
function statusClass(m){return m.rating===0?'watch':m.status==='Recommended'?'yes':'no';}
function ratingBadge(m){return m.rating?`${icon('star')}${m.rating.toFixed(1)}`:`${icon('bookmark')}Watchlist`;}
function renderCard(m){return `<article class="movie-card"><button class="poster-button" data-detail="${m.id}" aria-label="View ${escape(m.title)}"><img class="poster" src="${art(m)}" alt="" loading="lazy"><span class="card-rating">${ratingBadge(m)}</span></button><div class="card-body"><div class="card-main"><button class="card-title" data-detail="${m.id}">${escape(m.title)}</button><p class="card-meta">${m.year}<span>·</span>${escape(m.genre)}</p></div><div class="card-footer"><span class="status ${statusClass(m)}">${m.rating?escape(m.status):'On the watchlist'}</span><div class="card-actions"><button class="icon-button" data-edit="${m.id}" aria-label="Edit ${escape(m.title)}">${icon('edit')}</button><button class="icon-button" data-delete="${m.id}" aria-label="Delete ${escape(m.title)}">${icon('trash')}</button></div></div></div></article>`;}
function render(){
 if(!catalog)return;
 const s=stats();const movies=allMovies();
 for(const key of ['all','recommended','watchlist'])$(`nav-${key}`).textContent=key==='all'?s.total:s[key];
 $('page-title').innerHTML=`${escape(titles[view])}<span>.</span>`;$('page-description').textContent=descriptions[view];$('breadcrumb').textContent=labels[view];
 document.querySelectorAll('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===view);if(b.dataset.view===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
 $('library-section').hidden=view==='insights';$('insights-section').hidden=view!=='insights';
 if(view==='insights'){renderInsights(s,movies);return;}
 $('stat-total').textContent=s.total;$('stat-average').textContent=s.rated?s.average.toFixed(1):'—';$('stat-recommended').textContent=s.recommended;$('stat-watchlist').textContent=s.watchlist;
 const top=movies.find(m=>m.id===s.bestId);
 $('spotlight').innerHTML=top?`<p class="eyebrow">${icon('star')} THE TOP OF YOUR FRAME</p><h2>${escape(top.title)}</h2><p class="meta">${top.year} &nbsp;·&nbsp; ${escape(top.genre)} &nbsp;·&nbsp; Your highest rated film</p><div class="spotlight-bottom"><div class="spotlight-rating">${top.rating.toFixed(1)}<small>/ 10</small></div><button class="text-button" data-detail="${top.id}">View your review ${icon('arrow')}</button></div>`:`<p class="eyebrow">${icon('spark')} YOUR NEXT FAVORITE AWAITS</p><h2>Every great collection starts with one film.</h2><div class="spotlight-bottom"><p class="meta">Rate a movie to find your top pick.</p><button class="text-button" data-add>Add a movie ${icon('arrow')}</button></div>`;
 const filtered=JSON.parse(catalog.query($('search').value,$('genre-filter').value,view,$('sort').value));
 $('collection-title').textContent=labels[view];$('result-count').textContent=`${filtered.length} ${filtered.length===1?'movie':'movies'}`;
 $('movie-grid').classList.toggle('list-mode',mode==='list');$('movie-grid').innerHTML=filtered.map(renderCard).join('');$('empty').hidden=filtered.length>0;
 const narrowed=$('search').value.trim() || $('genre-filter').value!=='All genres';
 $('empty').querySelector('h3').textContent=narrowed?'No movies match your search':view==='watchlist'?'Your next watch is waiting':view==='recommended'?'Your favorites start here':'Your first film belongs here';
 $('empty').querySelector('p').textContent=narrowed?'Try another title, year, review, or genre.':view==='recommended'?'Movies you rate 7.0 or higher will appear here.':'Add a movie and make this collection yours.';
 $('empty-action').textContent=narrowed?'Clear filters':'Add a movie';
}
function renderInsights(s,movies){
 const entries=[['Movies collected',s.total],['Average rating',s.rated?`${s.average.toFixed(1)} / 10`:'—'],['Recommended',s.recommended],['Waiting to be watched',s.watchlist]];
 $('insight-summary').innerHTML=entries.map(([label,value])=>`<div><strong>${value}</strong><span>${label}</span></div>`).join('');
 const max=Math.max(1,...s.distribution);
 $('distribution').innerHTML=s.distribution.map((n,i)=>`<div class="bar-group" aria-label="Rating above ${i} up to ${i+1}: ${n} movies"><span class="bar-count">${n}</span><div class="bar" style="height:${Math.max(2,n/max*190)}px"></div><span>${i+1}</span></div>`).join('');
 const counts=s.genres.map(g=>[g.name,g.count]).sort((a,b)=>b[1]-a[1]);
 $('genre-insights').innerHTML=counts.length?counts.map(([g,n])=>`<div class="genre-row"><span>${g}</span><small>${n} ${n===1?'movie':'movies'}</small></div>`).join(''):'<p class="muted">Add a movie to start exploring your taste.</p>';
}
function openEditor(id){
 const m=id?allMovies().find(x=>x.id===id):null;$('movie-form').reset();$('movie-id').value=m?.id || '';$('editor-title').textContent=m?'Edit movie':'Add a movie';
 $('movie-title').value=m?.title || '';$('movie-genre').value=m?.genre || 'Drama';$('movie-year').value=m?.year || new Date().getFullYear();$('movie-rating').value=m?.rating || 8;$('movie-review').value=m?.review || '';$('movie-watchlist').checked=m?m.rating===0:view==='watchlist';$('form-error').hidden=true;updateRatingUI();$('editor').showModal();$('movie-title').focus();
}
function updateRatingUI(){const watch=$('movie-watchlist').checked;$('rating-field').hidden=watch;$('movie-rating').disabled=watch;const r=Number($('movie-rating').value);$('rating-preview').textContent=r>=7?'Recommended':r>=1?'Not recommended':'Enter a rating';}
function showDetails(id){
 const m=allMovies().find(x=>x.id===id);if(!m)return;
 $('detail-content').innerHTML=`<img class="detail-poster" src="${art(m)}" alt=""><button class="icon-button detail-close" data-close="details" aria-label="Close">${icon('close')}</button><p class="eyebrow">YOUR MOVIE JOURNAL</p><h2 id="detail-title">${escape(m.title)}</h2><p class="detail-meta">${m.year} &nbsp;·&nbsp; ${escape(m.genre)}</p><p class="detail-score">${m.rating?`${m.rating.toFixed(1)} <small>/ 10</small>`:'On your watchlist'}</p><span class="status ${statusClass(m)}">${escape(m.status)}</span><p class="detail-review">${escape(m.review || (m.rating?'No review yet. Add a few words about what stayed with you.':'The story is still ahead of you. Rate this movie after you watch it.'))}</p><div class="dialog-actions"><button class="secondary" data-close="details">Close</button><button class="primary" data-detail-edit="${m.id}">${m.rating?'Edit movie':'Rate this movie'} ${icon('edit')}</button></div>`;
 $('details').showModal();
}
function askConfirm(title,message,label,action){$('confirm-title').textContent=title;$('confirm-message').textContent=message;$('confirm-action').textContent=label;confirmAction=action;$('confirm').showModal();}
// Delegation also handles cards created by subsequent C++ query results.
document.addEventListener('click',e=>{
 const target=e.target.closest('button');if(!target)return;
 if(target.dataset.close){$(target.dataset.close).close();return;}
 if(!catalog)return;
 if(target.dataset.view){view=target.dataset.view;render();return;}
 if(target.dataset.detail){showDetails(Number(target.dataset.detail));return;}
 if(target.dataset.edit){openEditor(Number(target.dataset.edit));return;}
 if(target.dataset.detailEdit){$('details').close();openEditor(Number(target.dataset.detailEdit));return;}
 if(target.hasAttribute('data-add')){openEditor();return;}
 if(target.dataset.delete){const m=allMovies().find(x=>x.id===Number(target.dataset.delete));askConfirm('Delete this movie?',`Remove “${m.title}” and its review from your collection? This cannot be undone.`,'Delete movie',()=>{if(catalog.remove(m.id)){persist();render();toast('Movie deleted.');}});}
});
$('add-button').onclick=()=>openEditor();
$('empty-action').onclick=()=>{if($('search').value.trim() || $('genre-filter').value!=='All genres'){$('search').value='';$('genre-filter').value='All genres';render();}else openEditor();};
$('movie-watchlist').onchange=updateRatingUI;$('movie-rating').oninput=updateRatingUI;
$('movie-form').onsubmit=e=>{
 e.preventDefault();const id=Number($('movie-id').value);const args=[$('movie-title').value,$('movie-genre').value,Number($('movie-year').value),$('movie-watchlist').checked?0:Number($('movie-rating').value),$('movie-review').value];
 const ok=id?catalog.update(id,...args):catalog.add(...args);
 if(!ok){$('form-error').textContent=catalog.lastError();$('form-error').hidden=false;return;}
 persist();$('editor').close();render();toast(id?'Movie updated.':'Movie added to your collection.');
};
for(const id of ['search','genre-filter','sort'])$(id).addEventListener(id==='search'?'input':'change',render);
for(const value of ['grid','list'])$(`${value}-view`).onclick=()=>{mode=value;for(const v of ['grid','list']){$(`${v}-view`).classList.toggle('selected',v===mode);$(`${v}-view`).setAttribute('aria-pressed',String(v===mode));}render();};
$('project-button').onclick=()=>$('project').showModal();
$('confirm-action').onclick=()=>{$('confirm').close();const action=confirmAction;confirmAction=null;action?.();};
$('confirm').addEventListener('close',()=>{confirmAction=null;});
$('reset-button').onclick=()=>{$('project').close();askConfirm('Restore sample collection?','This will replace your current collection with the nine sample movies. Export a backup first if you want to keep your movies.','Restore samples',()=>{catalog.seed();persist();render();toast('Sample collection restored.');});};
$('export-button').onclick=()=>{if(!catalog){toast('Wait for the movie engine to load.');return;}const blob=new Blob([catalog.snapshot()],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='frame-collection.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Collection exported. Keep it as your backup.');};
$('import-button').onclick=()=>{if(!catalog){toast('Wait for the movie engine to load.');return;}$('import-file').click();};
$('import-file').onchange=async e=>{
 const file=e.target.files[0];e.target.value='';if(!file || importBusy)return;
 if(file.size>2*1024*1024){toast('Choose a JSON backup smaller than 2 MB.');return;}
 importBusy=true;let next;
 try{next=validatedCatalog(JSON.parse(await file.text()));const count=JSON.parse(next.stats()).total;
  askConfirm('Replace your collection?',`The imported backup has ${count} movies. It will replace your current collection. Export a backup first if needed.`,'Import collection',()=>{catalog.delete();catalog=next;next=null;persist();render();toast('Collection imported.');});
  const release=()=>{if(next){next.delete();next=null;}$('confirm').removeEventListener('close',release);};$('confirm').addEventListener('close',release);
 }catch(error){toast(`Import failed: ${error.message}`);}finally{importBusy=false;}
};
// Native <dialog> handles focus trapping and Escape. Clicking its backdrop closes it.
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom)dialog.close();}});
async function boot(){
 try{
  Core=await createMovieCore();let saved;
  try{saved=localStorage.getItem(STORAGE_KEY);}catch{storageWarning('Browser storage is disabled. Export your collection to keep changes between sessions.');}
  if(saved){try{catalog=validatedCatalog(JSON.parse(saved));}catch{catalog=new Core.Catalog(true);storageWarning('Your saved catalog could not be read. Sample movies are shown. Export them or import a valid backup before continuing.');}}
  else catalog=new Core.Catalog(true);
  $('loading').hidden=true;$('add-button').disabled=false;render();
 }catch(error){console.error(error);$('loading').textContent='The C++ movie engine could not load. Refresh the page, or serve the complete dist folder over HTTP so movie-core.js and movie-core.wasm are available.';$('loading').setAttribute('role','alert');}
}
boot();
