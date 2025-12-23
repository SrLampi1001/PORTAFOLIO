const body = document.querySelector("body");
const maxThree = body.querySelectorAll(".max-three-elements"); /* Get all elements with 3 max elements for display */
for (const element of maxThree) {
    /* Expected to be inside a function */
    const showMoreButton = document.createElement("button"); showMoreButton.classList.add("btn-calm"); showMoreButton.textContent = "Ver Más";
    element.insertBefore(showMoreButton, element.children[3]) /* The 3 element will be a function parameter */
    showMoreButton.addEventListener("click", (e)=>{
        e.target.parentElement.classList.toggle("max-three-elements"); /* The class to be changed will be other function parameter */
        if (e.target.textContent == "Ocultar"){
            e.target.parentElement.insertBefore(e.target, e.target.parentElement.children[3])
            e.target.textContent = "Ver Más";
        } else{
            e.target.parentElement.append(e.target);
            e.target.textContent = "Ocultar";
        }
    }
    )
}