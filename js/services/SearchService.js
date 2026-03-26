class SearchService {
    static search(projects, query, lang = 'en') {
        if (!query || query.trim() === '') {
            return projects;
        }
        const normalizedQuery = query.toLowerCase().trim();
        return projects.filter(project => {
            const name = ProjectModel.getName(project, lang).toLowerCase();
            const description = ProjectModel.getDescription(project, lang).toLowerCase();
            const category = ProjectModel.getCategory(project, lang).toLowerCase();
            const techs = ProjectModel.getTechNames(project).map(t => t.toLowerCase());
            return (
                this.fuzzyMatch(name, normalizedQuery) ||
                this.fuzzyMatch(description, normalizedQuery) ||
                this.fuzzyMatch(category, normalizedQuery) ||
                techs.some(tech => this.fuzzyMatch(tech, normalizedQuery))
            );
        });
    }

    static fuzzyMatch(text, query) {
        const normalizedText = text.toLowerCase();
        const normalizedQuery = query.toLowerCase();
        if (normalizedText.includes(normalizedQuery)) {
            return true;
        }
        const regex = this.buildRegex(normalizedQuery);
        return regex.test(normalizedText);
    }

    static buildRegex(query) {
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(escapedQuery, 'i');
    }

    static highlightMatches(text, query) {
        if (!query) return text;
        const regex = this.buildRegex(query);
        return text.replace(regex, match => `<mark>${match}</mark>`);
    }

    static searchByField(projects, field, query, lang = 'en') {
        return projects.filter(project => {
            let value;
            switch (field) {
                case 'name':
                    value = ProjectModel.getName(project, lang);
                    break;
                case 'description':
                    value = ProjectModel.getDescription(project, lang);
                    break;
                case 'category':
                    value = ProjectModel.getCategory(project, lang);
                    break;
                case 'tech':
                    return ProjectModel.getTechNames(project).some(tech =>
                        this.fuzzyMatch(tech, query)
                    );
                default:
                    return false;
            }
            return this.fuzzyMatch(value, query);
        });
    }

    static getSearchSuggestions(projects, partialQuery, lang = 'en', maxSuggestions = 5) {
        if (!partialQuery || partialQuery.length < 2) {
            return [];
        }
        const normalizedQuery = partialQuery.toLowerCase();
        const suggestions = new Set();
        projects.forEach(project => {
            const name = ProjectModel.getName(project, lang);
            if (this.fuzzyMatch(name, normalizedQuery)) {
                suggestions.add(name);
            }
            ProjectModel.getTechNames(project).forEach(tech => {
                if (this.fuzzyMatch(tech, normalizedQuery)) {
                    suggestions.add(tech);
                }
            });
        });
        return Array.from(suggestions).slice(0, maxSuggestions);
    }
}
