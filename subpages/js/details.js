import XMLconverter from "../../models/XMLconverter.js";
const params = new URLSearchParams(window.location.search)
const id = params.has('id') ? params.get('id') : null //gets the project id
const xml = params.has('xml') ? params.get('xml') : "not-found.xml" //gets the xml archive from the project
const converter = new XMLconverter(`./../media/data/${xml}`)
const applyContent = async ()=>{
    const content = await converter.createDetailsPage(id, "es")
    console.log(content)
    document.querySelector("body").appendChild(content)
}
applyContent()
//Code to execute after load
const link = document.querySelector(".nav-link"); link.setAttribute("href", "./../")

