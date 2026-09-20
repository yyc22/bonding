// Questions assess chemistry concepts rather than absolute numerical cutoffs.
document.addEventListener('DOMContentLoaded',()=>{
 const questions=[
 ['How is the H–F bond in HF classified?',['Polar covalent','Ionic','Metallic'],0,'HF shares a bonding electron pair unequally, even though its ΔEN exceeds 1.7.'],
 ['Does a large electronegativity difference prove a compound is ionic?',['Yes','No'],1,'Bonding also depends on the actual substance and its structure.'],
 ['Which atom in HF has a partial negative charge?',['H','F'],1,'Fluorine attracts the shared electron density more strongly.'],
 ['Why is CO₂ nonpolar overall?',['Its bonds are nonpolar','Its bond dipoles cancel in its linear shape'],1,'Bond polarity and molecular polarity are different.'],
 ['What holds an ionic lattice together?',['Electrostatic attraction between ions','Electrons repeatedly jumping between two atoms'],0,'Ion formation and the attraction that holds the lattice together are distinct ideas.']
 ];
 const box=document.getElementById('bond-quiz'); if(!box)return;
 let index=0;
 function show(){
  const q=questions[index];box.innerHTML='<h3>Test your understanding</h3><p>'+q[0]+'</p>';
  const feedback=document.createElement('p');feedback.setAttribute('aria-live','polite');
  q[1].forEach((label,i)=>{const button=document.createElement('button');button.textContent=label;button.style.margin='6px';button.onclick=()=>{feedback.textContent=(i===q[2]?'Correct. ':'Try again. ')+q[3];};box.appendChild(button);});
  box.appendChild(feedback);const next=document.createElement('button');next.textContent='Next question';next.onclick=()=>{index=(index+1)%questions.length;show();};box.appendChild(next);
 }show();
});
