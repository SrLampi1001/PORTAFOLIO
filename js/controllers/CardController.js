class CardController {
    static createCard(project, lang = 'en') {
        const card = DOMController.createElement('div', 'col-md-4');
        const name = ProjectModel.getName(project, lang);
        const category = ProjectModel.getCategory(project, lang);
        const thumbnail = ProjectModel.getThumbnail(project);
        const status = ProjectModel.getStatus(project);
        const isIncomplete = status === 'incomplete';
        card.innerHTML = `
            <div class="module-card ${isIncomplete ? 'incomplete' : ''}">
                <img src="${thumbnail}" class="w-100" alt="${name}">
                <span class="card-category">${category}</span>
                ${isIncomplete ? '<span class="card-status">In Progress</span>' : ''}
                <h3 class="card-title text-dark">
                    <a href="./subpages/details.html?id=${ProjectModel.getId(project)}" class="inherit-a">${name}</a>
                </h3>
            </div>
        `;
        return card;
    }

    static createCardHTML(project, lang = 'en') {
        const name = ProjectModel.getName(project, lang);
        const category = ProjectModel.getCategory(project, lang);
        const thumbnail = ProjectModel.getThumbnail(project);
        const status = ProjectModel.getStatus(project);
        const isIncomplete = status === 'incomplete';
        return `
            <div class="col-md-4">
                <div class="module-card ${isIncomplete ? 'incomplete' : ''}">
                    <img src="${thumbnail}" class="w-100" alt="${name}">
                    <span class="card-category">${category}</span>
                    ${isIncomplete ? '<span class="card-status">In Progress</span>' : ''}
                    <h3 class="card-title text-dark">
                        <a href="./subpages/details.html?id=${ProjectModel.getId(project)}" class="inherit-a">${name}</a>
                    </h3>
                </div>
            </div>
        `;
    }

    static renderCards(projects, containerSelector, lang = 'en') {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error(`Container not found: ${containerSelector}`);
            return;
        }
        container.innerHTML = projects.map(project => this.createCardHTML(project, lang)).join('');
    }

    static attachCardListeners(cards) {
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                const link = card.querySelector('a');
                if (link && e.target !== link) {
                    link.click();
                }
            });
        });
    }

    static createEmptyState(containerSelector, message) {
        DOMController.insertHTML(`
            <div class="col-12 text-center py-5">
                <p class="text-muted">${message}</p>
            </div>
        `, containerSelector);
    }
}
