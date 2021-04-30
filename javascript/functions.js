const modal = {
    open(){
        //Abrir modal adicionando a classe active ao modal       
        document.querySelector('.modal-overlay').classList.add('active'); 
    },
    close(){
        //Fechar modal removendo a classe active do modal
        document.querySelector('.modal-overlay').classList.remove('active'); 
    }
 }