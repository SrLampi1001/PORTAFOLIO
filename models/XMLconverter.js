export default class XMLconverter{
    constructor(URL){
        this.URL = URL
    }
    getProject(project_id){
        //logic to get project details
    }

    async getProjects(){
        try{
            const response = await fetch(this.URL, {
                method:"GET",
                headers:{"Content-Type":"application/xml"}
            })
            const text = await response.text()
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "application/xml");
            return xmlDoc.querySelectorAll("project")
        } catch(error){
            console.error("HTTP ERROR, trying to fetch xml archive", error)
            return null
        }
    }
    async createDetailsCards(){
        const projects = await this.getProjects();
        const arr = [];
        for (const project of projects){
            arr.push(this.createDetailsCard(project))
        }
        return arr;
    }
    async createDetailsCard(project, es = null){ //es -> get the details in spanish
        const title = es === "es" ? project.querySelector("project_name_es") : project.querySelector("project_name");
        const details = es === "es"? project.querySelector("description_es") : project.querySelector("description");
        const image = project.querySelector("image[type=thumbnail]");
        const codeLink = project.querySelector("url[type=code-link]");
        const pageLink = project.querySelector("url[type=page-link]");
        const template = document.createElement("div"); template.classList.add("card","col-lg-3","col-md-5")
        template.innerHTML = `
            <img class="card-img-top" src="./..${image.textContent}" alt="${title.textContent}" title="thumbnail"/>
            <div class="card-body">
                <h4 class="card-title">${title.textContent}</h4>
                <p class="card-text">${details.textContent.length > 100 ? details.textContent.slice(0, 100)+"..." : details.textContent}</p>
                <button type="button" class="btn btn-info" data-details-${project.getAttribute("id")}>Details</button>
                <a class="btn btn-success" href="${codeLink.textContent}" target="blank">Repository</a>
                ${pageLink ? `<a class="btn btn-warning" href="${pageLink.textContent}" target="blank">Github Page</a>` : ""}
            </div>
        `;
        return template;
    }
}