const Modal = {
    open(){
        const modalOn = document.querySelector('.modal-overlay')


        modalOn.classList.add('active');


    },
    close(){
      const modalOff = document.querySelector('.modal-overlay');


      modalOff.classList.remove('active')
    }
}