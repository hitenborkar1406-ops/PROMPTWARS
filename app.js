// THE BLIND SPOT - Enhanced Frontend Logic
// Particle background + sophisticated mock AI analysis

// ===== PARTICLE BACKGROUND =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId = null;
const PARTICLE_COUNT = 60;
const MAX_DISTANCE = 140;
const MOUSE_RADIUS = 180;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.size = Math.random() * 1.5 + 0.5;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.color = Math.random() > 0.5 ? '#00d4ff' : '#a78bfa';
  }
  
  update(mouse) {
    this.x += this.vx;
    this.y += this.vy;
    
    if (mouse) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.02;
        this.vx -= (dx / dist) * force;
        this.vy -= (dy / dist) * force;
      }
    }
    
    this.vx *= 0.99;
    this.vy *= 0.99;
    
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < MAX_DISTANCE) {
        const opacity = (1 - dist / MAX_DISTANCE) * 0.12;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = dist < MAX_DISTANCE * 0.5 ? '#00d4ff' : '#7c3aed';
        ctx.globalAlpha = opacity;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}

let mouse = { x: null, y: null };

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(p => {
    p.update(mouse);
    p.draw();
  });
  
  connectParticles();
  animationId = requestAnimationFrame(animateParticles);
}

canvas.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

canvas.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

// Initialize
resizeCanvas();
initParticles();
animateParticles();

// Reduce particles on mobile
if (window.innerWidth < 768) {
  PARTICLE_COUNT = 30;
  initParticles();
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Dismiss">&times;</button>
  `;
  
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.style.animation = 'toastIn 0.3s cubic-bezier(0.4, 0, 1, 1) reverse';
    setTimeout(() => toast.remove(), 300);
  });
  
  container.appendChild(toast);
  
  if (duration > 0) {
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = 'toastIn 0.3s cubic-bezier(0.4, 0, 1, 1) reverse';
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  }
}

// ===== FORM HANDLING =====
const form = document.getElementById('decision-form');
const analyzeBtn = document.getElementById('analyze-btn');
const newAnalysisBtn = document.getElementById('new-analysis-btn');
const resultsSection = document.getElementById('results-section');
const resultsContent = document.getElementById('results-content');
const analysisTimeEl = document.getElementById('analysis-time');
const inputSection = document.getElementById('input-section');

const titleInput = document.getElementById('decision-title');
const contextInput = document.getElementById('decision-context');
const reasoningInput = document.getElementById('decision-reasoning');
const typeSelect = document.getElementById('decision-type');

const titleCount = document.getElementById('title-current');
const contextCount = document.getElementById('context-current');
const reasoningCount = document.getElementById('reasoning-current');

const inputs = [titleInput, contextInput, reasoningInput, typeSelect];

// Character counters
function updateCharCount(input, countEl, max) {
  const len = input.value.length;
  countEl.textContent = len;
  countEl.parentElement.classList.toggle('warning', len > max * 0.8);
  countEl.parentElement.classList.toggle('error', len >= max);
}

titleInput.addEventListener('input', () => updateCharCount(titleInput, titleCount, 100));
contextInput.addEventListener('input', () => updateCharCount(contextInput, contextCount, 2000));
reasoningInput.addEventListener('input', () => updateCharCount(reasoningInput, reasoningCount, 2000));

// Form validation
function checkFormValidity() {
  const allFilled = inputs.every(input => input.value.trim().length > 0);
  analyzeBtn.disabled = !allFilled;
}

inputs.forEach(input => {
  input.addEventListener('input', checkFormValidity);
  input.addEventListener('change', checkFormValidity);
});

// Keyboard shortcut: Ctrl/Cmd + Enter to submit
[contextInput, reasoningInput].forEach(textarea => {
  textarea.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!analyzeBtn.disabled) form.dispatchEvent(new Event('submit'));
    }
  });
});

// ===== ANALYSIS LOGIC =====
form.addEventListener('submit', handleAnalyze);
newAnalysisBtn.addEventListener('click', handleNewAnalysis);

async function handleAnalyze(e) {
  e.preventDefault();
  
  const title = titleInput.value.trim();
  const context = contextInput.value.trim();
  const reasoning = reasoningInput.value.trim();
  const type = typeSelect.value;
  
  if (!title || !context || !reasoning || !type) return;
  
  analyzeBtn.classList.add('loading');
  analyzeBtn.disabled = true;
  
  // Simulate AI processing with variable delay
  const startTime = Date.now();
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  
  const analysis = generateMockAnalysis(title, context, reasoning, type);
  renderResults(analysis);
  
  analyzeBtn.classList.remove('loading');
  resultsSection.hidden = false;
  inputSection.hidden = true;
  
  analysisTimeEl.textContent = `Analyzed in ${elapsed}s • ${type.charAt(0).toUpperCase() + type.slice(1)} decision`;
  
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  showToast('Analysis complete! Review your blind spots.', 'success');
}

function handleNewAnalysis() {
  form.reset();
  inputs.forEach(input => {
    const countEl = input.id === 'decision-title' ? titleCount :
                    input.id === 'decision-context' ? contextCount :
                    input.id === 'decision-reasoning' ? reasoningCount : null;
    if (countEl) {
      countEl.textContent = '0';
      countEl.parentElement.classList.remove('warning', 'error');
    }
  });
  checkFormValidity();
  resultsSection.hidden = true;
  inputSection.hidden = false;
  resultsContent.innerHTML = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast('Ready for a new decision.', 'info');
}

// ===== MOCK AI ANALYSIS =====
function generateMockAnalysis(title, context, reasoning, type) {
  const lowerReasoning = reasoning.toLowerCase();
  const lowerContext = context.toLowerCase();
  const combined = (context + ' ' + reasoning).toLowerCase();
  const wordCount = reasoning.split(/\s+/).length;
  
  const categories = [
    {
      id: 'assumptions',
      icon: '🤔',
      title: 'Unstated Assumptions',
      colorClass: 'assumptions',
      items: []
    },
    {
      id: 'overlooked',
      icon: '🔍',
      title: 'Potentially Overlooked Factors',
      colorClass: 'overlooked',
      items: []
    },
    {
      id: 'conflicts',
      icon: '⚡',
      title: 'Internal Conflicts',
      colorClass: 'conflicts',
      items: []
    },
    {
      id: 'questions',
      icon: '❓',
      title: 'Critical Questions to Ask',
      colorClass: 'questions',
      items: []
    },
    {
      id: 'bias',
      icon: '🧠',
      title: 'Possible Cognitive Biases',
      colorClass: 'bias',
      items: []
    }
  ];
  
  // ===== ASSUMPTIONS =====
  const assumptionPatterns = [
    { 
      detect: lowerReasoning.includes('good stipend') || lowerReasoning.includes('high pay') || lowerReasoning.includes('money') || lowerReasoning.includes('salary'),
      label: 'Financial Priority Assumption',
      text: 'You\'re weighting compensation heavily. Are you assuming money equals satisfaction or long-term value? What if the role drains you?'
    },
    { 
      detect: lowerReasoning.includes('close to home') || lowerReasoning.includes('nearby') || lowerReasoning.includes('convenient') || lowerReasoning.includes('short commute'),
      label: 'Convenience Assumption',
      text: 'Proximity is nice, but are you assuming it outweighs growth opportunities further away? Convenience can be a trap.'
    },
    { 
      detect: lowerReasoning.includes('experience') || lowerReasoning.includes('industry') || lowerReasoning.includes('resume') || lowerReasoning.includes('cv') || lowerReasoning.includes('portfolio'),
      label: 'Experience Quality Assumption',
      text: 'You assume any industry experience is valuable. What if the mentorship is poor, the work is menial, or you learn bad practices?'
    },
    { 
      detect: lowerReasoning.includes('prestige') || lowerReasoning.includes('brand') || lowerReasoning.includes('reputation') || lowerReasoning.includes('name'),
      label: 'Prestige Assumption',
      text: 'Brand name ≠ good experience. Many prestigious places exploit junior talent. What\'s the actual day-to-day?'
    },
    { 
      detect: lowerReasoning.includes('stable') || lowerReasoning.includes('secure') || lowerReasoning.includes('safe'),
      label: 'Stability Assumption',
      text: 'You\'re valuing security. But in a changing world, "stable" roles can become obsolete fastest. What\'s the adaptation risk?'
    },
    { 
      detect: lowerReasoning.includes('passion') || lowerReasoning.includes('love') || lowerReasoning.includes('dream'),
      label: 'Passion Assumption',
      text: 'Passion is real but can blind you to practical constraints. Are you ignoring red flags because "it\'s my dream"?'
    }
  ];
  
  assumptionPatterns.forEach(p => {
    if (p.detect) categories[0].items.push({ label: p.label, text: p.text });
  });
  
  if (categories[0].items.length === 0) {
    categories[0].items.push({ 
      label: 'Identify Your Assumptions', 
      text: 'What are you taking for granted? List 3 things that must be true for your reasoning to hold. Then question each one.' 
    });
  }
  
  // ===== OVERLOOKED FACTORS =====
  const overlookedChecks = [
    {
      check: !lowerContext.includes('academic') && !lowerContext.includes('study') && !lowerContext.includes('grade') && !lowerContext.includes('course') && !lowerContext.includes('gpa') && type === 'education',
      label: 'Academic Impact',
      text: 'How will 40+ hours/week affect your coursework, grades, graduation timeline, and scholarship eligibility?'
    },
    {
      check: !lowerContext.includes('mentor') && !lowerContext.includes('learn') && !lowerContext.includes('growth') && !lowerContext.includes('develop') && !lowerContext.includes('senior') && !lowerContext.includes('guide'),
      label: 'Learning & Mentorship Quality',
      text: 'Who will you learn from? Is there structured mentorship, code reviews, design critiques — or just task execution?'
    },
    {
      check: !lowerContext.includes('burnout') && !lowerContext.includes('health') && !lowerContext.includes('balance') && !lowerContext.includes('stress') && !lowerContext.includes('sleep'),
      label: 'Burnout & Wellbeing Risk',
      text: 'Combining full-time work with other commitments is intense. What\'s your recovery plan? What happens if you get sick?'
    },
    {
      check: !lowerContext.includes('long-term') && !lowerContext.includes('career') && !lowerContext.includes('future') && !lowerContext.includes('5 year') && !lowerContext.includes('trajectory'),
      label: 'Long-term Career Alignment',
      text: 'Does this role actually advance your target career path, or just check a box? Will the skills transfer?'
    },
    {
      check: !lowerContext.includes('opportunity cost') && !lowerContext.includes('alternative') && !lowerContext.includes('other') && !lowerContext.includes('instead') && !lowerContext.includes('give up'),
      label: 'Opportunity Cost',
      text: 'What are you giving up? Research, side projects, other internships, networking, certifications, rest, relationships?'
    },
    {
      check: !lowerContext.includes('culture') && !lowerContext.includes('team') && !lowerContext.includes('manager') && !lowerContext.includes('values') && !lowerContext.includes('environment'),
      label: 'Team Culture & Manager Fit',
      text: 'Your manager and team culture determine 80% of your experience. What do Glassdoor/Blind/former interns say?'
    },
    {
      check: !lowerContext.includes('equity') && !lowerContext.includes('stock') && !lowerContext.includes('ownership') && !lowerContext.includes('upside') && type === 'career',
      label: 'Financial Upside Beyond Salary',
      text: 'For early-career roles, equity/learning/network often compound more than base pay. What\'s the 5-year value?'
    },
    {
      check: !lowerContext.includes('remote') && !lowerContext.includes('hybrid') && !lowerContext.includes('office') && !lowerContext.includes('flex'),
      label: 'Work Arrangement Flexibility',
      text: 'Remote/hybrid affects your life significantly. Is the policy written, enforced, and culture-supported?'
    }
  ];
  
  overlookedChecks.forEach(c => {
    if (c.check) categories[1].items.push({ label: c.label, text: c.text });
  });
  
  // Add type-specific overlooked factors
  if (type === 'finance') {
    categories[1].items.push({ 
      label: 'Risk-Adjusted Returns', 
      text: 'Are you comparing apples to apples? A 10% guaranteed return beats 15% with high volatility for short horizons.' 
    });
    categories[1].items.push({ 
      label: 'Liquidity Needs', 
      text: 'When will you need this money? Illiquid investments can force fire sales at the worst time.' 
    });
  }
  
  if (type === 'relationship') {
    categories[1].items.push({ 
      label: 'Values Alignment', 
      text: 'Shared values predict long-term compatibility better than shared interests. What are your non-negotiables?' 
    });
  }
  
  // ===== CONFLICTS =====
  const conflictPatterns = [
    {
      detect: (lowerReasoning.includes('money') || lowerReasoning.includes('pay') || lowerReasoning.includes('stipend')) && 
              (lowerContext.includes('study') || lowerContext.includes('grade') || lowerContext.includes('academic')),
      label: 'Money vs. Academics',
      text: 'You value the compensation but also need academic performance. These directly compete for your finite time and energy.'
    },
    {
      detect: (lowerReasoning.includes('experience') || lowerReasoning.includes('growth') || lowerReasoning.includes('learn')) && 
              (lowerReasoning.includes('convenient') || lowerReasoning.includes('easy') || lowerReasoning.includes('comfort') || lowerReasoning.includes('close')),
      label: 'Growth vs. Comfort',
      text: 'You want career growth but cite convenience as a top reason. Meaningful growth usually requires discomfort and stretch.'
    },
    {
      detect: (lowerReasoning.includes('short') || lowerReasoning.includes('immediate') || lowerReasoning.includes('now') || lowerReasoning.includes('quick')) && 
              (lowerReasoning.includes('long') || lowerReasoning.includes('future') || lowerReasoning.includes('career') || lowerReasoning.includes('eventual')),
      label: 'Short-term vs. Long-term',
      text: 'Your reasoning references both immediate gains and future benefits. Which actually drives you? The gap reveals uncertainty.'
    },
    {
      detect: (lowerReasoning.includes('passion') || lowerReasoning.includes('love') || lowerReasoning.includes('interest')) && 
              (lowerReasoning.includes('practical') || lowerReasoning.includes('realistic') || lowerReasoning.includes('responsible') || lowerReasoning.includes('stable')),
      label: 'Passion vs. Practicality',
      text: 'You\'re torn between what excites you and what\'s "smart." This tension often means you haven\'t found the intersection yet.'
    },
    {
      detect: (lowerReasoning.includes('autonomy') || lowerReasoning.includes('freedom') || lowerReasoning.includes('flexible') || lowerReasoning.includes('own')) && 
              (lowerReasoning.includes('structure') || lowerReasoning.includes('guidance') || lowerReasoning.includes('mentor') || lowerReasoning.includes('support')),
      label: 'Autonomy vs. Support',
      text: 'You want independence but also mentorship. These can coexist but require intentional structure. Which do you need more right now?'
    }
  ];
  
  conflictPatterns.forEach(c => {
    if (c.detect) categories[2].items.push({ label: c.label, text: c.text });
  });
  
  if (categories[2].items.length === 0) {
    categories[2].items.push({ 
      label: 'Search for Tensions', 
      text: 'Look for contradictions between your stated priorities and your actual motivations. Where do you say one thing but optimize for another?' 
    });
  }
  
  // ===== QUESTIONS =====
  const questionTemplates = [
    { label: 'What would change your mind?', text: 'Identify specific conditions that would flip your decision. This reveals your true decision criteria.' },
    { label: 'What\'s the worst realistic case?', text: 'If this goes badly (toxic manager, failing grades, burnout, skills atrophy), can you recover? What\'s the actual cost?' },
    { label: 'What are you not seeing?', text: 'Ask someone who\'s done this: "What surprised you? What do you wish you knew going in? Would you do it again?"' },
    { label: 'Decide in 10 minutes vs 10 days', text: 'If you had to decide right now, what would you choose? If you had a month? The difference reveals your uncertainty.' },
    { label: 'What would you advise a friend?', text: 'We give better advice to others than ourselves. If a peer had your exact situation, what would you tell them?' },
    { label: 'What does "good" look like in 6 months?', text: 'Define success concretely. Then ask: does this path reliably get you there? What could derail it?' },
    { label: 'What\'s the cost of delay?', text: 'Is waiting actually safer, or just more comfortable? Some opportunities have expiration dates.' },
    { label: 'Are you optimizing for the right metric?', text: 'You\'re optimizing for X (money, convenience, prestige). Is X actually a proxy for what you truly want (freedom, impact, mastery)?' }
  ];
  
  // Add 5-6 questions
  const shuffled = questionTemplates.sort(() => 0.5 - Math.random());
  shuffled.slice(0, 6).forEach(q => categories[3].items.push(q));
  
  // ===== BIASES =====
  const biasPatterns = [
    {
      detect: lowerReasoning.includes('good') && (lowerReasoning.includes('stipend') || lowerReasoning.includes('pay') || lowerReasoning.includes('salary') || lowerReasoning.includes('money')),
      label: 'Salience Bias',
      text: 'The stipend is concrete and visible. Harder-to-measure factors (mentorship quality, culture, long-term trajectory) get less weight because they\'re less salient.'
    },
    {
      detect: lowerReasoning.includes('close') || lowerReasoning.includes('near') || lowerReasoning.includes('convenient'),
      label: 'Availability Heuristic',
      text: 'Proximity is easy to evaluate. You may overvalue it because it\'s cognitively available, while undervaluing remote options with better outcomes.'
    },
    {
      detect: lowerReasoning.includes('everyone') || lowerReasoning.includes('people say') || lowerReasoning.includes('common') || lowerReasoning.includes('standard') || lowerReasoning.includes('normal') || lowerReasoning.includes('typical'),
      label: 'Social Proof / Bandwagon Effect',
      text: 'Basing decisions on what others do ignores your unique context, goals, and risk tolerance. The crowd is often wrong.'
    },
    {
      detect: lowerReasoning.includes('always') || lowerReasoning.includes('never') || lowerReasoning.includes('must') || lowerReasoning.includes('have to') || lowerReasoning.includes('only way'),
      label: 'Black-and-White Thinking',
      text: 'Absolute language suggests rigid thinking. Real decisions usually have nuance, trade-offs, and creative third options.'
    },
    {
      detect: lowerReasoning.includes('invested') || lowerReasoning.includes('spent') || lowerReasoning.put('time') || lowerReasoning.includes('effort') || lowerReasoning.includes('already'),
      label: 'Sunk Cost Fallacy',
      text: 'Past investment shouldn\'t drive future decisions. Ask: "If I weren\'t already involved, would I start now?"'
    },
    {
      detect: lowerReasoning.includes('sure') || lowerReasoning.includes('certain') || lowerReasoning.includes('guaranteed') || lowerReasoning.includes('definitely') || lowerReasoning.includes('obviously'),
      label: 'Overconfidence Bias',
      text: 'Certainty is a feeling, not a fact. The more certain you feel, the more you should stress-test your assumptions.'
    },
    {
      detect: lowerReasoning.includes('recent') || lowerReasoning.includes('latest') || lowerReasoning.includes('just') || lowerReasoning.includes('new'),
      label: 'Recency Bias',
      text: 'Recent events weigh disproportionately. Zoom out: does the long-term pattern support your conclusion?'
    },
    {
      detect: lowerReasoning.includes('similar') || lowerReasoning.includes('like') || lowerReasoning.includes('remind') || lowerReasoning.includes('pattern'),
      label: 'Representativeness Heuristic',
      text: 'This situation "looks like" a past one, so you assume the outcome will match. Context differences matter enormously.'
    }
  ];
  
  biasPatterns.forEach(b => {
    if (b.detect) categories[4].items.push({ label: b.label, text: b.text });
  });
  
  if (categories[4].items.length === 0) {
    categories[4].items.push({ 
      label: 'Confirmation Bias', 
      text: 'Notice if you\'re seeking info that supports your lean and dismissing concerns. Actively search for disconfirming evidence.' 
    });
    categories[4].items.push({ 
      label: 'Present Bias', 
      text: 'Overweighting immediate rewards (stipend, convenience, comfort) vs. delayed benefits (skills, network, compound growth).' 
    });
    categories[4].items.push({ 
      label: 'Anchoring', 
      text: 'Your first piece of info (the stipend, the brand name) anchors your judgment. What would you think without that anchor?' 
    });
  }
  
  // Limit items per category for readability
  categories.forEach(cat => {
    cat.items = cat.items.slice(0, 5);
  });
  
  return categories;
}

// ===== RENDER RESULTS =====
function renderResults(categories) {
  resultsContent.innerHTML = '';
  
  categories.forEach(category => {
    if (category.items.length === 0) return;
    
    const div = document.createElement('div');
    div.className = 'result-category';
    div.dataset.category = category.id;
    
    div.innerHTML = `
      <div class="category-header">
        <span class="category-icon ${category.colorClass}" aria-hidden="true">${category.icon}</span>
        <span class="category-title">${category.title}</span>
        <span class="category-count">${category.items.length} insights</span>
      </div>
      <div class="category-items">
        ${category.items.map((item, idx) => `
          <div class="category-item" style="animation-delay: ${idx * 0.05}s;">
            <strong>${item.label}</strong>
            ${item.text}
          </div>
        `).join('')}
      </div>
    `;
    
    resultsContent.appendChild(div);
  });
  
  // Stagger animation
  const items = resultsContent.querySelectorAll('.category-item');
  items.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.animation = `slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.04}s forwards`;
  });
}

// Add keyframe for item animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Focus first input
  titleInput.focus();
  
  // Check for URL params (e.g., ?example=internship)
  const params = new URLSearchParams(window.location.search);
  if (params.has('example')) {
    loadExample(params.get('example'));
  }
});

function loadExample(type) {
  const examples = {
    internship: {
      title: 'Accept 6-month software engineering internship',
      type: 'career',
      context: 'Stipend: $8,000/month. Location: 20 min from home. Hours: 9-6, Mon-Fri. Role: Full-stack dev on internal tools. Team: 5 engineers, 1 senior mentor. College: Final semester, 12 credits remaining. Timeline: Starts in 3 weeks.',
      reasoning: 'The stipend is really good and would cover my loans. The company is close to home so no relocation stress. It\'ll give me industry experience for my resume. Mainly considering it because the pay is good, it\'s convenient, and I need experience.'
    },
    masters: {
      title: 'Pursue Master\'s degree abroad',
      type: 'education',
      context: 'Program: 2-year MS in CS at mid-tier US university. Cost: $60k/year tuition + living. Funding: Partial scholarship ($15k/year). Alternative: Stay in current job ($80k/yr). Timeline: Apply by Dec, start Fall.',
      reasoning: 'Everyone says a Master\'s opens doors. The brand name helps with visas. I\'ve always wanted to study abroad. My parents support it. Mainly considering because it\'s the standard path and the degree is prestigious.'
    },
    startup: {
      title: 'Join early-stage startup as founding engineer',
      type: 'career',
      context: 'Equity: 1.5%. Salary: $90k (vs $150k market). Stage: Pre-seed, 3 people. Runway: 18 months. Role: Build entire product. Hours: 60+/week. Learning: Extreme. Risk: High failure rate.',
      reasoning: 'The equity could be life-changing. I\'ll learn more in 1 year than 5 at big corp. I\'m young with no dependents. The founder is smart. Mainly considering because the upside is huge and I want autonomy.'
    }
  };
  
  const ex = examples[type];
  if (ex) {
    titleInput.value = ex.title;
    typeSelect.value = ex.type;
    contextInput.value = ex.context;
    reasoningInput.value = ex.reasoning;
    
    updateCharCount(titleInput, titleCount, 100);
    updateCharCount(contextInput, contextCount, 2000);
    updateCharCount(reasoningInput, reasoningCount, 2000);
    checkFormValidity();
    
    showToast(`Loaded "${type}" example`, 'info');
  }
}

// ===== EXPORT FOR CONSOLE DEBUGGING =====
window.THE_BLIND_SPOT = {
  generateMockAnalysis,
  showToast,
  loadExample,
  particles
};

// Add example links to console
console.log('%c🔍 THE BLIND SPOT', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #00d4ff, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%cTry: THE_BLIND_SPOT.loadExample("internship")', 'color: #00d4ff; font-size: 14px;');
console.log('%cOr: THE_BLIND_SPOT.loadExample("masters")', 'color: #a78bfa; font-size: 14px;');
console.log('%cOr: THE_BLIND_SPOT.loadExample("startup")', 'color: #fbbf24; font-size: 14px;');