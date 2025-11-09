import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const { loading, request, error, clearError } = useHttp();

    const _apiBase = 'https://marvel-server-zeta.vercel.app/';
    const _apiKey = 'd4eecb0c66dedbfae4eab45d312fc1df';
    const _baseOffset = 0;

    // === Получить список комиксов ===
    const getAllComics = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&apikey=${_apiKey}`);
        return res.data.results.map(_transformComics);
    };

    // === Преобразование данных ===
    const _transformComics = (comic) => {
        const thumbnail = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
        const isImageAvailable = !comic.thumbnail.path.includes('image_not_available');

        return {
            id: comic.id,
            title: comic.title || 'No title',
            price: comic.price ? `${comic.price}$` : 'NOT AVAILABLE',
            thumbnail,
            homepage: comic.urls?.[0]?.url || '#',
            imageAvailable: isImageAvailable
        };
    };

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&apikey=${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    };

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?apikey=${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    };

    const _transformCharacter = (char) => {
        const thumbnail = `${char.thumbnail.path}.${char.thumbnail.extension}`;
        const isImageAvailable = !char.thumbnail.path.includes('image_not_available');

        return {
            id: char.id,
            name: char.name || 'Имя отсутствует',
            description: char.description || 'Описание отсутствует',
            thumbnail,
            homepage: char.urls?.[0]?.url || '#',
            wiki: char.urls?.[1]?.url || '#',
            imageAvailable: isImageAvailable,
            // comics.items — это массив строк, а не объектов
            comics: (char.comics?.items || []).map(item => ({ name: item })),
        };
    };

    return { loading, error, getAllCharacters, getCharacter, clearError, getAllComics };
};

export default useMarvelService;