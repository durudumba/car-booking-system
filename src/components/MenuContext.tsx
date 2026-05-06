import React, {useState} from "react";

interface MenuNameType {
    menuName: string,
    setMenuName: any
}
const initMenuName: MenuNameType = {
    menuName: '',
    setMenuName: null
}

export const MenuContext = React.createContext<MenuNameType>(initMenuName);

export const MenuProvider =({children}: any) => {
    const [menuName, setMenuName] = useState<string>('');

    return (
        <MenuContext.Provider value={{menuName, setMenuName}}>
            {children}
        </MenuContext.Provider>
    )
}
