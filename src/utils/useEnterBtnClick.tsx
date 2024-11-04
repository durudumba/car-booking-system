import {useEffect, useRef} from "react";


function UseEnterBtnClick () {
    const buttonElement = useRef <HTMLButtonElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if(event.key === 'Enter') {
                buttonElement.current && buttonElement.current.click();
            }
        }
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    },[]);

    return buttonElement;
}

export default UseEnterBtnClick