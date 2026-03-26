class JSONParser {
    static async fetchJSON(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching JSON from ${filePath}:`, error);
            throw error;
        }
    }

    static parseProject(rawData) {
        return {
            id: rawData.id || null,
            status: rawData.status || 'complete',
            category: rawData.category || null,
            category_es: rawData.category_es || null,
            project_name: rawData.project_name || null,
            project_name_es: rawData.project_name_es || null,
            description: rawData.description || null,
            description_es: rawData.description_es || null,
            thumbnail: rawData.thumbnail || null,
            version: rawData.version || '1.0',
            authors: Array.isArray(rawData.authors) ? rawData.authors : [],
            code_url: rawData.code_url || null,
            techs: Array.isArray(rawData.techs) ? rawData.techs.map(this.parseTech) : [],
            date: rawData.date || null,
            components: Array.isArray(rawData.components) ? rawData.components.map(this.parseComponent) : []
        };
    }

    static parseComponent(rawData) {
        return {
            name: rawData.name || null,
            type: rawData.type || null,
            details: rawData.details || null,
            details_es: rawData.details_es || null
        };
    }

    static parseTech(rawData) {
        return {
            type: rawData.type || null,
            name: rawData.name || null
        };
    }

    static parseMultiple(rawDataArray) {
        return rawDataArray.map(data => this.parseProject(data));
    }
}
