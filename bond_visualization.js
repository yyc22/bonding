// One classification model for results and diagrams. Reference examples refer to named substances.
const NONMETALS = new Set(['H','C','N','O','F','P','S','Cl','Se','Br','I']);
const SPECIAL = new Set(['He','Ne','Ar','Kr','Xe','Rn','B','Si','Ge','As','Sb','Te','Po','At']);
const IONIC_EXAMPLES = {
 'Cl-Na': ['NaCl','Na','+','Cl','−'],
 'F-K': ['KF','K','+','F','−'],
 'Mg-O': ['MgO','Mg','2+','O','2−'],
 'Ca-F': ['CaF₂','Ca','2+','F','−'],
 'I-Mn': ['MnI₂','Mn','2+','I','−']
};
function classifyBond(a,b) {
 const diff = Math.abs(a.electronegativity-b.electronegativity);
 const key = [a.symbol,b.symbol].sort().join('-');
 if (!Number.isFinite(a.electronegativity)||!Number.isFinite(b.electronegativity)) return {kind:'unknown',label:'Insufficient data',text:'No electronegativity value is available for one or both elements.'};
 if (IONIC_EXAMPLES[key]) return {kind:'ionic',label:'Ionic bonding in '+IONIC_EXAMPLES[key][0],ions:IONIC_EXAMPLES[key],text:'This named solid contains oppositely charged ions in an extended lattice. The formula gives their ratio; it does not describe an isolated pair of atoms.'};
 if(NONMETALS.has(a.symbol)&&NONMETALS.has(b.symbol)) {
 const weak = diff < 0.4;
 return {kind:weak?'nonpolar':'polar',label:weak?'Nonpolar or weakly polar covalent bond':'Polar Covalent Bond',text:key==='F-H'?'In hydrogen fluoride (HF), H and F share a bonding electron pair unequally: Hδ+–Fδ−. ΔEN = 1.78 with this table. A value above 1.7 does not make HF ionic.':weak?'If these atoms form a covalent bond, its polarity is small. Below 0.4 is a classroom approximation, not an exact boundary; equal sharing applies to identical atoms.':'If these nonmetal atoms form a bond, shared electron density is drawn toward the more electronegative atom. This comparison does not establish a stable molecular formula.'};
 }
 const metal = e=>!NONMETALS.has(e.symbol)&&!SPECIAL.has(e.symbol);
 if(metal(a)&&metal(b)) return {kind:'metallic',label:'Metallic bonding model',text:'Bulk metals and many alloys are described by metal centres with delocalised electrons, not a shared electron pair between two isolated atoms. The actual alloy structure requires more information.'};
 return {kind:'unknown',label:'Compound and structure needed',text:'These element choices and ΔEN alone do not establish a bond type. Metal–nonmetal compounds are often ionic, but exceptions exist. Specify a formula, physical state and structure before assigning bonding.'};
}
function analyzeBond(a,b) {
 const box=document.getElementById('bond-analysis');
 const result=classifyBond(a,b);
 const diff=Math.abs(a.electronegativity-b.electronegativity);
 box.innerHTML='<h2>Bond Analysis</h2>';
 const info=document.createElement('div'); info.className='bond-info';
 const valid=Number.isFinite(a.electronegativity)&&Number.isFinite(b.electronegativity);
 info.innerHTML='<p><strong>Electronegativity difference:</strong> '+(valid?diff.toFixed(2):'Unavailable')+'</p><h3>'+result.label+'</h3><p>'+result.text+'</p>';
 box.appendChild(info);
 if(result.kind==='polar'||result.kind==='nonpolar') {
  const left=a.electronegativity<=b.electronegativity?a:b, right=left===a?b:a;
  const polar=result.kind==='polar';
  const diagram=document.createElement('div'); diagram.className='bond-visualization';
  diagram.innerHTML='<div class="bond-title">'+(polar?'Unequal electron sharing':'Approximately equal electron sharing')+'</div><div class="bond-diagram '+(polar?'polar':'nonpolar')+'"><div class="atom"><div class="atom-symbol">'+left.symbol+'</div>'+(polar?'<div class="partial-charge">δ+</div>':'')+'</div><div class="electron-cloud '+(polar?'shifted':'')+'" style="background:linear-gradient(90deg,#b9dbed,#436fc8);"><div class="electrons">••</div></div><div class="atom"><div class="atom-symbol">'+right.symbol+'</div>'+(polar?'<div class="partial-charge">δ−</div>':'')+'</div></div><p>Shared electron pair; schematic only, not electron paths, sizes or a calculated density map.</p>';
  box.appendChild(diagram);
 } else if(result.kind==='ionic') {
  const [formula,cation,plus,anion,minus]=result.ions;
  const diagram=document.createElement('p');
  diagram.className='bond-visualization';
  diagram.innerHTML='<strong>'+cation+'<sup>'+plus+'</sup> ⋯ '+anion+'<sup>'+minus+'</sup></strong><br>Electrostatic attraction in the '+formula+' lattice. Ion charges shown are formal charges; this is not an electron-transfer animation.';
  box.appendChild(diagram);
 }
}
