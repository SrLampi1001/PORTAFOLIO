# Portfolio Architecture
> Documentation for the data flow, architecture patterns, and class responsibilities in the Portfolio project.

> This portfolio uses a **static-first approach**: all classes use **static methods only**, no instances are created.

---

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CONTROLLERS                              │
│  (DOM manipulation - no business logic)                         │
│  └─ CardController, ComponentController, BreadcrumbController   │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                         SERVICES                                │
│  (Business logic - data transformation & filtering)             │
│  └─ GetterService, SearchService, IndexerService                │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                          MODELS                                 │
│  (Data access layer - parsing & structure)                     │
│  └─ JSONParser, ProjectModel, ComponentModel                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Structure

### Project Model (JSON)
```json
{
  "id": "us-1",
  "status": "complete",
  "category": "CLI Application",
  "category_es": "Aplicación ILC",
  "project_name": "User story 1",
  "project_name_es": "Historia de usuario 1",
  "description": "...",
  "description_es": "...",
  "thumbnail": "/media/images/screenshots/...",
  "version": "1.0",
  "authors": ["Santiago Sánchez Ruiz"],
  "code_url": "https://github.com/...",
  "techs": [
    { "type": "language", "name": "Python" },
    { "type": "code-editor", "name": "Terminal" }
  ],
  "date": "14/11/2025",
  "components": [
    {
      "name": "app.py",
      "type": "Script",
      "details": "...",
      "details_es": "..."
    }
  ]
}
```

---

## Models (Data Access Layer)

### JSONParser
**Responsibility:** Fetch and parse JSON files into JavaScript objects.

```javascript
class JSONParser {
    static async fetchJSON(filePath) { }
    static parseProject(rawData) { }
    static parseComponent(rawData) { }
}
```

### ProjectModel
**Responsibility:** Define the structure and validation of a Project entity.

```javascript
class ProjectModel {
    static create(data) { }
    static getId(project) { }
    static getCategory(project, lang) { }
    static getName(project, lang) { }
    static getDescription(project, lang) { }
    static getTechs(project) { }
    static getComponents(project) { }
    static getStatus(project) { }
    static isComplete(project) { }
    static getThumbnail(project) { }
    static getDate(project) { }
    static getAuthors(project) { }
    static getCodeUrl(project) { }
}
```

### ComponentModel
**Responsibility:** Define the structure and validation of a Component entity.

```javascript
class ComponentModel {
    static create(data) { }
    static getName(component) { }
    static getType(component) { }
    static getDetails(component, lang) { }
}
```

---

## Services (Business Logic Layer)

### GetterService
**Responsibility:** Retrieve and filter data based on criteria.

```javascript
class GetterService {
    static async getProjects(dataPath) { }
    static async getProjectById(id, dataPath) { }
    static async getProjectsByCategory(category, dataPath) { }
    static async getProjectsByStatus(status, dataPath) { }
    static filterByCategory(projects, category) { }
    static filterByTech(projects, tech) { }
    static sortByDate(projects, order) { }
    static sortByName(projects, order) { }
    static paginate(projects, page, limit) { }
}
```

### SearchService
**Responsibility:** Handle search operations with regex and partial matching.

```javascript
class SearchService {
    static search(projects, query) { }
    static fuzzyMatch(text, query) { }
    static buildRegex(query) { }
    static highlightMatches(text, query) { }
}
```

### IndexerService
**Responsibility:** Build and query an index for fast MongoDB-like searches.

```javascript
class IndexerService {
    static buildIndex(projects) { }
    static addToIndex(project) { }
    static queryIndex(queryObj) { }
    static find({ category, tech, status, text }) { }
}
```

---

## Controllers (Presentation Layer)

### DOMController
**Responsibility:** Handle DOM insertion. No business logic.

```javascript
class DOMController {
    static insert(element, targetSelector) { }
    static insertHTML(html, targetSelector) { }
    static clear(targetSelector) { }
    static remove(element) { }
    static replace(element, newElement) { }
}
```

### CardController
**Responsibility:** Create and render project cards.

```javascript
class CardController {
    static createCard(project, lang) { }
    static createCardHTML(project, lang) { }
    static renderCards(projects, containerSelector, lang) { }
    static attachCardListeners(cards) { }
}
```

### ComponentController
**Responsibility:** Create and render component lists.

```javascript
class ComponentController {
    static createComponentItem(component, lang) { }
    static createComponentList(components, lang) { }
    static renderComponentList(project, containerSelector, lang) { }
}
```

### BreadcrumbController
**Responsibility:** Create navigation breadcrumbs.

```javascript
class BreadcrumbController {
    static createPath(pathArray) { }
    static addCrumb(label, href) { }
    static render(containerSelector) { }
}
```

---

## Language Support

All text-related methods accept a `lang` parameter:
- `lang = 'en'` → returns English text
- `lang = 'es'` → returns Spanish text
- Default: `'en'`

```javascript
// Example usage:
ProjectModel.getName(project, 'es')  // Returns Spanish name
ProjectModel.getName(project)        // Returns English name (default)
```

---

## File Structure

```
js/
├─ models/
│  ├─ JSONParser.js
│  ├─ ProjectModel.js
│  └─ ComponentModel.js
│
├─ services/
│  ├─ GetterService.js
│  ├─ SearchService.js
│  └─ IndexerService.js
│
├─ controllers/
│  ├─ DOMController.js
│  ├─ CardController.js
│  ├─ ComponentController.js
│  └─ BreadcrumbController.js
│
└─ main.js              # Entry point, initializes everything
```

---

## Usage Flow

### 1. Fetch and Parse Data
```javascript
const rawData = await JSONParser.fetchJSON('./media/data/projects.json');
const projects = rawData.map(data => ProjectModel.create(data));
```

### 2. Business Logic (Services)
```javascript
const filtered = GetterService.filterByCategory(projects, 'CLI Application');
const results = SearchService.search(filtered, 'python');
```

### 3. DOM Insertion (Controllers)
```javascript
CardController.renderCards(results, '#projects-container', 'en');
```

---

## Migration Notes

- XMLParser is deprecated → replaced by JSONParser
- HTMLWritter functionality merged into Controllers
- getterService renamed to GetterService (PascalCase for classes)
- DOMinserter renamed to DOMController
