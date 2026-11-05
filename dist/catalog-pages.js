(() => {
  const sets = [
    { name:'Karseell Hair Repair Straightening Kit', price:32.99, rating:4.96, reviews:212, type:'repair', badge:'PRO CARE', images:['assets/essential-2.jpg','assets/essential-4.jpg'] },
    { name:'Karseell Purple Hair Mask + Purple Shampoo Set', price:59.39, rating:4.89, reviews:168, type:'color', badge:'COLOR CARE', images:['assets/collection-purple.png','assets/essential-2.jpg'] },
    { name:'Karseell 3-Piece Hair Moisture & Repair Set', price:66.99, rating:4.98, reviews:536, type:'moisture', badge:'BESTSELLER', images:['assets/editor-1.jpg','assets/essential-2.jpg','assets/essential-4.jpg'] },
    { name:'Karseell Collagen Hair Mask + Shampoo and Conditioner Travel Set', price:25.99, rating:4.97, reviews:393, type:'travel', badge:'TRAVEL SET', images:['assets/editor-1.jpg','assets/essential-2.jpg','assets/essential-4.jpg'] },
    { name:'Karseell Hair Oil + Shampoo and Conditioner Hair Repair Set', price:59.99, rating:4.97, reviews:479, type:'repair', badge:'COMPLETE RITUAL', images:['assets/editor-2.jpg','assets/essential-2.jpg','assets/essential-4.jpg'] },
    { name:'Karseell Collagen Shampoo + Hair Conditioner Set', price:45.99, rating:4.98, reviews:326, type:'moisture', badge:'DUO', images:['assets/essential-2.jpg','assets/essential-4.jpg'] },
    { name:'Karseell Collagen Hair Mask + Hair Shampoo + Argan Oil Set', price:59.99, rating:4.96, reviews:284, type:'repair', badge:'SHINE SET', images:['assets/editor-1.jpg','assets/essential-2.jpg','assets/editor-2.jpg'] },
    { name:'Karseell Collagen Hair Mask + Argan Oil Set', price:43.99, rating:4.98, reviews:419, type:'repair', badge:'2-STEP REPAIR', images:['assets/editor-1.jpg','assets/editor-2.jpg'] }
  ];
  const stars = rating => `<span class="rating-stars" style="--rating:${rating / 5 * 100}%" aria-hidden="true"></span>`;
  const grid = document.getElementById('setGrid');
  if (grid) {
    let filter = new URLSearchParams(location.search).get('filter') === 'bestsellers' ? 'repair' : 'all';
    let sort = new URLSearchParams(location.search).get('filter') === 'bestsellers' ? 'rating' : 'featured';
    document.getElementById('setSort').value = sort;
    const render = () => {
      let visible = filter === 'all' ? [...sets] : sets.filter(item => item.type === filter);
      if (sort === 'rating') visible.sort((a,b) => b.rating-a.rating);
      if (sort === 'low') visible.sort((a,b) => a.price-b.price);
      if (sort === 'high') visible.sort((a,b) => b.price-a.price);
      document.getElementById('setResultCount').textContent = `${visible.length} RESULTS`;
      grid.innerHTML = visible.map(item => `<article class="set-card"><div class="set-badge">${item.badge}</div><a class="set-image" href="product.html">${item.images.map((src,index)=>`<img src="${src}" alt="${index ? '' : item.name}" loading="lazy" decoding="async">`).join('')}</a><div class="set-card-copy"><h2>${item.name}</h2><div class="set-rating" aria-label="${item.rating} out of 5 stars">${stars(item.rating)} <span>${item.rating.toFixed(2)} (${item.reviews})</span></div><div class="set-buy"><strong>$${item.price.toFixed(2)}</strong><button type="button" data-add-cart data-product="${item.name}" data-price="${item.price}">ADD</button></div></div></article>`).join('');
    };
    document.getElementById('setFilter').addEventListener('click',()=>{const panel=document.getElementById('setFilterPanel');panel.hidden=!panel.hidden;});
    document.getElementById('setFilterPanel').addEventListener('click',event=>{const button=event.target.closest('[data-set-filter]');if(!button)return;filter=button.dataset.setFilter;document.querySelectorAll('[data-set-filter]').forEach(item=>item.classList.toggle('is-active',item===button));render();});
    document.getElementById('setSort').addEventListener('change',event=>{sort=event.target.value;render();});
    render();
  }

  const quizStage = document.getElementById('quizStage');
  if (quizStage) {
    const questions = [
      { title:'How would you describe your natural hair type?', key:'type', options:[['Coily','assets/hair-3.jpg'],['Curly','assets/hair-3.jpg'],['Wavy','assets/hair-1.jpg'],['Straight','assets/hair-2.jpg']] },
      { title:'What is your main hair concern?', key:'concern', options:[['Dryness','assets/hair-1.jpg'],['Damage','assets/hair-after.png'],['Frizz','assets/hair-3.jpg'],['Brassiness','assets/collection-purple.png']] },
      { title:'How often is your hair chemically treated?', key:'treatment', options:[['Never','assets/salon-1.jpg'],['Occasionally','assets/salon-2.jpg'],['Often','assets/salon-3.jpg'],['Very often','assets/salon-4.jpg']] },
      { title:'What result matters most to you?', key:'goal', options:[['Deep repair','assets/editor-1.jpg'],['More shine','assets/editor-2.jpg'],['Moisture','assets/essential-4.jpg'],['Color balance','assets/collection-purple.png']] }
    ];
    const answers = {};
    let step = 0;
    const recommended = () => answers.concern === 'Brassiness' ? sets[1] : answers.goal === 'More shine' ? sets[7] : answers.goal === 'Moisture' ? sets[2] : sets[6];
    const renderQuestion = () => {
      const question = questions[step];
      document.getElementById('quizKicker').textContent = `QUESTION ${step+1} OF ${questions.length}`;
      document.getElementById('quizProgress').style.width = `${step / questions.length * 100}%`;
      quizStage.innerHTML = `<h1>${question.title}</h1><div class="quiz-options">${question.options.map(([label,image])=>`<button type="button" data-quiz-answer="${label}"><img src="${image}" alt="" decoding="async"><span>${label}</span></button>`).join('')}</div><button class="quiz-back" type="button" ${step ? '' : 'hidden'}>← Back</button>`;
    };
    const renderResult = () => {
      const item = recommended();
      document.getElementById('quizKicker').textContent = 'YOUR PERSONALIZED ROUTINE';
      document.getElementById('quizProgress').style.width = '100%';
      localStorage.setItem('karseell-hair-quiz-v1',JSON.stringify(answers));
      quizStage.innerHTML = `<div class="quiz-result"><p>Based on your hair profile</p><h1>Meet your Karseell repair ritual</h1><div class="quiz-result-product"><div>${item.images.map(src=>`<img src="${src}" alt="">`).join('')}</div><section><h2>${item.name}</h2><div class="set-rating">${stars(item.rating)} <span>${item.rating.toFixed(2)} (${item.reviews})</span></div><p>A balanced routine selected for your ${answers.type.toLowerCase()} hair and ${answers.concern.toLowerCase()} concern.</p><strong>$${item.price.toFixed(2)}</strong><button type="button" data-add-cart data-product="${item.name}" data-price="${item.price}">ADD TO BAG</button></section></div><button class="quiz-restart" type="button">Retake the quiz</button></div>`;
    };
    quizStage.addEventListener('click',event=>{const answer=event.target.closest('[data-quiz-answer]');if(answer){answers[questions[step].key]=answer.dataset.quizAnswer;step++;step<questions.length?renderQuestion():renderResult();return;}if(event.target.closest('.quiz-back')){step=Math.max(0,step-1);renderQuestion();}if(event.target.closest('.quiz-restart')){step=0;Object.keys(answers).forEach(key=>delete answers[key]);renderQuestion();}});
    renderQuestion();
  }
})();
