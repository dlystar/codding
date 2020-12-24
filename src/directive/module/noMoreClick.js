export default {
    inserted: (el, binding) => {
        if(el.tagName === 'BUTTON' || el.target === 'INPUT'){
            el.addEventListener('click', e => {
                el.classList.add('is-disabled');
                el.disabled = true;
                setTimeout(() => {
                    el.disabled = false;
                    el.classList.remove('is-disabled');
                }, 1000)
            })
        }
        if(el.tagName === 'DIV'){
            el.children[2].addEventListener('keydown', e => {
                if(e.keyCode == 13){
                    e.target.classList.add('is-disabled');
                    e.target.disabled = true;
                    setTimeout(() => {
                        e.target.disabled = false;
                        e.target.classList.remove('is-disabled');
                    }, 1000)
                }
            })
        }
    }
}
