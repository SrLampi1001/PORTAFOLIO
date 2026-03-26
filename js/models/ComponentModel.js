class ComponentModel {
    static create(data) {
        return {
            name: data.name,
            type: data.type,
            details: data.details,
            details_es: data.details_es
        };
    }

    static getName(component) {
        return component.name;
    }

    static getType(component) {
        return component.type;
    }

    static getDetails(component, lang = 'en') {
        return lang === 'es' ? component.details_es : component.details;
    }

    static getIconClass(component) {
        const typeIcons = {
            'Script': 'fa-file-code',
            'Image': 'fa-file-image',
            'Markdown': 'fa-file-alt',
            'CSV': 'fa-file-csv',
            'JSON': 'fa-file-code',
            'Excel': 'fa-file-excel',
            'PDF': 'fa-file-pdf',
            'CSS': 'fa-file-code',
            'HTML': 'fa-file-code',
            'Python': 'fa-file-code'
        };
        return typeIcons[component.type] || 'fa-file';
    }
}
