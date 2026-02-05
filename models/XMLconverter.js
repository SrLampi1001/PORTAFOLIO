export default class XMLconverter{
    constructor(URL){
        this.URL = URL
        this.XML = this.getXml(URL)
    }
    getXml(url){
        const regex = /[^/]+$/; 
        const match = url.match(regex);
        return match ? match[0] : null;
    }
    async getProject(project_id){
        try{
            const response = await fetch(this.URL, {
                method:"GET",
                headers:{"Content-Type":"application/xml"}
            })
            const text = await response.text()
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "application/xml");
            return xmlDoc.querySelector(`project[id=${project_id}`)
        } catch(error){
            console.error("HTTP Error, trying to fetch xml archive", error)
            return null
        }
    }
    async createDetailsPage(project_id, es = null){
        const project = await this.getProject(project_id)
        //Get the details from the projet
        const title = es === "es" ? project.querySelector("project_name_es")?.textContent : project.querySelector("project_name")?.textContent;
        const details = es === "es"? project.querySelector("description_es")?.textContent : project.querySelector("description")?.textContent;
        const version = project.querySelector('version')?.textContent;
        //images
        const images = this.getHTMLDetailsImages(project.querySelector("images"));
        console.log(images)
        //authors
        const authors = project.querySelectorAll('author');
        this.getHTMLDetailsAuthors(authors)
        //Links
        const links = project.querySelectorAll("url");
        this.getHTMLDetailsLinks(links)
        //techs
        const techs = project.querySelector('techs');
        this.getHTMLDetailsTechs(techs)
        //components
        const components = project.querySelectorAll('components') //cases where more than one components tag exists can happen
        this.getHTMLDetailsComponents(components)
    }
    getHTMLDetailsComponents(components){
        //console.log(components)
    }
    getHTMLDetailsAuthors(authors){
        //console.log(authors)
    }
    getHTMLDetailsImages(images){
        if(!images)return null
        const template = document.createElement('div');
        template.classList.add('row', 'g-5');
        const img_c = document.createElement('div'); img_c.classList.add("col-lg-7");
        img_c.innerHTML = `
            <img src="${images.querySelector('[type=thumbnail]').textContent || "#"}" id="mainImg" class="main-project-img shadow-sm mb-3" alt="Thumbnail">
        `;
        const img_s = document.createElement('div');
        img_s.classList.add('row', 'g-2', 'imgs');
        for(const image of images.children){
            const img = document.createElement('div');
            img.classList.add('col-3');
            img.innerHTML = `<img src="./..${image.textContent || "#"}" class="thumb-img" alt="${image.getAttribute('type') || "image"}">`;
            img_s.appendChild(img)
        }
        img_c.appendChild(img_s);
        return img_c;
    }
    getHTMLDetailsLinks(links){
        //console.log(links)
    }
    getHTMLDetailsTechs(techs){
        //console.log(techs)
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
                <a type="button" class="btn btn-info" href="./details.html?id=${project.getAttribute("id")}&xml=${this.XML}" data-details-${project.getAttribute("id")}>Details</a>
                <a class="btn btn-success" href="${codeLink.textContent}" target="blank">Repository</a>
                ${pageLink ? `<a class="btn btn-warning" href="${pageLink.textContent}" target="blank">Github Page</a>` : ""}
            </div>
        `;
        return template;
    }
}