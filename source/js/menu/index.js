/**
 * Created by јртем on 15.01.2016.
 */
    'use strict';
//require('../../less/style.less');



class MainMenu
{
    constructor(options)
    {
        this._elem = options.element;

        this._elem.addEventListener('click', this._onClick.bind(this));
        this._elem.addEventListener('select', this._onItemSelect.bind(this));
    }
    //private method

    _onClick(event){
        event.stopPropagation(); //перекрывает всплытие выше контейнера меню
        let target = event.target;
        let menuItem = target.closest('.main-navigation__item');
        let dropDown = target.closest('[data-toggle=dropdown]');
        let select = new CustomEvent('select', {
            bubbles: true
        });

        menuItem.dispatchEvent(select);

        if(!dropDown){
            return;
        }

        event.preventDefault();
        let dropDownItem = dropDown.parentElement;
        let dropDownMenu = dropDownItem.querySelector('.dropdown-menu');

        dropDownMenu.classList.toggle('open');

    }

    _onItemSelect(event){
        let target = event.target.closest('.dropdown-item');

        if(!target){
            this.close();
        }

    }


    //public method

    close(){
        let allDropDowns = this._elem.querySelectorAll('.dropdown-menu');

        [].forEach.call(allDropDowns, function(item,index,arr){
            if(item.classList.contains('open')){
                item.classList.remove('open');
            }
        });
    }
}

module.exports = MainMenu;