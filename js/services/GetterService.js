class GetterService {
    static async getProjects(dataPath) {
        const rawData = await JSONParser.fetchJSON(dataPath);
        return JSONParser.parseMultiple(rawData);
    }

    static async getProjectById(id, dataPath) {
        const projects = await this.getProjects(dataPath);
        return projects.find(project => ProjectModel.getId(project) === id);
    }

    static async getProjectsByCategory(category, dataPath) {
        const projects = await this.getProjects(dataPath);
        return this.filterByCategory(projects, category);
    }

    static async getProjectsByStatus(status, dataPath) {
        const projects = await this.getProjects(dataPath);
        return this.filterByStatus(projects, status);
    }

    static filterByCategory(projects, category) {
        return projects.filter(project => {
            return project.category === category || project.category_es === category;
        });
    }

    static filterByTech(projects, tech) {
        return projects.filter(project => {
            const techNames = ProjectModel.getTechNames(project);
            return techNames.some(name => name.toLowerCase() === tech.toLowerCase());
        });
    }

    static filterByStatus(projects, status) {
        return projects.filter(project => ProjectModel.getStatus(project) === status);
    }

    static sortByDate(projects, order = 'desc') {
        return [...projects].sort((a, b) => {
            const dateA = new Date(a.date.split('/').reverse().join('-'));
            const dateB = new Date(b.date.split('/').reverse().join('-'));
            return order === 'desc' ? dateB - dateA : dateA - dateB;
        });
    }

    static sortByName(projects, order = 'asc', lang = 'en') {
        return [...projects].sort((a, b) => {
            const nameA = ProjectModel.getName(a, lang).toLowerCase();
            const nameB = ProjectModel.getName(b, lang).toLowerCase();
            return order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });
    }

    static paginate(projects, page = 1, limit = 10) {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        return {
            items: projects.slice(startIndex, endIndex),
            total: projects.length,
            page,
            limit,
            totalPages: Math.ceil(projects.length / limit),
            hasNext: endIndex < projects.length,
            hasPrev: page > 1
        };
    }

    static getCategories(projects) {
        const categories = new Set();
        projects.forEach(project => {
            if (project.category) categories.add(project.category);
            if (project.category_es) categories.add(project.category_es);
        });
        return Array.from(categories);
    }

    static getAllTechs(projects) {
        const techs = new Set();
        projects.forEach(project => {
            ProjectModel.getTechNames(project).forEach(tech => techs.add(tech));
        });
        return Array.from(techs);
    }
}
