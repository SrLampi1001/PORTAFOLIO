const DATA_PATH = './media/data/projects.json';

let projectIndex = null;
let currentLang = 'en';

async function initPortfolio() {
    try {
        const projects = await GetterService.getProjects(DATA_PATH);
        projectIndex = IndexerService.buildIndex(projects);
        renderProjects(projects);
        initSearch();
    } catch (error) {
        console.error('Failed to initialize portfolio:', error);
        showErrorMessage();
    }
}

function renderProjects(projects, lang = currentLang) {
    const container = document.querySelector('#projects-container');
    if (!container) return;
    
    if (projects.length === 0) {
        container.innerHTML = '<p class="text-muted">No projects found.</p>';
        return;
    }
    
    CardController.renderCards(projects, '#projects-container', lang);
}

function initSearch() {
    const searchInput = document.querySelector('#search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        const results = SearchService.search(projectIndex.all, query, currentLang);
        renderProjects(results);
    });
}

function showErrorMessage() {
    const container = document.querySelector('#projects-container');
    if (container) {
        container.innerHTML = '<p class="text-danger">Failed to load projects. Please try again later.</p>';
    }
}

function changeLanguage(lang) {
    currentLang = lang;
    if (projectIndex) {
        renderProjects(projectIndex.all);
    }
}

document.addEventListener('DOMContentLoaded', initPortfolio);
