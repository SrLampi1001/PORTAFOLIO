class ComponentController {
    static createComponentItem(component, lang = 'en') {
        const item = DOMController.createElement('div', 'component-item mb-3');
        const iconClass = ComponentModel.getIconClass(component);
        const details = ComponentModel.getDetails(component, lang);
        const type = ComponentModel.getType(component);
        const name = ComponentModel.getName(component);
        item.innerHTML = `
            <div class="d-flex align-items-start gap-3">
                <i class="fas ${iconClass} text-primary mt-1"></i>
                <div>
                    <strong>${name}</strong>
                    <span class="badge bg-secondary ms-2">${type}</span>
                    <p class="text-muted mb-0 small">${details}</p>
                </div>
            </div>
        `;
        return item;
    }

    static createComponentItemHTML(component, lang = 'en') {
        const iconClass = ComponentModel.getIconClass(component);
        const details = ComponentModel.getDetails(component, lang);
        const type = ComponentModel.getType(component);
        const name = ComponentModel.getName(component);
        return `
            <div class="component-item mb-3">
                <div class="d-flex align-items-start gap-3">
                    <i class="fas ${iconClass} text-primary mt-1"></i>
                    <div>
                        <strong>${name}</strong>
                        <span class="badge bg-secondary ms-2">${type}</span>
                        <p class="text-muted mb-0 small">${details}</p>
                    </div>
                </div>
            </div>
        `;
    }

    static createComponentList(components, lang = 'en') {
        const container = DOMController.createElement('div', 'component-list');
        components.forEach(component => {
            container.insertAdjacentHTML('beforeend', this.createComponentItemHTML(component, lang));
        });
        return container;
    }

    static renderComponentList(project, containerSelector, lang = 'en') {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error(`Container not found: ${containerSelector}`);
            return;
        }
        const components = ProjectModel.getComponents(project);
        container.innerHTML = components.map(c => this.createComponentItemHTML(c, lang)).join('');
    }

    static createTechBadge(tech) {
        return DOMController.createElement('span', 'badge bg-info me-1', {}, tech.name);
    }

    static renderTechList(project, containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error(`Container not found: ${containerSelector}`);
            return;
        }
        const techs = ProjectModel.getTechs(project);
        container.innerHTML = techs.map(tech =>
            `<span class="badge bg-info me-1">${tech.name}</span>`
        ).join('');
    }
}
