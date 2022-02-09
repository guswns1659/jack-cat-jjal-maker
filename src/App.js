import React, {useEffect} from "react";
import axios from "axios";
import Favorites from "./components/Favorites"
import Title from "./components/Title"
import CatForm from "./components/CatForm"
import MainCard from "./components/MainCard"

const jsonLocalStorage = {
    setItem: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: (key) => {
        return JSON.parse(localStorage.getItem(key));
    },
};

const fetchCat = async (text) => {
    const OPEN_API_DOMAIN = "https://cataas.com";
    const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
    const responseJson = await response.json();
    return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

const fetchCatWithAxios = async (text) => {
    const OPEN_API_DOMAIN = "https://cataas.com";
    const response = await axios.get(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
    const data = await response.data;
    return `${OPEN_API_DOMAIN}${data.url}`;
}

const App = () => {
    const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";

    // title
    const [counter, setCounter] = React.useState(() => {
        return jsonLocalStorage.getItem("counter") || 0
    });

    // mainCard
    const [mainCat, setMainCat] = React.useState(jsonLocalStorage.getItem("mainCat") || CAT1);
    const [heart, setHeart] = React.useState(jsonLocalStorage.getItem("heart") || '♡')

    async function setInitialCat() {
        const firstCat = await fetchCatWithAxios('First cat');
        setMainCat(firstCat);
    }

    useEffect(() => {
        setInitialCat();
    }, []);

    function onHeartClick(e) {
        e.preventDefault()
        if (heart === "💖") {
            setHeart("♡")
            jsonLocalStorage.setItem("heart", "♡")
            favorites.pop();
            setFavorites(favorites)
            jsonLocalStorage.setItem("favorites", favorites)
            return
        }
        setHeart("💖")
        jsonLocalStorage.setItem("heart", "💖")
        const newFavorites = [...favorites, mainCat];
        setFavorites(newFavorites)
        jsonLocalStorage.setItem("favorites", newFavorites)
    }

    // favorites
    const [favorites, setFavorites] = React.useState(() => {
        return jsonLocalStorage.getItem("favorites") || []
    });

    // form
    async function updateMainCat(value) {
        const mainCat = await fetchCatWithAxios(value);
        setMainCat(mainCat)
        jsonLocalStorage.setItem("mainCat", mainCat)

        setCounter((prev) => {
            const newCounter = prev + 1;
            jsonLocalStorage.setItem("counter", newCounter)
            return newCounter
        });

    }

    function initHeart() {
        if (heart === "💖") {
            setHeart("♡")
            jsonLocalStorage.setItem("heart", "♡")
        }
    }

    return (
        <div>
            <Title counter={counter}></Title>
            <CatForm updateMainCat={updateMainCat}
                     initHeart={initHeart}/>
            <MainCard
                img={mainCat}
                alt="Cat"
                onHeartClick={onHeartClick}
                heart={heart}
            ></MainCard>
            <Favorites favorites={favorites}></Favorites>
        </div>
    )
}

export default App;