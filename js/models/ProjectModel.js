class ProjectModel {
    static create(data) {
        return {
            id: data.id,
            status: data.status || 'complete',
            category: data.category,
            category_es: data.category_es,
            project_name: data.project_name,
            project_name_es: data.project_name_es,
            description: data.description,
            description_es: data.description_es,
            thumbnail: data.thumbnail,
            version: data.version || '1.0',
            authors: data.authors || [],
            code_url: data.code_url,
            techs: data.techs || [],
            date: data.date,
            components: data.components || []
        };
    }

    static getId(project) {
        return project.id;
    }

    static getCategory(project, lang = 'en') {
        return lang === 'es' ? project.category_es : project.category;
    }

    static getName(project, lang = 'en') {
        return lang === 'es' ? project.project_name_es : project.project_name;
    }

    static getDescription(project, lang = 'en') {
        return lang === 'es' ? project.description_es : project.description;
    }

    static getTechs(project) {
        return project.techs;
    }

    static getTechNames(project) {
        return project.techs.map(tech => tech.name);
    }

    static getTechByType(project, type) {
        return project.techs.filter(tech => tech.type === type);
    }

    static getComponents(project) {
        return project.components;
    }

    static getStatus(project) {
        return project.status;
    }

    static isComplete(project) {
        return project.status === 'complete';
    }

    static isIncomplete(project) {
        return project.status === 'incomplete';
    }

    static getThumbnail(project) {
        return project.thumbnail;
    }

    static getDate(project) {
        return project.date;
    }

    static getAuthors(project) {
        return project.authors;
    }

    static getCodeUrl(project) {
        return project.code_url;
    }

    static getVersion(project) {
        return project.version;
    }
}
