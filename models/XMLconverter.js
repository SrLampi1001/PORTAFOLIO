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
        //chargues project
        const project = await this.getProject(project_id);
        if(!project)return null //return null in case project doesn't exists
        //Main container
        const m_c = document.createElement("div"); m_c.classList.add("container", "mb-5"); m_c.setAttribute("data-main-container", "");
        //Bootstrap 5 row
        const row = document.createElement('div'); row.classList.add('row', 'g-5'); 
        //Container project information
        const p_c = document.createElement("div"); p_c.classList.add("col-lg-5");
        //Get the details from the projet
        const title = es === "es" ? project.querySelector("project_name_es")?.textContent : project.querySelector("project_name")?.textContent;
        const category = es === "es" ? project.getAttribute("category_es") : project.getAttribute("category");
        const details = es === "es"? project.querySelector("description_es")?.textContent : project.querySelector("description")?.textContent;
        const version = project.querySelector('version')?.textContent;
        const date = project.querySelector("date")?.textContent;
        
        p_c.innerHTML = `
        <nav aria-label="breadcrumb">       <!--Add breadcrumb, must be modified from the page script-->
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="#" class="text-decoration-none text-muted"></a></li>
                <li class="breadcrumb-item active" aria-current="page"></li>
            </ol>
        </nav>
        <span class="project-category">${category}</span>
        <h1>${title}</h1>
        <div class="mb-4">
            <span class="author-badge me-2"><i class="fas fa-calendar-alt me-1"></i> ${date}</span>
            <span class="author-badge"><i class="fa-solid fa-code-branch"></i> ${version}</span>
        </div>
        <h5 class="fw-bold">${es === "es" ? "Descripción" : "Details"}</h5>
        <p class="text-muted">
            ${details}
        </p>`;
        //authors
        const authors = this.getHTMLDetailsAuthors(project.querySelectorAll('author'), es)
        p_c.append(authors);
        //techs
        const techs = this.getHTMLDetailsTechs(project.querySelector('techs'), es);
        p_c.append(techs)
        //Links
        const links = this.getHTMLDetailsLinks(project.querySelectorAll("url"), es);
        p_c.appendChild(links)
        //images
        const images = this.getHTMLDetailsImages(project.querySelector("images"));
        row.appendChild(images) //Add all images into row
        row.appendChild(p_c); //Add all details into row
        //components
        const components =  this.getHTMLDetailsComponents(project.querySelectorAll('components'), es);
        m_c.appendChild(row); //Append the first row
        m_c.appendChild(components); //Append the components
        return m_c; //Return the main container
    }
    getHTMLDetailsComponents(components, es){
        if(!components)return null
        const row = document.createElement("div"); row.classList.add("row", "mt-5");
        row.innerHTML = `
        <div class="col-12">
            <div class="org-section">
                <h4 class="fw-bold mb-4"><i class="fas fa-sitemap me-2 text-primary"></i>${es==="es" ?"Organización del Proyecto" : "Project structure"}
                <div class="d-inline-flex gap-2"></div>
                </h4>
            </div>
        </div>`;
        const row2 = document.createElement("div"); row2.classList.add("row");
        const structure = document.createElement("div"); structure.classList.add("col-md-6");
        const details = document.createElement("div"); details.classList.add("col-md-6","d-flex","align-items-center","justify-content-center", "flex-column");
        details.innerHTML = ` 
        <div class="text-center p-4 border rounded-4 bg-white shadow-sm">
            <i class="fas fa-layer-group display-4 text-primary mb-3"></i>
            <p class="mb-0 fw-bold">Arquitectura Modular</p>
        </div>`; //Placeholder, it's only visual and does not mean anything, it's supposed to be replaced by the eventListener
        const l = [];
        for (const comps of components){
            const r = this.createListComponents(comps, es)
            l.push(r)
            const btn = document.createElement("button"); btn.classList.add("btn","btn-secondary","text-muted");
            btn.setAttribute("type", "button"); btn.textContent = comps.getAttribute("type") || "main"
            btn.addEventListener("click", ()=>{ //Add event listener to changue content dinamically
                structure.innerHTML = "";
                structure.appendChild(r)
            })
            row.querySelector(".org-section > h4 > div").appendChild(btn)
        }
        structure.addEventListener("click", e=>{ //Sets the addEventListener for structure to see details from components
            console.log(e.target.hasAttribute("data-structure"))
            if(e.target && e.target.hasAttribute("data-structure")){
                const div  = `<div class="text-center p-4 border rounded-4 bg-white shadow-sm">
                    <i class="${e.target.data_type.toLowerCase().replaceAll(" ", "")}-icon display-4 text-primary mb-3"></i>
                    <p class="mb-0 fw-bold">${e.target.data_details}</p>
                </div>`;
                details.innerHTML = div; //Changues all innerHTML
            }
        })
        structure.appendChild(l[0])
        row2.appendChild(structure); //Append the structure part
        row2.appendChild(details); //Append the details part
        row.querySelector(".org-section").appendChild(row2); //Append the row into org-section
        return row //Returns the row
    }
    createListComponents(components, es){
        if(!components)return
        const ul = document.createElement("ul"); ul.classList.add("file-tree");
        for (const comp of components.children){
            if(comp.getAttribute("type")==="collection"){
                for(const c of comp.querySelectorAll("name")){
                    const li = document.createElement("li"); li.setAttribute("data-structure", "")
                    li.textContent = c.textContent;
                    li.data_type = c.getAttribute("type");
                    li.data_details = es === "es" ? `Un archivo de ${c.getAttribute("type")}`:`A ${c.getAttribute("type")} file`;
                    ul.appendChild(li)
                }
                continue;
            }
            const type = comp.querySelector("type")?.textContent;
            const name = comp.querySelector("name")?.textContent;
            const details = es === "es" ? comp.querySelector("details_es").textContent : comp.querySelector("details").textContent;
            const li = document.createElement("li"); li.setAttribute("data-structure", "")
            li.data_type = type; //Create an attribute type inside the object for details page
            li.data_details = details; //Create an attribute details inside the object for details page
            li.textContent = name;
            if(type === "Folder"){
                const li_comp = this.createListComponents(comp.querySelector("contents"), es);
                li.appendChild(li_comp)
            }
            ul.appendChild(li)
        }
        return ul;
    }
    getHTMLDetailsAuthors(authors, es = "null"){
        if(!authors)return null //In case authors does not exist
        const template = document.createElement("div"); template.classList.add("my-2");
        template.innerHTML = `<h5 class="fw-bold mb-3">${es === "es" ? "Autores": "Authors"}</h5>`;
        for(const auth of authors){
            const at = `<span class="author-badge me-2">
            ${auth.getAttribute("type")==="person"? '<i class="fas fa-user-circle me-1"></i>':'<i class="fa-solid fa-building-ngo"></i>'}
            ${auth.textContent}</span>`;
            template.innerHTML += at;
            /* if(auth.getAttribute("type")==="organization"){ //Make logic for organization authors
                console.log(auth.nextElement)
            } */
        }
        return template;
    }
    getHTMLDetailsTechs(techs, es = "null"){
        if(!techs)return null
        const template = document.createElement("div"); template.classList.add("my-4");
        template.innerHTML = `
            <h5 class="fw-bold mb-3">${es === "es" ? "Tecnologías": "Technologies"}</h5>
            <div class="d-flex flex-wrap gap-2"></div>`;
        const div = template.querySelector(".d-flex");
        for(const tech of techs.children){
            const t = `<span class="badge rounded-pill text-bg-light border px-3 py-2">
            <i class="${tech.textContent.toLowerCase().replaceAll(" ", "")}-icon"></i>
            ${tech.textContent}</span>`
            div.innerHTML += t;
        }
        return template
    }
    getHTMLDetailsImages(images){
        if(!images)return null
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
        img_s.addEventListener('click', e=>{
            if(e.target.tagName==="IMG"){
            img_s.querySelector(".active")?.classList.remove('active')
            e.target.classList.add("active")
            img_c.querySelector("#mainImg").src = e.target.src
        }
})
        img_c.appendChild(img_s);
        return img_c;
    }
    getHTMLDetailsLinks(links, es = null){
        const template = document.createElement("div"); template.classList.add("d-grid", "gap-2", "d-md-flex", "mt-5")
        for (const l of links){
            if(l.getAttribute("type")==="code-link") {
                const b = `<a class="btn btn-outline-dark rounded-pill px-4" href="${l.textContent}">
                <i class="fab fa-github me-2"></i>
                ${es==="es" ? "Repositorio":"Repository"}</a>`;
                template.innerHTML += b;
            } else if (l.getAttribute("type")==="page-link"){
                const b = `<a class="btn btn-glitch" href="${l.textContent}">
                <i class="fas fa-external-link-alt me-2"></i>
                WebPage ${l.getAttribute("alternative")||""}</a>`
                template.innerHTML += b;
            }
        }
        return template;

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