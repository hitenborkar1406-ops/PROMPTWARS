// THE BLIND SPOT - Frontend Logic
// Simulates AI analysis for demo purposes

const analyzeBtn = document.getElementById('analyze-btn');
const newAnalysisBtn = document.getElementById('new-analysis-btn');
const resultsSection = document.getElementById('results-section');
const resultsContent = document.getElementById('results-content');
const decisionTitle = document.getElementById('decision-title');
const decisionContext = document.getElementById('decision-context');
const decisionReasoning = document.getElementById('decision-reasoning');

const inputs = [decisionTitle, decisionContext, decisionReasoning];

inputs.forEach(input => {
  input.addEventListener('input', checkFormValidity);
});

function checkFormValidity() {
  const allFilled = inputs.every(input => input.value.trim().length > 0);
  analyzeBtn.disabled = !allFilled;
}

analyzeBtn.addEventListener('click', handleAnalyze);
newAnalysisBtn.addEventListener('click', handleNewAnalysis);

async function handleAnalyze() {
  const title = decisionTitle.value.trim();
  const context = decisionContext.value.trim();
  const reasoning = decisionReasoning.value.trim();

  if (!title || !context || !reasoning) return;

  analyzeBtn.classList.add('loading');
  analyzeBtn.disabled = true;

  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const analysis = generateMockAnalysis(title, context, reasoning);
  renderResults(analysis);

  analyzeBtn.classList.remove('loading');
  resultsSection.hidden = false;
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleNewAnalysis() {
  inputs.forEach(input => input.value = '');
  checkFormValidity();
  resultsSection.hidden = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generateMockAnalysis(title, context, reasoning) {
  const lowerReasoning = reasoning.toLowerCase();
  const lowerContext = context.toLowerCase();
  const combined = (context + ' ' + reasoning).toLowerCase();

  const categories = [
    {
      id: 'assumptions',
      icon: '🤔',
      title: 'Unstated Assumptions',
      color: 'assumptions',
      items: []
    },
    {
      id: 'overlooked',
      icon: '🔍',
      title: 'Potentially Overlooked Factors',
      color: 'overlooked',
      items: []
    },
    {
      id: 'conflicts',
      icon: '⚡',
      title: 'Internal Conflicts',
      color: 'conflicts',
      items: []
    },
    {
      id: 'questions',
      icon: '❓',
      title: 'Critical Questions to Ask',
      color: 'questions',
      items: []
    },
    {
      id: 'bias',
      icon: '🧠',
      title: 'Possible Cognitive Biases',
      color: 'bias',
      items: []
    }
  ];

  // Assumptions detection
  if (lowerReasoning.includes('good stipend') || lowerReasoning.includes('high pay') || lowerReasoning.includes('money')) {
    categories[0].items.push({
      label: 'Financial Priority Assumption',
      text: 'You\'re weighting compensation heavily. Are you assuming money equals satisfaction or long-term value?'
    });
  }
  if (lowerReasoning.includes('close to home') || lowerReasoning.includes('nearby') || lowerReasoning.includes('convenient')) {
    categories[0].items.push({
      label: 'Convenience Assumption',
      text: 'Proximity is nice, but are you assuming it outweighs growth opportunities further away?'
    });
  }
  if (lowerReasoning.includes('experience') || lowerReasoning.includes('industry') || lowerReasoning.includes('resume')) {
    categories[0].items.push({
      label: 'Experience Quality Assumption',
      text: 'You assume any industry experience is valuable. What if the mentorship is poor or the work is menial?'
    });
  }
  if (categories[0].items.length === 0) {
    categories[0].items.push({
      label: 'General Assumptions',
      text: 'Identify what you\'re taking for granted. What must be true for your reasoning to hold?'
    });
  }

  // Overlooked factors
  if (!lowerContext.includes('academic') && !lowerContext.includes('study') && !lowerContext.includes('grade') && !lowerContext.includes('course')) {
    categories[1].items.push({
      label: 'Academic Impact',
      text: 'How will 40+ hours/week affect your coursework, grades, and graduation timeline?'
    });
  }
  if (!lowerContext.includes('mentor') && !lowerContext.includes('learn') && !lowerContext.includes('growth')) {
    categories[1].items.push({
      label: 'Learning & Mentorship Quality',
      text: 'Who will you learn from? Is there structured mentorship or just task execution?'
    });
  }
  if (!lowerContext.includes('burnout') && !lowerContext.includes('health') && !lowerContext.includes('balance')) {
    categories[1].items.push({
      label: 'Burnout & Wellbeing Risk',
      text: 'Combining full-time work with college is intense. What\'s your recovery plan?'
    });
  }
  if (!lowerContext.includes('long-term') && !lowerContext.includes('career') && !lowerContext.includes('future')) {
    categories[1].items.push({
      label: 'Long-term Career Alignment',
      text: 'Does this role actually advance your target career path, or just check a box?'
    });
  }
  if (!lowerContext.includes('opportunity cost') && !lowerContext.includes('alternative') && !lowerContext.includes('other')) {
    categories[1].items.push({
      label: 'Opportunity Cost',
      text: 'What are you giving up? Research, projects, other internships, networking, rest?'
    });
  }

  // Conflicts
  if (lowerReasoning.includes('money') && (lowerContext.includes('study') || lowerContext.includes('grade'))) {
    categories[2].items.push({
      label: 'Money vs. Academics',
      text: 'You value the stipend but also need academic performance. These directly compete for time.'
    });
  }
  if (lowerReasoning.includes('experience') && (lowerReasoning.includes('convenient') || lowerReasoning.includes('easy'))) {
    categories[2].items.push({
      label: 'Growth vs. Comfort',
      text: 'You want career growth but cite convenience as a top reason. Growth usually requires discomfort.'
    });
  }
  if (lowerReasoning.includes('short') && lowerReasoning.includes('long')) {
    categories[2].items.push({
      label: 'Short-term vs. Long-term',
      text: 'Your reasoning references both immediate gains and future benefits. Which actually drives you?'
    });
  }
  if (categories[2].items.length === 0) {
    categories[2].items.push({
      label: 'Check for Conflicts',
      text: 'Look for tensions between your stated priorities and your actual motivations.'
    });
  }

  // Questions
  categories[3].items.push({
    label: 'What would change your mind?',
    text: 'Identify specific conditions that would flip your decision. This reveals your true criteria.'
  });
  categories[3].items.push({
    label: 'What\'s the worst case?',
    text: 'If this goes badly (bad mentor, failing grades, burnout), can you recover? What\'s the cost?'
  });
  categories[3].items.push({
    label: 'What are you not seeing?',
    text: 'Ask someone who\'s done this: "What surprised you? What do you wish you knew?"'
  });
  categories[3].items.push({
    label: 'Decide in 10 minutes vs 10 days',
    text: 'If you had to decide right now, what would you choose? If you had a month? The difference reveals uncertainty.'
  });

  // Biases
  if (lowerReasoning.includes('good') && (lowerReasoning.includes('stipend') || lowerReasoning.includes('pay'))) {
    categories[4].items.push({
      label: 'Salience Bias',
      text: 'The stipend is concrete and visible. Harder-to-measure factors (mentorship quality, culture) get less weight.'
    });
  }
  if (lowerReasoning.includes('close') || lowerReasoning.includes('near')) {
    categories[4].items.push({
      label: 'Availability Heuristic',
      text: 'Proximity is easy to evaluate. You may overvalue it because it\'s cognitively available.'
    });
  }
  if (lowerReasoning.includes('everyone') || lowerReasoning.includes('people say') || lowerReasoning.includes('common')) {
    categories[4].items.push({
      label: 'Social Proof',
      text: 'Basing decisions on what others do ignores your unique context and goals.'
    });
  }
  if (lowerReasoning.includes('always') || lowerReasoning.includes('never') || lowerReasoning.includes('must')) {
    categories[4].items.push({
      label: 'Black-and-White Thinking',
      text: 'Absolute language suggests rigid thinking. Real decisions usually have nuance.'
    });
  }
  if (categories[4].items.length === 0) {
    categories[4].items.push({
      label: 'Confirmation Bias',
      text: 'Notice if you\'re seeking info that supports your lean and dismissing concerns.'
    });
    categories[4].items.push({
      label: 'Present Bias',
      text: 'Overweighting immediate rewards (stipend, convenience) vs. delayed benefits (skills, network).'
    });
  }

  return categories;
}

function renderResults(categories) {
  resultsContent.innerHTML = '';

  categories.forEach(category => {
    if (category.items.length === 0) return;

    const div = document.createElement('div');
    div.className = 'result-category';
    div.innerHTML = `
      <div class="category-header">
        <span class="category-icon ${category.color}">${category.icon}</span>
        <span class="category-title">${category.title}</span>
      </div>
      <div class="category-items">
        ${category.items.map(item => `
          <div class="category-item">
            <strong>${item.label}</strong>
            ${item.text}
          </div>
        `).join('')}
      </div>
    `;
    resultsContent.appendChild(div);
  });
}

// Keyboard shortcut: Enter in textarea with Ctrl/Cmd submits
[decisionContext, decisionReasoning].forEach(textarea => {
  textarea.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (!analyzeBtn.disabled) handleAnalyze();
    }
  });
});