class IndexerService {
    static buildIndex(projects) {
        const index = {
            byId: new Map(),
            byCategory: new Map(),
            byTech: new Map(),
            byStatus: new Map(),
            all: projects
        };
        projects.forEach(project => {
            this.addToIndex(project, index);
        });
        return index;
    }

    static addToIndex(project, index = null) {
        if (!index) {
            return;
        }
        index.byId.set(ProjectModel.getId(project), project);
        const categories = [project.category, project.category_es].filter(Boolean);
        categories.forEach(cat => {
            if (!index.byCategory.has(cat)) {
                index.byCategory.set(cat, []);
            }
            index.byCategory.get(cat).push(project);
        });
        ProjectModel.getTechNames(project).forEach(tech => {
            if (!index.byTech.has(tech)) {
                index.byTech.set(tech, []);
            }
            index.byTech.get(tech).push(project);
        });
        const status = ProjectModel.getStatus(project);
        if (!index.byStatus.has(status)) {
            index.byStatus.set(status, []);
        }
        index.byStatus.get(status).push(project);
    }

    static queryIndex(index, queryObj) {
        let results = index.all;
        if (queryObj.category) {
            results = results.filter(p =>
                p.category === queryObj.category ||
                p.category_es === queryObj.category
            );
        }
        if (queryObj.tech) {
            results = results.filter(p =>
                ProjectModel.getTechNames(p).some(tech =>
                    tech.toLowerCase() === queryObj.tech.toLowerCase()
                )
            );
        }
        if (queryObj.status) {
            results = results.filter(p => ProjectModel.getStatus(p) === queryObj.status);
        }
        if (queryObj.text) {
            results = SearchService.search(results, queryObj.text, queryObj.lang || 'en');
        }
        return results;
    }

    static find(index, criteria) {
        if (criteria.id) {
            return index.byId.get(criteria.id) || null;
        }
        if (criteria.category) {
            return index.byCategory.get(criteria.category) || [];
        }
        if (criteria.tech) {
            return index.byTech.get(criteria.tech) || [];
        }
        if (criteria.status) {
            return index.byStatus.get(criteria.status) || [];
        }
        return index.all;
    }

    static rebuildIndex(projects) {
        return this.buildIndex(projects);
    }
}
