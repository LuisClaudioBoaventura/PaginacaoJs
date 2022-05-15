const data=Array.from({length:29})//determina a quantidade itens
        .map((item, i)=>{
            return `<div class="item">Item${i + 1}</div>`
        })

//==================================================//

let perPage= 4 //quantidade de itens por pagina 
const state={
    page: 1,
    perPage,
    totalPages: Math.ceil(data.length / perPage),
    maxVisibleButtons: 5 //quantidade de paginas visiveis 
}

const html={
    get(element){
        return document.querySelector(element)
    }
}

//criando funçoes dentro de um objeto
const controls={
    next(){
        state.page++
        const lastPage = state.page > state.totalPages
        if(lastPage){
            state.page--
        }
    },
    prev(){
        state.page--
        const firstPage= state.page < 1
        if(firstPage){
            state.page++
        } 
    },
    goTo(page){
        state.page= +page

        if(page < 1){
            state.page = 1
        }

        if(page > state.totalPages){
            state.page = state.totalPages
        }
    },
    createListeners(){
        html.get('.first').addEventListener('click', ()=>{
            controls.goTo(1)
            update()
        })

        html.get('.last').addEventListener('click', ()=>{
            controls.goTo(state.totalPages)
            update()
        })

        html.get('.next').addEventListener('click', ()=>{
            controls.next()
            update()
        })

        html.get('.prev').addEventListener('click', ()=>{
            controls.prev()
            update()
        })
    }
}

const list = {
    create(item){
        
        const div = document.createElement('div')
        div.classList.add('.item')
        div.innerHTML= item
        html.get('.list').appendChild(div)
    },
    update(){
        html.get('.list').innerHTML=''

        let page = state.page-1
        let start = page * state.perPage
        let end = start + state.perPage
        
        const paginatedItems= data.slice(start, end)
        
        //html.get('.list').innerHTML=paginatedItems
        paginatedItems.forEach( (item) => list.create(item))
    }
}

const buttons = {
    element: html.get('.controls .numbers'),
    create(number) {
        const button = document.createElement('div')

        button.innerHTML = number

        if(state.page == number){
            button.classList.add('active')
        }

        button.addEventListener('click', (event)=>{
            const page = event.target.innerText
            controls.goTo(page)
            update()
        })

        buttons.element.appendChild(button)
    },
    update() {
        html.get('.controls .numbers').innerHTML = ''
        const {maxLeft, maxRigth} = buttons.cauculateMaxVisible()

        for(let page= maxLeft; page<=maxRigth; page++){
            buttons.create(page)
        }

    },
    cauculateMaxVisible(){
        const {maxVisibleButtons, totalPages} =state

        let maxLeft = (state.page - Math.floor(maxVisibleButtons/2))
        let maxRigth = state.page + Math.floor(maxVisibleButtons/2)

        if(maxLeft < 1){
            maxLeft=1
            maxRigth=maxVisibleButtons
        }

        if (maxRigth > totalPages){
            maxLeft = totalPages - ( maxVisibleButtons - 1 )
            maxRigth =  totalPages

            if(maxLeft<1) maxLeft=1
        }
        return { maxLeft, maxRigth }
    }
}

function update(){
    list.update()
    buttons.update()
} 

function init(){
    update()
    controls.createListeners()
}

init()