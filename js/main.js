const body = document.querySelector("body");
const maxThree = body.querySelectorAll(".max-three-elements"); /* Get all elements with 3 max elements for display */
const maxFour = body.querySelectorAll(".max-four-elements");

function ShowHiddenContent(max_elements, classToAdapt, element){
    const showMoreButton = document.createElement("button"); showMoreButton.classList.add("btn-calm"); showMoreButton.textContent = "Ver Más";
    element.insertBefore(showMoreButton, element.children[max_elements]) /* The 3 element will be a function parameter */
    showMoreButton.addEventListener("click", (e)=>{
        e.target.parentElement.classList.toggle(classToAdapt); /* The class to be changed will be other function parameter */
        if (e.target.textContent == "Ocultar"){
            e.target.parentElement.insertBefore(e.target, e.target.parentElement.children[max_elements])
            e.target.textContent = "Ver Más";
        } else{
            e.target.parentElement.append(e.target);
            e.target.textContent = "Ocultar";
        }
    }
)
}
for (const element of maxThree) {
    ShowHiddenContent(3, "max-three-elements", element)
}
for (const elem of maxFour) {
    ShowHiddenContent(4, "max-four-elements", elem)
}