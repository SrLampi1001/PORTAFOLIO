class BreadcrumbController {
    static createPath(pathArray) {
        const breadcrumb = DOMController.createElement('nav', 'breadcrumb');
        breadcrumb.setAttribute('aria-label', 'breadcrumb');
        const ol = DOMController.createElement('ol', 'breadcrumb');
        pathArray.forEach((item, index) => {
            const li = DOMController.createElement('li', 'breadcrumb-item');
            if (item.href) {
                const a = DOMController.createElement('a', '', { href: item.href });
                a.textContent = item.label;
                li.appendChild(a);
            } else {
                li.textContent = item.label;
                li.setAttribute('aria-current', 'page');
            }
            ol.appendChild(li);
        });
        breadcrumb.appendChild(ol);
        return breadcrumb;
    }

    static addCrumb(label, href = null) {
        return { label, href };
    }

    static render(containerSelector, pathArray) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error(`Container not found: ${containerSelector}`);
            return;
        }
        container.innerHTML = '';
        const breadcrumb = this.createPath(pathArray);
        container.appendChild(breadcrumb);
    }

    static buildFromProject(project, lang = 'en') {
        const path = [
            this.addCrumb('Home', '../../index.html'),
            this.addCrumb(ProjectModel.getCategory(project, lang)),
            this.addCrumb(ProjectModel.getName(project, lang))
        ];
        return path;
    }

    static buildFromCategory(category, basePath = 'index.html') {
        return [
            this.addCrumb('Home', basePath),
            this.addCrumb(category)
        ];
    }
}
