document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('projects-grid');
  const searchInput = document.getElementById('project-search');
  const filterChips = document.querySelectorAll('.filter-chip');
  const noResults = document.getElementById('no-results');

  // Parse URL for initial tag
  const urlParams = new URLSearchParams(window.location.search);
  const initialTag = urlParams.get('tag');

  let currentFilter = 'All';
  let currentSearch = '';

  // Initialize
  if (initialTag) {
    currentFilter = initialTag;
    // Update active state of buttons if one matches exactly
    let matched = false;
    filterChips.forEach(chip => {
      chip.classList.remove('active');
      if (chip.dataset.filter === initialTag) {
        chip.classList.add('active');
        matched = true;
      }
    });
    // If we came from a custom tag not in the standard sidebar list, 
    // we could dynamically add a button for it, or just keep 'All' visually unselected.
    // For simplicity, we just filter the data.
  }

  function renderProjects() {
    grid.innerHTML = '';
    let matchCount = 0;

    const lowerSearch = currentSearch.toLowerCase();

    projectsData.forEach(p => {
      // Check search
      const matchesSearch = p.title.toLowerCase().includes(lowerSearch) || 
                            p.description.toLowerCase().includes(lowerSearch);

      // Check filter
      let matchesFilter = false;
      if (currentFilter === 'All') {
        matchesFilter = true;
      } else {
        const allTags = [...(p.topics || []), ...(p.software || [])];
        matchesFilter = allTags.includes(currentFilter);
      }

      if (matchesSearch && matchesFilter) {
        matchCount++;

        const card = document.createElement('a');
        card.href = p.url;
        card.className = 'card';
        card.style.animation = 'fadeInPage 0.5s ease forwards';
        
        card.innerHTML = `
          <img src="${p.image}" alt="${p.title}">
          <div class="card-caption">
            <p class="card-subtitle">${(p.topics && p.topics.length > 0) ? p.topics[0] : 'Project'}</p>
            <h3>${p.title}</h3>
            <div class="card-details">
              <p style="margin-bottom: 0;">${p.description}</p>
            </div>
          </div>
        `;
        
        grid.appendChild(card);
      }
    });

    if (matchCount === 0) {
      noResults.style.display = 'block';
    } else {
      noResults.style.display = 'none';
    }
  }

  // Event Listeners
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderProjects();
  });

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      
      // Update URL without reloading (optional enhancement for sharing links)
      const newUrl = currentFilter === 'All' 
        ? window.location.pathname 
        : `${window.location.pathname}?tag=${encodeURIComponent(currentFilter)}`;
      window.history.pushState({path: newUrl}, '', newUrl);

      renderProjects();
    });
  });

  // Initial render
  renderProjects();
});
