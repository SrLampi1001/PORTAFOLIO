import XMLconverter from "../../models/XMLconverter.js";
const params = new URLSearchParams(window.location.search)
const id = params.has('id') ? params.get('id') : null //gets the project id
const xml = params.has('xml') ? params.get('xml') : "not-found.xml" //gets the xml archive from the project
const converter = new XMLconverter(`./../media/data/${xml}`)
converter.createDetailsPage(id)
//Code to execute after load
const link = document.querySelector(".nav-link"); link.setAttribute("href", "./../")
const imgs = document.querySelector(".imgs");
const mainImg = document.querySelector('#mainImg')

/* imgs.addEventListener('click', e=>{
    if(e.target.tagName==="IMG"){
        imgs.querySelector(".active").classList.remove('active')
        e.target.classList.add("active")
        mainImg.src = e.target.src
    }
}) */
